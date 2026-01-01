"use client";

import { useEffect, useState } from "react";

import TotalModal from "@/components/TotalModal";
import WeeklyModal from "@/components/WeeklyModal";
import CheckInModal from "@/components/CheckInModal";

function shortAddress(addr?: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

const PAGE_SIZE = 10;

export default function Home() {
  const [rows, setRows] = useState<any[]>([]);
  const [weeklyRows, setWeeklyRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [openTotal, setOpenTotal] = useState(false);
  const [openWeekly, setOpenWeekly] = useState(false);
  const [openCheckIn, setOpenCheckIn] = useState(false);

  const [totalValue, setTotalValue] = useState(0);
  const [weeklyPage, setWeeklyPage] = useState(1);

  /* -------------------------------
     LOAD LOCAL JSON DATA
  -------------------------------- */
  useEffect(() => {
    async function load() {
      setLoading(true);

      const leaderboardRes = await fetch("/data/leaderboard.json");
      const leaderboard = await leaderboardRes.json();

      const weeklyRes = await fetch("/data/weekly.json");
      const weekly = await weeklyRes.json();

      setRows(leaderboard);
      setWeeklyRows(weekly);

      const total = leaderboard.reduce(
        (sum: number, r: any) => sum + r.TOTAL_USDC_RECEIVED,
        0
      );
      setTotalValue(Math.floor(total));

      setLoading(false);
    }

    load();
  }, []);

  /* -------------------------------
     SEARCH
  -------------------------------- */
  const filteredRows = search
    ? rows.filter((r) =>
        r.RECEIVER_ADDRESS.toLowerCase().includes(search.toLowerCase())
      )
    : rows;

  /* -------------------------------
     PAGINATION
  -------------------------------- */
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const paginatedRows = search
    ? filteredRows
    : filteredRows.slice(start, end);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-100 pb-36">
      {/* Header */}
      <header className="bg-white p-4 text-center font-semibold shadow">
        🏆 TBA Leaderboard
      </header>

      {/* Search */}
      <div className="p-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by address..."
          className="w-full rounded-xl border px-4 py-2"
        />
      </div>

      {/* Leaderboard */}
      <div className="mx-4 rounded-2xl bg-white shadow overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_90px_90px] border-b px-4 py-2 text-sm font-semibold">
          <div>Rank</div>
          <div>Address</div>
          <div className="text-right">USDC</div>
          <div className="text-right">Last Week</div>
        </div>

        {loading && (
          <p className="p-6 text-center text-sm text-gray-500">
            Loading leaderboard…
          </p>
        )}

        {!loading && paginatedRows.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-500">
            No matching address found.
          </p>
        )}

        {paginatedRows.map((r: any) => (
          <div
            key={r.RECEIVER_ADDRESS}
            className="grid grid-cols-[60px_1fr_90px_90px] border-b px-4 py-3 text-sm"
          >
            <div>#{r.RANK}</div>
            <div className="truncate">
              {shortAddress(r.RECEIVER_ADDRESS)}
            </div>
            <div className="text-right font-medium">
              {r.TOTAL_USDC_RECEIVED}
            </div>
            <div className="text-right text-gray-600">
              {r.LAST_WEEK_USDC_RECEIVED}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!search && (
        <div className="mx-4 mt-4 flex gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex-1 rounded-xl bg-blue-400 px-4 py-2 text-white disabled:opacity-50"
          >
            ← Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <button
            onClick={() => setOpenTotal(true)}
            className="flex items-center gap-1 rounded-xl bg-gray-100 px-4 py-2 text-sm"
          >
            🏆 <span>Total</span>
          </button>

          <button
            onClick={() => setOpenCheckIn(true)}
            className="mx-2 flex items-center justify-center rounded-2xl bg-blue-500 px-8 py-3 text-sm font-semibold text-white"
          >
            Check-in
          </button>

          <button
            onClick={() => setOpenWeekly(true)}
            className="flex items-center gap-1 rounded-xl bg-gray-100 px-4 py-2 text-sm"
          >
            📅 <span>Weekly</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <TotalModal
        open={openTotal}
        onClose={() => setOpenTotal(false)}
        value={totalValue}
      />

      <WeeklyModal
        open={openWeekly}
        onClose={() => setOpenWeekly(false)}
        rows={weeklyRows}
        page={weeklyPage}
        onPrev={() => setWeeklyPage((p) => Math.max(1, p - 1))}
        onNext={() => setWeeklyPage((p) => p + 1)}
      />

      <CheckInModal
        open={openCheckIn}
        onClose={() => setOpenCheckIn(false)}
      />
    </div>
  );
}
