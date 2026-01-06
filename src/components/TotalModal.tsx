"use client";

import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  open: boolean;
  onClose: () => void;
  value: number;
  totalUsers?: number;
};

export default function TotalModal({ open, onClose, value, totalUsers = 0 }: Props) {
  const [displayValue, setDisplayValue] = useState(0);
  const [displayUsers, setDisplayUsers] = useState(0);

  // Animate numbers
  useEffect(() => {
    if (!open) return;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.floor(value * easeOut));
      setDisplayUsers(Math.floor(totalUsers * easeOut));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [open, value, totalUsers]);

  // ESC key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn font-sans px-3">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#f5f7ff] via-[#e4e9ff] to-[#d2dcff] shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-white/40 animate-scaleIn p-6 sm:p-8 text-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-500 hover:text-slate-700 transition"
          aria-label="Close"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="mb-6 text-lg font-bold text-blue-700">
          Total Distributed
        </h2>

        {/* Box Layout for Totals */}
        <div className="mb-6 grid grid-cols-1 gap-4">
          {/* Total USDC */}
          <div className="rounded-2xl bg-white/80 shadow-inner py-5 px-3">
            <p className="text-[42px] sm:text-[50px] font-extrabold text-blue-800">
              {displayValue.toLocaleString()}
              <span className="ml-1 text-base sm:text-lg font-medium text-slate-700">
                USDC
              </span>
            </p>
          </div>

          {/* Divider Text */}
          <p className="text-sm font-medium text-gray-500">To</p>

          {/* Total Users */}
          <div className="rounded-2xl bg-white/80 shadow-inner py-5 px-3">
            <p className="text-[36px] sm:text-[44px] font-extrabold text-blue-800">
              {displayUsers.toLocaleString()}
              <span className="ml-1 text-base sm:text-lg font-medium text-slate-700">
                Users
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
