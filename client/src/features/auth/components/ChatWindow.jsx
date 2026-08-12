import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ messages, isLoading }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-20 py-10 custom-scrollbar bg-[#0B0E14]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .unravel-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .unravel-mono { font-family: ui-monospace, 'IBM Plex Mono', Menlo, Consolas, monospace; }
      `}</style>

      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          const isAssistant = msg.role === 'assistant' || msg.role === 'bot' || msg.role === 'ai';

          return (
            <div key={index} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
              {/* 🧑‍💻 USER MESSAGE */}
              {!isAssistant && (
                <div className="flex flex-col items-end max-w-[85%]">
                  <span className="unravel-mono text-[10px] tracking-[0.15em] text-[#5B5F68] uppercase mb-2 mr-1">You</span>
                  <div className="unravel-body bg-[#E8A33D] text-[#0B0E14] px-5 py-3 font-medium leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              )}

              {/* 🤖 UNRAVEL (AI) MESSAGE */}
              {isAssistant && (
                <div className="flex flex-col items-start w-full max-w-[95%]">
                  <span className="unravel-mono text-[10px] tracking-[0.15em] text-[#E8A33D] uppercase mb-3 ml-1">Unravel</span>

                  {isLoading && isLastMessage && (!msg.content || msg.content === "" || msg.content === "...") && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 px-4 py-2.5 bg-[#0F1219] border border-white/10 mb-4 w-fit"
                    >
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#E8A33D] animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-[#E8A33D] animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-[#E8A33D] animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="unravel-mono text-[10px] tracking-[0.15em] text-[#8B8F98] uppercase">
                        Thinking
                      </span>
                    </motion.div>
                  )}

                  {msg.content && msg.content !== "..." && msg.content !== "" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="unravel-body w-full bg-[#0F1219] border border-white/10 p-6 text-[#EDEAE2]"
                    >
                      <div className="prose prose-invert max-w-none text-[15px] leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={scrollRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatWindow;