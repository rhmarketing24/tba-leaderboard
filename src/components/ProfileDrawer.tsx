"use client";

import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { useRef } from "react";

type ProfileDrawerProps = {
  open: boolean;
  onClose: () => void;
  user?: {
    name: string;
    rank: number | string;
    avatarUrl?: string;
  };
};

export default function ProfileDrawer({ open, onClose, user }: ProfileDrawerProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    try {
      const shareText = `🏅 My TBA Rank: #${user?.rank} — Check yours at TBA Leaderboard!`;
      const shareUrl = "https://tba-leaderboard.vercel.app";

      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
        });
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/png")
        );

        if (
          blob &&
          navigator.canShare &&
          navigator.canShare({
            files: [new File([blob], "rank.png", { type: "image/png" })],
          })
        ) {
          const file = new File([blob], "rank.png", { type: "image/png" });
          await navigator.share({
            title: "TBA Leaderboard",
            text: shareText,
            files: [file],
          });
          return;
        } else if (navigator.share) {
          await navigator.share({
            title: "TBA Leaderboard",
            text: shareText,
            url: shareUrl,
          });
          return;
        }
      }

      alert("Sharing not supported on this device.");
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

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

          {/* Drawer */}
          <motion.div
            className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button
                onClick={onClose}
                className="text-xl text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* Profile Card */}
            <div className="px-6 pt-6">
              <div
                ref={cardRef}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300 mx-auto">
                  <img
                    src={user?.avatarUrl || "/default-avatar.png"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="mt-4 text-lg font-semibold text-gray-900">
                  {user?.name || "Anonymous"}
                </p>

                <div className="mt-3 inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-medium">
                  🏅 Rank #{user?.rank || "--"}
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  TBA Leaderboard — {new Date().getFullYear()}
                </p>
              </div>

              {/* Share Button (right below card) */}
              <div className="mt-5">
                <button
                  onClick={handleShare}
                  className="w-full rounded-xl bg-blue-500 text-white py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                >
                  <img src="/share-icon.png" alt="share" className="w-5 h-5" />
                  Share My Rank
                </button>
              </div>
            </div>

            {/* Placeholder area for future info */}
            <div className="flex-grow px-6 py-6">
              {/* 🔹 এখানে পরে তুমি নিজের info section add করতে পারবে */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
