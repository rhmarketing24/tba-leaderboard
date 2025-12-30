"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wallet";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ React Query client (one-time, client safe)
  const [queryClient] = useState(() => new QueryClient());

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
