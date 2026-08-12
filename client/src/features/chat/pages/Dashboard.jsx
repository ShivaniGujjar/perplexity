import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// 🛠️ Custom Hooks & Services
import { useChat } from "../hooks/useChat";
import { socket, initializeSocketConnection } from "../service/chat.socket";

// 📦 Redux Actions
import {
  updateStreamingMessage,
  addNewMessage,
  setCurrentChatId,
} from "../chat.slice";
import { logout } from "../../auth/auth.slice";

// 🧩 Components
import Sidebar from "../../auth/components/Sidebar";
import ChatModals from "../../auth/components/ChatModals";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "../../../features/auth/components/TypingIndicator";

// ✅ Import logoutUser from auth api
import { logoutUser } from "../../auth/services/auth.api";

// All hooks, socket wiring, redux actions, and handlers below are unchanged
// from the original — only the JSX/classes were restyled to match the rest
// of Unravel: ink navy board, one amber accent, thin borders, no blue-glow
// glass panels, serif display type for the greeting.

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId, isLoading } = useSelector(
    (state) => state.chat,
  );
  const chat = useChat();

  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(!!urlChatId);
  const [isComposingNewChat, setIsComposingNewChat] = useState(false);

  // 🛠️ States for Modals
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [deletingChatId, setDeletingChatId] = useState(null);

  const messagesEndRef = useRef(null);

  // 🚀 Rename Logic
  const handleRenameSubmit = async () => {
    if (!newTitle.trim()) return;
    try {
      await chat.handleRenameChat(editingChatId, newTitle);
      setEditingChatId(null);
      setNewTitle("");
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  // ✅ Fixed logout — no longer uses chat.api
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      dispatch(logout());
      window.location.replace("/login");
    }
  };

  const cleanTitle = (title) =>
    title ? title.replace(/\*\*/g, "") : "Untitled Chat";

  // ✅ Fixed — initializeSocketConnection called directly, not via chat hook
  useEffect(() => {
    initializeSocketConnection();
    chat.handleGetChats(); // Sidebar list mangwane ke liye

    socket.on("chat-chunk", (data) => {
      dispatch(updateStreamingMessage(data));
    });

    return () => {
      socket.off("chat-chunk");
    };
  }, []); // 👈 Isse empty rakho

  useEffect(() => {
    if (isComposingNewChat || urlChatId || currentChatId) {
      setActiveChat(true);
    } else if (!isLoading) {
      setActiveChat(false);
    }
  }, [urlChatId, currentChatId, isLoading, isComposingNewChat]);

  useEffect(() => {
    const syncChatOnReload = async () => {
      if (urlChatId) {
        dispatch(setCurrentChatId(urlChatId));
        await chat.handleOpenChat(urlChatId);
        setActiveChat(true);
      }
    };

    syncChatOnReload();
  }, [urlChatId, dispatch]);

  const handleNewChat = useCallback(() => {
    navigate("/");
    setActiveChat(false);
    setIsComposingNewChat(true);
    dispatch(setCurrentChatId(null));
  }, [navigate, dispatch]);

  const handleSend = useCallback(async () => {
    if (!socket.connected) initializeSocketConnection();
    if (!input.trim()) return;

    const userMessage = input;
    const targetChatId = urlChatId || currentChatId;
    setInput("");
    setActiveChat(true);

    if (targetChatId && !targetChatId.startsWith("temp-")) {
      dispatch(
        addNewMessage({
          chatId: targetChatId,
          role: "user",
          content: userMessage,
        }),
      );
      dispatch(
        addNewMessage({ chatId: targetChatId, role: "ai", content: "..." }),
      );
    }

    const result = await chat.handleSendMessage(userMessage, targetChatId);
    if (result?.newId && result.newId !== urlChatId) {
      setIsComposingNewChat(false);
      navigate(`/chat/${result.newId}`);
    }
  }, [input, urlChatId, currentChatId, chat, navigate, dispatch]);

  const currentMessages = (urlChatId && chats[urlChatId])
    ? chats[urlChatId].messages
    : [];

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [currentMessages]);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#EDEAE2] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,600&family=Inter:wght@400;500;600&display=swap');
        .unravel-display { font-family: 'Fraunces', Georgia, serif; }
        .unravel-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .unravel-mono { font-family: ui-monospace, 'IBM Plex Mono', Menlo, Consolas, monospace; }
      `}</style>

      {/* 📱 Mobile Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-[#0F1219] border border-white/10 text-[#EDEAE2]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chats={chats}
        urlChatId={urlChatId}
        navigate={navigate}
        handleNewChat={handleNewChat}
        user={user}
        handleLogout={handleLogout}
        setEditingChatId={setEditingChatId}
        setNewTitle={setNewTitle}
        setDeletingChatId={setDeletingChatId}
        cleanTitle={cleanTitle}
        setIsComposingNewChat={setIsComposingNewChat}
        setInput={setInput}
      />

      <div className="flex-1 flex flex-col bg-[#0B0E14] relative">
        {!(activeChat || isComposingNewChat) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden"
          >
            <div className="max-w-3xl w-full text-center z-10">
              <motion.h1
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="unravel-display italic text-5xl md:text-6xl font-medium mb-3 text-[#EDEAE2] tracking-tight"
              >
                Hello, {user?.username?.split(" ")[0] || "User"}.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="unravel-body text-lg text-[#8B8F98] mb-12"
              >
                Where knowledge begins.
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {[
                  { title: "Understand an algorithm", desc: "Explain it to me like I'm five.", icon: "💡" },
                  { title: "Refactor my code", desc: "Clean up my MERN stack logic.", icon: "⚡" },
                  { title: "Write a cover letter", desc: "For a Junior Developer role.", icon: "📝" },
                  { title: "IPL Match Update", desc: "Who is playing tonight?", icon: "🏏" },
                ].map((item, i) => {
                  const isSelected = input === item.title;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => {
                        setInput(item.title);
                        document.querySelector("input")?.focus();
                      }}
                      className={`p-5 cursor-pointer transition-colors group border ${
                        isSelected
                          ? "bg-[#E8A33D]/10 border-[#E8A33D]/50"
                          : "bg-[#0F1219] border-white/10 hover:border-white/25"
                      }`}
                    >
                      <div className="text-xl mb-2">{item.icon}</div>
                      <h3 className={`unravel-body text-sm font-semibold transition-colors ${isSelected ? "text-[#E8A33D]" : "text-[#EDEAE2] group-hover:text-[#E8A33D]"}`}>
                        {item.title}
                      </h3>
                      <p className="unravel-body text-xs text-[#8B8F98] mt-1">{item.desc}</p>
                      {isSelected && (
                        <motion.div
                          layoutId="activeDot"
                          className="w-1.5 h-1.5 bg-[#E8A33D] mt-2"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleNewChat}
                className="unravel-mono mt-10 text-[#8B8F98] hover:text-[#EDEAE2] text-xs tracking-[0.1em] transition-colors border-b border-transparent hover:border-white/30"
              >
                OR JUST START A NEW THREAD →
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar relative">
              <div className="max-w-4xl mx-auto space-y-10">
                <AnimatePresence mode="popLayout">
                  {currentMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className="unravel-mono flex items-center gap-2 mb-2 px-1 text-[#5B5F68] uppercase tracking-[0.15em] text-[9px]">
                        {msg.role === "user" ? "You" : "Assistant"}
                      </div>
                      <div
                        className={`max-w-[88%] px-6 py-4 ${
                          msg.role === "user"
                            ? "bg-[#E8A33D] text-[#0B0E14]"
                            : "bg-[#0F1219] border border-white/10 text-[#EDEAE2]"
                        }`}
                      >
                        <div className="unravel-body prose prose-invert max-w-none text-[15px] leading-relaxed">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} className="h-20" />
              </div>

              <button
                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="sticky bottom-4 float-right mr-4 p-2.5 bg-[#0F1219] border border-white/10 hover:border-[#E8A33D]/50 text-[#8B8F98] hover:text-[#E8A33D] transition-colors z-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-4xl mx-auto p-8 sticky bottom-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14] to-transparent"
            >
              <div className="relative flex items-center bg-[#0F1219] border border-white/10 p-3 focus-within:border-[#E8A33D]/50 transition-colors">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="unravel-body flex-1 px-4 py-3 bg-transparent outline-none text-[#EDEAE2] text-[16px] placeholder-[#5B5F68]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`p-3 transition-colors ${input.trim() ? "bg-[#E8A33D] text-[#0B0E14]" : "text-[#5B5F68]"}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polyline points="22 2 15 22 11 13 2 9 22 2"></polyline>
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <ChatModals
        editingChatId={editingChatId}
        setEditingChatId={setEditingChatId}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        handleRenameSubmit={handleRenameSubmit}
        deletingChatId={deletingChatId}
        setDeletingChatId={setDeletingChatId}
        handleDeleteConfirm={() => {
          chat.handleDeleteChat(deletingChatId);
          setDeletingChatId(null);
        }}
      />
    </div>
  );
};

export default Dashboard;