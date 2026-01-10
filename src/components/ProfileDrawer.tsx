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

            {/* Placeholder for future info */}
            <div className="flex-grow px-6 py-6"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
