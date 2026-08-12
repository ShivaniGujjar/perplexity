import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-8"
    >
      <div className="bg-[#0F1219] border border-white/10 px-5 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 bg-[#E8A33D]"
            />
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8B8F98]">
          Thinking
        </span>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;