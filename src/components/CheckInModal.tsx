"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
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

  const { data: currentStreak } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "currentStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: highestStreak } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "highestStreak",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: canCheckIn } = useReadContract({
    address: CHECKIN_CONTRACT_ADDRESS,
    abi: CHECKIN_ABI,
    functionName: "canCheckIn",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const {
    writeContract,
    isPending,
    isSuccess,
  } = useWriteContract();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[92%] max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">🔥 Check In</h2>
          <button onClick={onClose} className="text-xl text-gray-500">
            ✕
          </button>
        </div>

        {/* Streaks */}
        <div className="mb-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-gray-100 p-3">
            <p className="text-xs text-gray-500">Current</p>
            <p className="text-xl font-bold">
              {Number(currentStreak ?? 0)}
            </p>
          </div>

          <div className="rounded-xl bg-gray-100 p-3">
            <p className="text-xs text-gray-500">Highest</p>
            <p className="text-xl font-bold">
              {Number(highestStreak ?? 0)}
            </p>
          </div>
        </div>

        {/* Action */}
        <button
          disabled={!canCheckIn || isPending}
          onClick={() =>
            writeContract({
              address: CHECKIN_CONTRACT_ADDRESS,
              abi: CHECKIN_ABI,
              functionName: "checkIn",
            })
          }
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white ${
            canCheckIn
              ? "bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isPending
            ? "Checking in..."
            : canCheckIn
            ? "Check In"
            : "Already Checked In"}
        </button>

        {isSuccess && (
          <p className="mt-2 text-center text-xs text-green-600">
            ✅ Check-in successful
          </p>
        )}
      </div>
    </div>
  );
}
