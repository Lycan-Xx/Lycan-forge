/**
 * POST /api/contact
 *
 * Vercel serverless function that emails contact-form enquiries through Resend.
 * Mail is sent TO client@lycanforge.com.ng (Cloudflare Email Routing then forwards
 * it to the owner's inbox) with Reply-To set to the visitor, so replying in your
 * mail client answers the enquirer directly.
 *
 * Environment variables (set in Vercel -> Project -> Settings -> Environment Variables):
 *   RESEND_API_KEY  required  Resend API key (server-side only, never VITE_ prefixed)
 *   CONTACT_TO      optional  defaults to client@lycanforge.com.ng
 *   CONTACT_FROM    optional  defaults to "LycanForge Website <noreply@lycanforge.com.ng>"
 *                             (the domain must be verified in Resend)
 */

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

const DEFAULT_TO = 'client@lycanforge.com.ng';
const DEFAULT_FROM = 'LycanForge Website <noreply@lycanforge.com.ng>';

const LIMITS = { name: 100, email: 200, phone: 40, message: 5000, choice: 120 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort per-instance rate limit. Serverless instances are recycled, so this
// only blunts bursts; the honeypot field does most of the bot filtering.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field. Pretend success to bots.
  if (text(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = text(body.name, LIMITS.name);
  const email = text(body.email, LIMITS.email);
  const phone = text(body.phone, LIMITS.phone);
  const message = text(body.message, LIMITS.message);
  const needs = text(body.needs, LIMITS.choice) || 'Not specified';
  const budget = text(body.budget, LIMITS.choice) || 'Not specified';
  const timeline = text(body.timeline, LIMITS.choice) || 'Not specified';

  if (!name || !EMAIL_PATTERN.test(email) || message.length < 5) {
    return res.status(400).json({ ok: false, error: 'invalid_input' });
  }

  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not configured');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const to = process.env.CONTACT_TO || DEFAULT_TO;
  const from = process.env.CONTACT_FROM || DEFAULT_FROM;
  const subject = oneLine(`New enquiry: ${name} - ${needs}`);

  const plain = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    '',
    'Requirements',
    `- Looking to build: ${needs}`,
    `- Budget: ${budget}`,
    `- Timeline: ${timeline}`,
    '',
    'Message',
    message,
  ].join('\n');

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#707967;vertical-align:top">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`;

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#11140f;line-height:1.5">
<h2 style="margin:0 0 12px">New project enquiry</h2>
<table style="border-collapse:collapse">
${row('Name', name)}${row('Email', email)}${row('Phone', phone || 'Not provided')}
${row('Building', needs)}${row('Budget', budget)}${row('Timeline', timeline)}
</table>
<h3 style="margin:20px 0 6px">Message</h3>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
<p style="margin-top:24px;color:#707967;font-size:12px">Sent from the lycanforge.com.ng contact form. Reply to this email to answer ${escapeHtml(name)} directly.</p>
</div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text: plain, html }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[contact] Resend rejected the message', response.status, detail);
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[contact] Could not reach Resend', error);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}
