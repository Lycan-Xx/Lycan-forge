import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress THREE.Clock deprecation warning from third-party libraries
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (args[0]?.includes?.('THREE.Clock: This module has been deprecated')) return;
  originalWarn.apply(console, args);
};

// Prevent duplicate root creation during HMR
const container = document.getElementById('root');
let root = (container as any)?.__reactRoot;

if (!root) {
  root = createRoot(container!);
  (container as any).__reactRoot = root;
}

root.render(<App />);
