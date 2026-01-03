// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "./providers";

export const metadata: Metadata = {
  title: "TBA Leaderboard",
  description: "Weekly rewards leaderboard with daily check-in streaks",

  openGraph: {
    title: "TBA Leaderboard",
    description:
      "Track TBA rewards, leaderboard rankings, and daily check-ins",
    images: [
      {
        url: "https://tba-leaderboard.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "TBA Leaderboard",
      },
    ],
  },

  other: {
    // ✅ EXACT Farcaster Mini App Embed (per docs)
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://tba-leaderboard.vercel.app/og.png",
      button: {
        title: "Open TBA Leaderboard",
        action: {
          type: "launch_miniapp", // 🔴 THIS WAS MISSING
          name: "TBA Leaderboard",
          url: "https://tba-leaderboard.vercel.app",
          splashImageUrl: "https://tba-leaderboard.vercel.app/icon.png",
          splashBackgroundColor: "#f9fafb",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex justify-center">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
