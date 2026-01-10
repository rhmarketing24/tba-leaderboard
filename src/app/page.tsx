"use client";

import { useEffect, useState, useMemo } from "react";
import TotalModal from "@/components/TotalModal";
import WeeklyModal from "@/components/WeeklyModal";
import CheckInModal from "@/components/CheckInModal";
import ProfileDrawer from "@/components/ProfileDrawer";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount } from "wagmi";

/* -------------------------------
   🧩 Type Definitions
-------------------------------- */
interface LeaderboardRow {
  RANK: number;
  RECEIVER_ADDRESS: string;
  TOTAL_USDC_RECEIVED: number;
  LAST_WEEK_USDC_RECEIVED: number;
}

interface WeeklyRow {
  WEEK: number;
  DISTRIBUTION_DATE: string;
  USDC: number;
  USERS: number;
}

interface BaseUser {
  displayName?: string;
  fid?: number;
  pfpUrl?: string;
}

/* -------------------------------
   🪄 Utility Functions
-------------------------------- */
function shortAddress(addr?: string) {
  if (!addr) return "";
  if (addr.length <= 8) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

const PAGE_SIZE = 10;

/* -------------------------------
   🏠 Main Component
-------------------------------- */
export default function Home() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [weeklyRows, setWeeklyRows] = useState<WeeklyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [openTotal, setOpenTotal] = useState(false);
  const [openWeekly, setOpenWeekly] = useState(false);
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const [totalValue, setTotalValue] = useState(0);
  const [weeklyPage, setWeeklyPage] = useState(1);

  const [sortField, setSortField] = useState<keyof LeaderboardRow | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [baseUser, setBaseUser] = useState<BaseUser | null>(null);
  const { address } = useAccount();

  /* -------------------------------
     📦 Load Local JSON Data
  -------------------------------- */
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [leaderboardRes, weeklyRes] = await Promise.all([
          fetch("/data/leaderboard.json"),
          fetch("/data/weekly.json"),
        ]);

        if (!leaderboardRes.ok || !weeklyRes.ok) {
          throw new Error("Failed to load data files.");
        }

        const [leaderboard, weekly] = await Promise.all([
          leaderboardRes.json(),
          weeklyRes.json(),
        ]);

        setRows(leaderboard as LeaderboardRow[]);
        setWeeklyRows(weekly as WeeklyRow[]);

        const total = leaderboard.reduce(
          (sum: number, r: LeaderboardRow) =>
            sum + (r.TOTAL_USDC_RECEIVED || 0),
          0
        );
        setTotalValue(Math.floor(total));
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError("Could not load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* -------------------------------
   👤 Fetch Base App User Info
-------------------------------- */
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const miniAppStatus = await sdk.isInMiniApp();

        if (miniAppStatus) {
          const context = await sdk.context;
          if (context?.user) {
            setBaseUser({
              displayName:
                context.user.displayName ||
                context.user.username ||
                "Base User",
              fid: context.user.fid,
              pfpUrl: context.user.pfpUrl,
            });
          }
        } else {
          console.log("Running outside Base app → fallback mode");
        }
      } catch (err) {
        console.warn("Base user not available yet", err);
      }
    };

    loadUserData();
  }, []);

  /* -------------------------------
     🧠 Current User Rank Info (FIXED)
  -------------------------------- */
  const currentUser = useMemo(() => {
    if (!address && !baseUser) return null;

    // leaderboard.json থেকে ম্যাচ খুঁজে বের করা
    const match = address
      ? rows.find(
          (r) => r.RECEIVER_ADDRESS.toLowerCase() === address.toLowerCase()
        )
      : null;

    return {
      name: baseUser?.displayName || "Anonymous",
      address: address || "No wallet connected",
      rank: match ? match.RANK : "-",
      totalUSDC: match ? match.TOTAL_USDC_RECEIVED : 0, // ✅ এখন এটা ProfileDrawer এ যাবে
      avatarUrl: baseUser?.pfpUrl || "/default-avatar.png",
    };
  }, [address, baseUser, rows]);

  /* -------------------------------
     🔃 Sorting Logic
  -------------------------------- */
  function handleSort(field: keyof LeaderboardRow) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  const sortedRows = useMemo(() => {
    let sorted = [...rows];

    if (sortField === "LAST_WEEK_USDC_RECEIVED") {
      sorted = sorted.filter((r) => r.LAST_WEEK_USDC_RECEIVED > 0);
    }

    if (sortField) {
      sorted.sort((a, b) => {
        const aVal = Number(a[sortField] ?? 0);
        const bVal = Number(b[sortField] ?? 0);
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    return sorted;
  }, [rows, sortField, sortOrder]);

  /* -------------------------------
     🔍 Search
  -------------------------------- */
  const filteredRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return sortedRows;
    return sortedRows
      .filter((r) =>
        r.RECEIVER_ADDRESS.toLowerCase().includes(normalized)
      )
      .slice(0, 10);
  }, [sortedRows, search]);

  /* -------------------------------
     📄 Pagination
  -------------------------------- */
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedRows = search.trim()
    ? filteredRows
    : filteredRows.slice(start, end);
  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  /* -------------------------------
     🧱 Render
  -------------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 pb-36">
      {/* Header */}
      <header className="relative bg-white p-4 text-center font-semibold shadow text-lg flex items-center justify-center">
        <button
          onClick={() => setOpenProfile(true)}
          className="absolute left-4"
          aria-label="Profile Menu"
        >
          {baseUser?.pfpUrl ? (
            <img
              src={baseUser.pfpUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-gray-300 object-cover"
            />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </button>

        🏆 TBA Leaderboard
      </header>

      {/* Profile Drawer */}
      <ProfileDrawer
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        user={currentUser || undefined}
      />

      {/* Search */}
      <div className="p-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="🔍 Search by address..."
          className="w-full rounded-xl border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Main Table */}
      <div className="mx-4 rounded-2xl bg-white shadow overflow-hidden">
        <div className="grid grid-cols-[60px_minmax(120px,1fr)_75px_75px] border-b px-4 py-2 text-sm font-semibold bg-gray-50 text-center">
          <button
            onClick={() => handleSort("RANK")}
            className="hover:text-blue-600 transition flex items-center justify-center gap-1"
          >
            Rank
            {sortField === "RANK" && (
              <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
            )}
          </button>

          <div>Address</div>

          <button
            onClick={() => handleSort("TOTAL_USDC_RECEIVED")}
            className="hover:text-blue-600 transition flex items-center justify-center gap-1"
          >
            USDC
            {sortField === "TOTAL_USDC_RECEIVED" && (
              <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
            )}
          </button>

          <button
            onClick={() => handleSort("LAST_WEEK_USDC_RECEIVED")}
            className="hover:text-blue-600 transition flex items-center justify-center gap-1"
          >
            Recent
            {sortField === "LAST_WEEK_USDC_RECEIVED" && (
              <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
            )}
          </button>
        </div>

        {!loading &&
          !error &&
          paginatedRows.map((r) => (
            <div
              key={r.RECEIVER_ADDRESS}
              className="grid grid-cols-[60px_minmax(120px,1fr)_75px_75px] border-b px-4 py-3 text-sm hover:bg-gray-50 transition"
            >
              <div className="font-medium text-center">{r.RANK}</div>
              <div className="truncate font-mono text-center">
                {shortAddress(r.RECEIVER_ADDRESS)}
              </div>
              <div className="font-medium text-center">
                {r.TOTAL_USDC_RECEIVED}
              </div>
              <div className="text-gray-600 text-center">
                {r.LAST_WEEK_USDC_RECEIVED}
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {!search.trim() && !loading && !error && (
        <div className="mx-4 mt-4 flex gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex-1 rounded-xl bg-blue-100 px-4 py-2 font-medium text-blue-600 hover:bg-blue-200 transition disabled:opacity-40"
          >
            ← Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex-1 rounded-xl bg-blue-100 px-4 py-2 font-medium text-blue-600 hover:bg-blue-200 transition disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2.5">
          <button
            onClick={() => setOpenTotal(true)}
            className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-all duration-200 active:scale-[0.97]"
          >
            🏆 <span>Total</span>
          </button>

          <button
            onClick={() => setOpenCheckIn(true)}
            className="flex items-center justify-center rounded-2xl bg-blue-500 px-10 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-600 active:scale-[0.97] transition-all duration-200"
          >
            Check-in
          </button>

          <button
            onClick={() => setOpenWeekly(true)}
            className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-all duration-200 active:scale-[0.97]"
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
        totalUsers={rows.length}
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
