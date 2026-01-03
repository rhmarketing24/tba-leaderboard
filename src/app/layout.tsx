// src/app/layout.tsx
import { Metadata } from 'next'
import "./globals.css";
import ClientProviders from "./providers";

const frame = {
  version: "1",  // Not "next" - must be "1"
  imageUrl: "https://tba-leaderboard.vercel.app/og.png", // 3:2 aspect ratio
  button: {
    title: "Open Leaderboard",  // Max 32 characters
    action: {
      type: "launch_frame",
      name: "TBA Leaderboard",
      url: "https://tba-leaderboard.vercel.app",  // Optional, defaults to current URL
      splashImageUrl: "https://tba-leaderboard.vercel.app/splash.png", // 200x200px
      splashBackgroundColor: "#f7f7f7"
    }
  }
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
