"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  CHECKIN_ABI,
  CHECKIN_CONTRACT_ADDRESS,
} from "@/lib/checkinContract";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CheckInModal({ open, onClose }: Props) {
  const { address } = useAccount();

  /* -------------------- READ CONTRACT -------------------- */
  const { data: currentStreak, refetch: refetchCurrent } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "currentStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: highestStreak, refetch: refetchHighest } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "highestStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: canCheckIn, refetch: refetchCanCheckIn } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "canCheckIn",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  /* -------------------- WRITE CONTRACT -------------------- */
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash });

  /* -------------------- UI STATES -------------------- */
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animateStreak, setAnimateStreak] = useState(false);

  /* -------------------- TX CONFIRMATION -------------------- */
  useEffect(() => {
    if (txConfirmed) {
      setCheckedInToday(true);

      // ✅ Small delay ensures contract state updated on-chain before refetch
      setTimeout(() => {
        refetchCurrent();
        refetchHighest();
        refetchCanCheckIn();
        setShowSuccess(true);
        setAnimateStreak(true);
      }, 1000);

      // Smooth animation cleanup
      const t1 = setTimeout(() => setShowSuccess(false), 3000);
      const t2 = setTimeout(() => setAnimateStreak(false), 800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [txConfirmed, refetchCurrent, refetchHighest, refetchCanCheckIn]);

  /* -------------------- SYNC WHEN MODAL OPENS -------------------- */
  useEffect(() => {
    if (open && canCheckIn === false) setCheckedInToday(true);
  }, [open, canCheckIn]);

  if (!open) return null;

  const disabled = checkedInToday || !canCheckIn || isPending;

  /* -------------------- UI -------------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="relative w-[92%] max-w-sm rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-100 p-6 shadow-2xl border border-white/40 transition-all duration-300">
        
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex-1" />
          <h2 className="flex-1 text-center text-lg font-bold text-blue-700 whitespace-nowrap">
            Daily Check-In
          </h2>
          <button
            onClick={onClose}
            className="flex-1 text-right text-2xl text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Streak Boxes */}
        <div className="mb-5 grid grid-cols-2 gap-4 text-center">
          <div
            className={`rounded-2xl bg-white/80 shadow-inner p-4 transition-transform ${
              animateStreak ? "scale-110" : ""
            }`}
          >
            <p className="text-xs text-gray-500">Current Streak</p>
            <p className="text-2xl font-extrabold text-blue-700">
              {Number(currentStreak ?? 0)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 shadow-inner p-4">
            <p className="text-xs text-gray-500">Highest Streak</p>
            <p className="text-2xl font-extrabold text-blue-700">
              {Number(highestStreak ?? 0)}
            </p>
          </div>
        </div>

        {/* Check-in Button */}
        <button
          disabled={disabled}
          onClick={() =>
            writeContract({
              address: CHECKIN_CONTRACT_ADDRESS,
              abi: CHECKIN_ABI,
              functionName: "checkIn",
            })
          }
          className={`w-full rounded-2xl py-3 text-base font-semibold text-white shadow-lg transition-transform duration-200 ${
            disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-600 active:scale-95"
          }`}
        >
          {isPending
            ? "Checking in..."
            : checkedInToday
            ? "Checked in today"
            : "Check In"}
        </button>

        {/* Tooltip */}
        {checkedInToday && !isPending && (
          <p className="mt-3 text-center text-xs text-gray-500">
            Come back tomorrow (UTC)
          </p>
        )}

        {/* Success Text */}
        {showSuccess && (
          <p className="mt-3 text-center text-sm font-medium text-green-600 animate-fadeIn">
            Check-in successful!
          </p>
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
