"use client";

import { useEffect, useState } from "react";

// ✅ Indexer API (only source of truth)
import { fetchLeaderboard, fetchTotal } from "@/lib/indexerApi";

import TotalModal from "@/components/TotalModal";
import WeeklyModal from "@/components/WeeklyModal";
import CheckInModal from "@/components/CheckInModal";
import { useAccount } from "wagmi";

function shortAddress(addr?: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

const PAGE_SIZE = 10;

export default function Home() {
  const [page, setPage] = useState(1);

  // Leaderboard
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  // Total
  const [openTotal, setOpenTotal] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  // Weekly (future)
  const [openWeekly, setOpenWeekly] = useState(false);
  const [weeklyRows, setWeeklyRows] = useState<any[]>([]);
  const [weeklyPage, setWeeklyPage] = useState(1);

  // Check-in
  const [openCheckIn, setOpenCheckIn] = useState(false);

  // Wagmi
  const { address, isConnected } = useAccount();

  /* ---------------------------------
     ✅ FETCH LEADERBOARD ONCE
     --------------------------------- */
  useEffect(() => {
    setLoading(true);
    fetchLeaderboard()
      .then((data) => {
        // sort + attach global rank
        const sorted = data
          .sort((a: any, b: any) => b.usdc - a.usdc)
          .map((r: any, i: number) => ({
            ...r,
            rank: i + 1,
          }));

        setRows(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------------------------
     🔍 SEARCH LOGIC
     --------------------------------- */
  const searchedRows = search
    ? rows.filter((r) =>
        r.address.toLowerCase().includes(search.toLowerCase())
      )
    : rows;

  /* ---------------------------------
     📄 PAGINATION (TOP 10 etc)
     --------------------------------- */
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const paginatedRows = search
    ? searchedRows // search mode → no pagination
    : searchedRows.slice(start, end);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

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
        <div className="grid grid-cols-[60px_1fr_90px] border-b px-4 py-2 text-sm font-semibold">
          <div>Rank</div>
          <div>Address</div>
          <div className="text-right">USDC</div>
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
            key={r.address}
            className="grid grid-cols-[60px_1fr_90px] border-b px-4 py-3 text-sm"
          >
            <div>#{r.rank}</div>
            <div className="truncate">{shortAddress(r.address)}</div>
            <div className="text-right font-medium">
              {Math.floor(r.usdc)}
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
          {/* Total */}
          <button
            onClick={async () => {
              const res = await fetchTotal();
              setTotalValue(Math.floor(res.totalUSDC));
              setOpenTotal(true);
            }}
            className="flex items-center gap-1 rounded-xl bg-gray-100 px-4 py-2 text-sm"
          >
            🏆 <span>Total</span>
          </button>

          {/* Check-in */}
          <button
            onClick={() => setOpenCheckIn(true)}
            className="mx-2 flex items-center justify-center rounded-2xl bg-blue-500 px-8 py-3 text-sm font-semibold text-white"
          >
            Check-in
          </button>

          {/* Weekly (disabled for now) */}
          <button
            disabled
            className="flex items-center gap-1 rounded-xl bg-gray-200 px-4 py-2 text-sm cursor-not-allowed"
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
        onPrev={() => {}}
        onNext={() => {}}
      />

      <CheckInModal
        open={openCheckIn}
        onClose={() => setOpenCheckIn(false)}
      />
    </div>
  );
}
