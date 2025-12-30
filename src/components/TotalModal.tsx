"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  value: number;
};

export default function TotalModal({ open, onClose, value }: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!open) return;

    let start = 0;
    const duration = 800;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [open, value]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[90%] max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <h2 className="mb-6 text-lg font-semibold">Total Distributed</h2>

        <div className="mb-8 text-5xl font-bold text-blue-600">
          {display.toLocaleString()}
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-blue-500 py-3 font-medium text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
