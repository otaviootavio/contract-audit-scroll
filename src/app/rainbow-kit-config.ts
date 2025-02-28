"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { scroll, scrollSepolia } from "viem/chains";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [scroll, scrollSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

