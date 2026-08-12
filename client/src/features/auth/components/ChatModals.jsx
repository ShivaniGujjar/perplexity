import React from 'react';

const ChatModals = ({
  editingChatId,
  setEditingChatId,
  newTitle,
  setNewTitle,
  handleRenameSubmit,
  deletingChatId,
  setDeletingChatId,
  handleDeleteConfirm,
}) => {
  if (!editingChatId && !deletingChatId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,600&family=Inter:wght@400;500;600&display=swap');
        .unravel-display { font-family: 'Fraunces', Georgia, serif; }
        .unravel-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .unravel-mono { font-family: ui-monospace, 'IBM Plex Mono', Menlo, Consolas, monospace; }
      `}</style>

      <div className="unravel-body w-full max-w-sm bg-[#0F1219] border border-white/10 p-6">
        {/* --- RENAME MODAL --- */}
        {editingChatId && (
          <>
            <h3 className="unravel-display italic text-xl font-medium mb-4 text-[#EDEAE2]">Rename thread</h3>
            <input
              autoFocus
              className="unravel-body w-full bg-[#0B0E14] border border-white/10 p-3 text-[#EDEAE2] outline-none focus:border-[#E8A33D]/50 transition-colors mb-6"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditingChatId(null)} className="px-4 py-2 text-[#8B8F98] hover:text-[#EDEAE2] font-medium transition-colors text-sm">
                Cancel
              </button>
              <button onClick={handleRenameSubmit} className="px-6 py-2 bg-[#E8A33D] hover:bg-[#F2AE4A] text-[#0B0E14] font-semibold transition-colors text-sm">
                Save
              </button>
            </div>
          </>
        )}

        {/* --- DELETE MODAL --- */}
        {deletingChatId && (
          <>
            <h3 className="unravel-display italic text-xl font-medium mb-2 text-[#EDEAE2] text-center">Delete chat?</h3>
            <p className="unravel-body text-[#8B8F98] text-sm mb-6 text-center leading-relaxed">
              This action cannot be undone. All messages in this thread will be lost.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDeleteConfirm}
                className="unravel-body w-full py-3 bg-[#E8352B] hover:bg-[#FF4438] text-white font-semibold transition-colors text-sm"
              >
                Delete permanently
              </button>
              <button onClick={() => setDeletingChatId(null)} className="unravel-body w-full py-3 text-[#8B8F98] hover:text-[#EDEAE2] font-medium transition-colors text-sm">
                Keep chat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModals;