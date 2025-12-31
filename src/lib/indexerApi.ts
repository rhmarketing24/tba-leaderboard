const INDEXER_BASE =
  process.env.NEXT_PUBLIC_INDEXER_API || "http://localhost:8787";

export async function fetchLeaderboard() {
  const res = await fetch(`${INDEXER_BASE}/leaderboard`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return res.json();
}

export async function fetchTotal() {
  const res = await fetch(`${INDEXER_BASE}/total`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch total");
  }

  return res.json();
}
