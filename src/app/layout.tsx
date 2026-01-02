"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wallet";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ React Query client
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // 🔥 CRITICAL: notify Base / Farcaster Mini App that app is ready
    sdk.actions.ready();
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-100 flex justify-center">
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            {/* Mobile container */}
            <div className="w-full max-w-[420px] min-h-screen bg-[#f9fafb]">
              {children}
            </div>
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
