// src/providers/convex-provider.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

// Make sure you have the NEXT_PUBLIC_CONVEX_URL environment variable set
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://peaceful-reindeer-979.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}