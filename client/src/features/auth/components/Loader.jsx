import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-[#0B0E14] flex flex-col items-center justify-center z-[9999]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,600&family=Inter:wght@400;500;600&display=swap');
        .unravel-display { font-family: 'Fraunces', Georgia, serif; }
        .unravel-mono { font-family: ui-monospace, 'IBM Plex Mono', Menlo, Consolas, monospace; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center"
      >
        <h2 className="unravel-display italic text-4xl font-medium text-[#EDEAE2] mb-6">
          Unravel<span className="text-[#E8A33D]">.</span>
        </h2>

        <div className="w-40 h-[1.5px] bg-white/10 overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-[#E8A33D]"
          />
        </div>

        <p className="unravel-mono mt-6 text-[10px] text-[#5B5F68] tracking-[0.25em] uppercase">
          Loading
        </p>
      </motion.div>
    </div>
  );
};

export default Loader;