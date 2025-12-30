"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  rows: any[];
  page: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function WeeklyModal({
  open,
  onClose,
  rows,
  page,
  onPrev,
  onNext,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal box */}
      <div
        className="
          w-[90%]
          max-w-sm
          max-h-[85vh]
          rounded-2xl
          bg-white
          p-5
          shadow-xl
          flex
          flex-col
        "
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Weekly Distributed</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {rows.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
            >
              <span>
                {new Date(r.week).toLocaleDateString()}
              </span>
              <span className="font-semibold">
                {Math.floor(r.usdc_distributed)}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button
            disabled={page === 1}
            onClick={onPrev}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm disabled:opacity-50"
          >
            ← Prev
          </button>

          <button
            onClick={onNext}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
