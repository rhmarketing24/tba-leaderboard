// src/app/providers.tsx
"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wallet";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

export default function ClientProviders({
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
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <div className="w-full max-w-[420px] min-h-screen bg-[#f9fafb]">
          {children}
        </div>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
