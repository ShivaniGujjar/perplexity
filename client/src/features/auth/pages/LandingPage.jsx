import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// ==========================================
// The old version was the default "AI startup" template: navy bg, two
// blue/cyan blur orbs, gradient-clip italic headline, a dashboard mockup
// wrapped in three or four stacked glow layers, scale-105 button hover.
// None of it is specific to what "Unravel" actually does.
//
// The name is the brief: something tangled becomes something clear. So
// the signature element here is literal — a thread that starts knotted
// and straightens into a clean line — instead of ambient blue light.
// Typography leans editorial (serif) because the product's whole promise
// is "clear, cited answers," which reads closer to a research tool than
// a chat toy.
// ==========================================

const InkThread = () => (
  <svg viewBox="0 0 800 90" className="w-full h-auto" preserveAspectRatio="none" fill="none">
    <defs>
      <linearGradient id="threadGradient" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B6472" />
        <stop offset="35%" stopColor="#8A7550" />
        <stop offset="60%" stopColor="#E8A33D" />
        <stop offset="100%" stopColor="#E8A33D" />
      </linearGradient>
    </defs>
    <path
      d="M0,45 C18,15 36,75 54,45 C72,15 90,75 108,45 C124,18 142,72 160,48 Q205,45 250,45 L800,45"
      stroke="url(#threadGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#0B0E14] text-[#EDEAE2] flex flex-col items-center pt-32 px-6 relative overflow-visible">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,600&family=Inter:wght@400;500;600&display=swap');
        .unravel-display { font-family: 'Fraunces', Georgia, serif; }
        .unravel-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .unravel-mono { font-family: ui-monospace, 'IBM Plex Mono', Menlo, Consolas, monospace; }
      `}</style>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10 max-w-3xl"
      >
        <p className="unravel-mono text-xs text-[#8B8F98] tracking-[0.15em] mb-6">
          POWERED BY MISTRAL AI
        </p>

        <h1 className="unravel-display italic text-6xl md:text-7xl font-medium mb-3 leading-[1.02] tracking-tight text-[#EDEAE2]">
          Unravel the web.
        </h1>

        <div className="w-full max-w-xs mx-auto mb-8 opacity-80">
          <InkThread />
        </div>

        <p className="unravel-body text-lg text-[#B4B8C0] mb-12 max-w-xl mx-auto leading-relaxed">
          Stop searching. Start knowing. Unravel untangles complex questions
          into clear answers, with the sources cited right alongside them.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-24">
          <Link
            to="/login"
            className="bg-[#E8A33D] hover:bg-[#F2AE4A] text-[#0B0E14] px-8 py-3.5 font-semibold text-base transition-colors w-full md:w-auto text-center"
          >
            Get started free
          </Link>

          <button
            onClick={() => window.open('https://github.com/yourusername', '_blank')}
            className="border border-white/15 hover:border-white/30 text-[#EDEAE2] px-8 py-3.5 font-medium text-base transition-colors w-full md:w-auto"
          >
            View on GitHub
          </button>
        </div>
      </motion.div>

      {/* Dashboard preview — one clean frame, no stacked glow layers */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl relative z-10 mb-32"
      >
        <div className="border border-white/10 rounded-t-xl bg-[#0F1219] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="unravel-mono bg-black/30 border border-white/10 px-6 py-1.5 rounded-full text-[11px] text-[#8B8F98] tracking-wide">
              unravel-ai.com/dashboard
            </div>
            <div className="w-16" />
          </div>

          <div className="relative overflow-hidden">
            <img src="/landingpage.png" alt="Unravel Dashboard" className="w-full h-auto block" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0E14] to-transparent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;