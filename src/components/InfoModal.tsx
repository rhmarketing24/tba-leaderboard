"use client";

import React from "react";

interface InfoModalProps {
    open: boolean;
    onClose: () => void;
}

export default function InfoModal({ open, onClose }: InfoModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300"
            onClick={onClose} // overlay click → close
        >
            <div
                className="bg-white/95 backdrop-blur rounded-2xl shadow-xl w-[22rem] max-w-sm p-6 text-gray-800 relative border border-gray-200"
                onClick={(e) => e.stopPropagation()} // prevent closing on modal click
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg transition"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
                    <span className="text-blue-500 text-xl">ℹ️</span>
                    <span>About This App</span>
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed mb-3 text-center">
                    This app displays the leaderboard of Creator Rewards, ranked by total USDC received.
                    Data updates periodically — not in real-time — since it’s updated manually.
                </p>

                <p className="text-sm text-gray-700 leading-relaxed mb-3 text-center">
                    You can view your total and weekly rewards, tap Profile to see your own stats,
                    and use the Recent column to check weekly top creators.
                </p>

                <p className="text-xs text-gray-500 italic text-center mb-4">
                    Data refresh may take some time after each update.
                    Thanks for your patience 💙
                </p>

                {/* Button */}
                <div className="text-center">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-600 active:scale-[0.97] transition"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
