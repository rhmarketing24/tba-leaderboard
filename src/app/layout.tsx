"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wallet";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

/* ❗ IMPORTANT:
   Metadata MUST be exported outside component
   Even though this file is client, Next will extract metadata
*/
export const metadata = {
  title: "TBA Leaderboard",
  description:
    "Track TBA rewards, weekly distributions, and daily check-in streaks on Base.",

  openGraph: {
    title: "TBA Leaderboard",
    description:
      "Weekly rewards leaderboard with daily streak check-ins on Base.",
    url: "https://tba-leaderboard.vercel.app",
    siteName: "TBA Leaderboard",
    images: [
      {
        url: "https://tba-leaderboard.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "TBA Leaderboard Preview",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TBA Leaderboard",
    description:
      "Weekly rewards leaderboard with daily streak check-ins on Base.",
    images: ["https://tba-leaderboard.vercel.app/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // 🔥 Tell Base / Farcaster Mini App that app is ready
    sdk.actions.ready();
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-100 flex justify-center">
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <div className="w-full max-w-[420px] min-h-screen bg-[#f9fafb]">
              {children}
            </div>
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
