// src/lib/data.ts

export type LeaderboardItem = {
  RANK: number
  RECEIVER_ADDRESS: string
  TOTAL_USDC_RECEIVED: number
  LAST_WEEK_USDC_RECEIVED: number
}

export type WeeklyItem = {
  WEEK: number
  DISTRIBUTION_DATE: string
  USDC: number
  USERS: number
}

/**
 * Leaderboard (Total + Last Week)
 */
export async function getLeaderboard(): Promise<LeaderboardItem[]> {
  const res = await fetch("/data/leaderboard.json", {
    cache: "no-store", // always fresh after git push
  })

  if (!res.ok) {
    throw new Error("Failed to load leaderboard data")
  }

  return res.json()
}

/**
 * Weekly distribution history
 */
export async function getWeekly(): Promise<WeeklyItem[]> {
  const res = await fetch("/data/weekly.json", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load weekly data")
  }

  return res.json()
}

/**
 * Derived helpers (optional but useful)
 */
export function getTotalUSDC(leaderboard: LeaderboardItem[]): number {
  return leaderboard.reduce(
    (sum, item) => sum + item.TOTAL_USDC_RECEIVED,
    0
  )
}

export function getTotalUsers(leaderboard: LeaderboardItem[]): number {
  return leaderboard.length
}
