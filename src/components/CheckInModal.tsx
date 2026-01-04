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

  /* --------------------
     READ CONTRACT
  -------------------- */
  const {
    data: currentStreak,
    refetch: refetchCurrent,
  } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "currentStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const {
    data: highestStreak,
    refetch: refetchHighest,
  } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "highestStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const {
    data: canCheckIn,
    refetch: refetchCanCheckIn,
  } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "canCheckIn",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  /* --------------------
     WRITE CONTRACT
  -------------------- */
  const {
    writeContract,
    data: hash,
    isPending,
  } = useWriteContract();

  const { isSuccess: txConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  /* --------------------
     UI STATES
  -------------------- */
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animateStreak, setAnimateStreak] = useState(false);

  /* --------------------
     INSTANT UPDATE AFTER TX CONFIRM
  -------------------- */
  useEffect(() => {
    if (txConfirmed) {
      setCheckedInToday(true);
      setShowSuccess(true);
      setAnimateStreak(true);

      refetchCurrent();
      refetchHighest();
      refetchCanCheckIn();

      const t1 = setTimeout(() => setShowSuccess(false), 2500);
      const t2 = setTimeout(() => setAnimateStreak(false), 600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [
    txConfirmed,
    refetchCurrent,
    refetchHighest,
    refetchCanCheckIn,
  ]);

  /* --------------------
     SYNC WHEN MODAL OPENS
  -------------------- */
  useEffect(() => {
    if (open && canCheckIn === false) {
      setCheckedInToday(true);
    }
  }, [open, canCheckIn]);

  if (!open) return null;

  const disabled =
    checkedInToday || !canCheckIn || isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[92%] max-w-sm rounded-2xl bg-white p-6 shadow-xl overflow-hidden">
        {/* 🔥 Fire animation */}
        {showSuccess && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-ping text-6xl">🔥</div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            🔥 Daily Check-In
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Streaks */}
        <div className="mb-4 grid grid-cols-2 gap-3 text-center">
          <div
            className={`rounded-xl bg-gray-100 p-3 transition ${
              animateStreak ? "scale-110" : ""
            }`}
          >
            <p className="text-xs text-gray-500">
              Current
            </p>
            <p className="text-xl font-bold">
              {Number(currentStreak ?? 0)}
            </p>
          </div>

          <div className="rounded-xl bg-gray-100 p-3">
            <p className="text-xs text-gray-500">
              Highest
            </p>
            <p className="text-xl font-bold">
              {Number(highestStreak ?? 0)}
            </p>
          </div>
        </div>

        {/* Action */}
        <button
          disabled={disabled}
          onClick={() =>
            writeContract({
              address: CHECKIN_CONTRACT_ADDRESS,
              abi: CHECKIN_ABI,
              functionName: "checkIn",
            })
          }
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition ${
            disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 active:scale-95"
          }`}
        >
          {isPending
            ? "Checking in…"
            : checkedInToday
            ? "✅ Checked in today"
            : "🔥 Check In"}
        </button>

        {/* Tooltip */}
        {checkedInToday && !isPending && (
          <p className="mt-2 text-center text-xs text-gray-500">
            ⏰ Come back tomorrow (UTC)
          </p>
        )}

        {/* Success text */}
        {showSuccess && (
          <p className="mt-2 text-center text-xs text-green-600">
            🎉 Check-in successful!
          </p>
        )}
      </div>
    </div>
  );
}
