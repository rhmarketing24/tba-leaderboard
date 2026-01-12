"use client";

import { motion, AnimatePresence } from "framer-motion";

type ProfileDrawerProps = {
  open: boolean;
  onClose: () => void;
  user?: {
    name: string;
    rank: number | string;
    totalUSDC?: number | string;
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

            {/* Profile Info */}
            <div className="px-6 pt-6">
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow p-5 text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300 mx-auto">
                  <img
                    src={user?.avatarUrl || "/default-avatar.png"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <p className="mt-3 text-lg font-semibold text-gray-900">
                  {user?.name || "Anonymous"}
                </p>

                {/* Rank + USDC */}
                <div className="mt-4 flex justify-between bg-white rounded-xl shadow-inner py-3 px-4">
                  <div className="flex flex-col items-center flex-1 border-r border-gray-200">
                    <span className="text-sm text-gray-500">Rank</span>
                    <span className="text-blue-600 font-bold text-lg">
                      #{user?.rank || "--"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-sm text-gray-500">USDC</span>
                    <span className="text-blue-600 font-bold text-lg">
                      {user?.totalUSDC ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow / Support Section */}
            <div className="mt-auto px-4 pb-4 sticky bottom-0 bg-white">
              <div className="rounded-2xl bg-blue-50/60 border border-blue-100 px-4 pt-4 pb-5 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                <p className="text-sm font-medium text-gray-600 text-center mb-3">
                  Follow us on
                </p>

                <div className="flex justify-center gap-4">

                  {/* Base */}
                  <a
                    href="https://base.app/profile/0x7E57b5d42a37cC332Cc54712db977F43Baf2ff28"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow hover:scale-105 transition"
                    title="Base"
                  >
                    <svg width="26" height="26" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="baseGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#7AA2FF" />
                          <stop offset="100%" stopColor="#0052FF" />
                        </linearGradient>
                      </defs>
                      <rect x="12" y="12" width="76" height="76" rx="18" fill="url(#baseGrad)" />
                    </svg>
                  </a>

                  {/* Farcaster */}
                  <a
                    href="https://farcaster.xyz/rhmarketing24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center hover:scale-105 transition"
                    title="Farcaster"
                  >
                    <svg width="18" height="18" viewBox="0 0 256 256" fill="white">
                      <path d="M208 32H48a8 8 0 0 0 0 16h8v160a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16V48h8a8 8 0 0 0 0-16Zm-40 160H88V64h80Z" />
                    </svg>
                  </a>

                  {/* Zora */}
                  <a
                    href="https://zora.co/@rhmarketing24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition"
                    title="Zora"
                  >
                    <svg width="30" height="30" viewBox="0 0 100 100">
                      <defs>
                        <radialGradient id="zoraGrad" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#B6C6FF" />
                          <stop offset="55%" stopColor="#6B5CFF" />
                          <stop offset="100%" stopColor="#3A1C1C" />
                        </radialGradient>
                      </defs>
                      <circle cx="50" cy="50" r="45" fill="url(#zoraGrad)" />
                    </svg>
                  </a>

                  {/* X */}
                  <a
                    href="https://x.com/rhmarketing24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:scale-105 transition"
                    title="X"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M18.244 2H21l-6.52 7.455L22 22h-6.828l-5.35-7.007L3.9 22H1l6.97-7.97L2 2h7l4.82 6.27L18.244 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
