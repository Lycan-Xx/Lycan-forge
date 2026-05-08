/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import FloatingCTA from './components/layout/FloatingCTA';
import { useStore } from './store/useStore';

// Pages
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  const isHome = useStore((state) => state.isHome);
  
  return (
    <div className="min-h-screen flex flex-col selection:bg-accent selection:text-white">
      {!isHome && <NavBar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:id" element={<ProjectDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isHome && <Footer />}
      {!isHome && <FloatingCTA />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
    </Router>
  );
}

