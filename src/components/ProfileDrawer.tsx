"use client";

import { motion, AnimatePresence } from "framer-motion";

type ProfileDrawerProps = {
  open: boolean;
  onClose: () => void;
  user?: {
    name: string;
    address: string;
    rank: number | string;
    avatarUrl?: string;
  };
};

export default function ProfileDrawer({ open, onClose, user }: ProfileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button onClick={onClose} className="text-xl text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center text-center px-4 mt-6">
              <div className="w-20 h-20 rounded-full border border-gray-300 overflow-hidden">
                <img
                  src={user?.avatarUrl || "/default-avatar.png"}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-3 font-semibold text-gray-800">
                {user?.name || "Anonymous"}
              </p>

              <p className="text-xs text-gray-500 break-all mt-1">
                {user?.address || "No wallet connected"}
              </p>

              <div className="mt-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                🏅 Rank #{user?.rank || "--"}
              </div>
            </div>

            {/* Share Button */}
            <div className="mt-auto px-5 pb-6">
              <button
                onClick={() => {
                  const shareText = `🏆 My TBA Rank: #${user?.rank} — Check yours on TBA Leaderboard!`;
                  const shareUrl = "https://tba-leaderboard.vercel.app";

                  if (navigator.share) {
                    navigator.share({
                      title: "TBA Leaderboard",
                      text: shareText,
                      url: shareUrl,
                    });
                  } else {
                    alert("Sharing not supported on this device.");
                  }
                }}
                className="w-full rounded-xl bg-blue-500 text-white py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
              >
                <img src="/share-icon.png" alt="share" className="w-5 h-5" />
                Share My Rank
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
