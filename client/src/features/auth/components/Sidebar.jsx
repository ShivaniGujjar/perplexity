import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCurrentChatId } from "../../chat/chat.slice";

// Same system as the rest of Unravel: ink board, one amber accent, thin
// borders, sharp corners, serif wordmark. All chat-list/rename/delete/
// logout logic below is unchanged — only the JSX/classes were restyled.
//
// Note: removed the module-level `handleGoHome` that duplicated the one
// defined inside the component — it referenced props/hooks that don't
// exist at that scope and was dead code left over from the move (per the
// comment that was already there).

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  chats,
  urlChatId,
  navigate,
  handleNewChat,
  user,
  handleLogout,
  setEditingChatId,
  setNewTitle,
  setDeletingChatId,
  cleanTitle,
  setIsComposingNewChat,
  setInput,
}) => {
  const dispatch = useDispatch();

  const handleGoHome = () => {
    navigate('/');
    dispatch(setCurrentChatId(null));
    if (setIsComposingNewChat) setIsComposingNewChat(false);
    if (setInput) setInput("");
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="w-72 bg-[#0B0E14] p-5 flex flex-col justify-between border-r border-white/10 shrink-0 h-screen overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,600&family=Inter:wght@400;500;600&display=swap');
        .unravel-display { font-family: 'Fraunces', Georgia, serif; }
        .unravel-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .unravel-mono { font-family: ui-monospace, 'IBM Plex Mono', Menlo, Consolas, monospace; }
      `}</style>

      {/* 1. TOP SECTION (Title & Button) */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <button
          onClick={handleGoHome}
          className="flex items-center gap-3 px-2 py-6 text-left"
        >
          
          <span className="unravel-display italic text-2xl font-medium text-[#EDEAE2] leading-none">
            Un<span className="text-[#E8A33D]">ravel</span>
          </span>
        </button>

        <button
          onClick={handleNewChat}
          className="unravel-body w-full bg-[#E8A33D] hover:bg-[#F2AE4A] text-[#0B0E14] py-3 mb-8 transition-colors font-semibold text-sm shrink-0"
        >
          + New chat
        </button>

        <p className="unravel-mono text-[10px] text-[#5B5F68] uppercase tracking-[0.15em] mb-4 px-2 shrink-0">
          Recent threads
        </p>

        {/* 2. MIDDLE SECTION (Animated Chat List) */}
        <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
          <AnimatePresence mode="popLayout">
            {Object.values(chats)
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .map((c) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  key={c.id || c._id}
                  className={`group flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors mb-1 border ${
                    (urlChatId === c.id || urlChatId === c._id)
                      ? "bg-[#E8A33D]/10 border-[#E8A33D]/30 text-[#E8A33D]"
                      : "border-transparent text-[#8B8F98] hover:bg-white/5 hover:text-[#EDEAE2]"
                  }`}
                >
                  <span
                    className="unravel-body text-[13.5px] truncate font-medium flex-1 pr-2"
                    onClick={() => {
                      dispatch(setCurrentChatId(c.id || c._id));
                      if (setIsComposingNewChat) setIsComposingNewChat(false);
                      navigate(`/chat/${c.id || c._id}`);
                    }}
                  >
                    {cleanTitle(c.title)}
                  </span>

                  {/* 🛠️ Action Icons Area */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChatId(c.id || c._id);
                        setNewTitle(cleanTitle(c.title));
                      }}
                      className="p-1.5 hover:bg-white/10 text-[#8B8F98] hover:text-[#E8A33D]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingChatId(c.id || c._id);
                      }}
                      className="p-1.5 hover:bg-[#E8352B]/10 text-[#E8352B]/70 hover:text-[#E8352B]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. BOTTOM SECTION (User Profile & Logout) */}
      <div className="border-t border-white/10 pt-5 mt-auto shrink-0">
        <div className="flex items-center justify-between px-2 py-2 hover:bg-white/5 group transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#E8A33D]/40 text-[#E8A33D] flex items-center justify-center font-bold uppercase text-sm shrink-0">
              {user?.username?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="unravel-body text-sm font-semibold text-[#EDEAE2] truncate w-32">{user?.username || "User"}</p>
              <p className="unravel-mono text-[10px] text-[#8B8F98] tracking-wide">PRO TIER</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-[#8B8F98] hover:text-[#E8352B] hover:bg-[#E8352B]/10 transition-colors"
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;