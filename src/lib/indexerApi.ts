const INDEXER_BASE = "http://localhost:8787";

export async function fetchLeaderboard() {
  const res = await fetch(`${INDEXER_BASE}/leaderboard`);
  if (!res.ok) throw new Error("Failed leaderboard");
  return res.json();
}

export async function fetchTotal() {
  const res = await fetch(`${INDEXER_BASE}/total`);
  if (!res.ok) throw new Error("Failed total");
  return res.json();
}
