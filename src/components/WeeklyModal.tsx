"use client";

type WeeklyRow = {
  WEEK: number;
  DISTRIBUTION_DATE: string;
  USDC: number;
  USERS: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  rows: WeeklyRow[];
  page: number;
  onPrev: () => void;
  onNext: () => void;
};

const PAGE_SIZE = 10;

export default function WeeklyModal({
  open,
  onClose,
  rows,
  page,
  onPrev,
  onNext,
}: Props) {
  if (!open) return null;

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginated = rows.slice(start, end);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal */}
      <div className="w-[90%] max-w-sm max-h-[85vh] rounded-2xl bg-white p-5 shadow-xl flex flex-col">
        {/* Header */}
        <div className="mb-3 flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center w-full">
            Weekly Distributed
          </h2>
          <button
            onClick={onClose}
            className="absolute right-0 text-xl text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[60px_1fr_80px_70px] px-3 py-2 text-xs font-semibold text-gray-500 text-center border-b">
          <div>Week</div>
          <div>Date</div>
          <div>USDC</div>
          <div>Users</div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 mt-2">
          {paginated.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[60px_1fr_80px_70px] items-center rounded-xl border px-3 py-3 text-sm text-center hover:bg-gray-50 transition"
            >
              <div className="font-medium">{r.WEEK}</div>

              <div>
                {new Date(r.DISTRIBUTION_DATE).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <div className="font-semibold text-blue-700">
                {r.USDC.toLocaleString()}
              </div>

              <div className="text-gray-600">
                {r.USERS.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button
            disabled={page === 1}
            onClick={onPrev}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 transition disabled:opacity-50"
          >
            ← Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={onNext}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
