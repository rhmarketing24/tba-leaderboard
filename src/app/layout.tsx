// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "./providers";

// 🔹 Mini App embed config (docs-style)
const miniapp = {
  version: "1", // must be "1"
  imageUrl: "https://tba-leaderboard.vercel.app/og.png", // 3:2 ratio
  button: {
    title: "Open TBA Leaderboard", // ≤ 32 chars
    action: {
      type: "launch_miniapp", // 🔑 REQUIRED
      name: "TBA Leaderboard",
      url: "https://tba-leaderboard.vercel.app",
      splashImageUrl: "https://tba-leaderboard.vercel.app/splash.png", // 200x200
      splashBackgroundColor: "#f9fafb",
    },
  },
};

// 🔹 Metadata generator (SERVER SIDE only)
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "TBA Leaderboard",
    description: "Weekly rewards leaderboard with daily check-in streaks",
    openGraph: {
      title: "TBA Leaderboard",
      description:
        "Track TBA rewards, leaderboard rankings, and daily check-ins",
      images: ["https://tba-leaderboard.vercel.app/og.png"],
    },
    other: {
      "fc:miniapp": JSON.stringify(miniapp),
    },
  };
}

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
