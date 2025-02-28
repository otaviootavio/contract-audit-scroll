import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Audit AI",
  description: "Audit Smartcontracts with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto_mono.variable}`}
      >
        <Providers>
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b border-foreground bg-primary text-primary-foreground">
            <Link href="/" className="text-xl font-bold">
              Audit AI
            </Link>
            <div className="flex flex-row items-center gap-4">
              <Button variant="outline">
                <Link href="/demo" className="text-primary font-bold">
                  Try Demo
                </Link>
              </Button>

              <ConnectButton />
            </div>
          </nav>
          <div className="bg-cyan-900 flex flex-col gap-4 p-10">
            {children}
          </div>
          <footer className="text-center p-4 border-t border-gray-900 fixed bottom-0 w-full bg-primary text-primary-foreground">
            <p>
              &copy; {new Date().getFullYear()} Audit AI. All
              rights reserved.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
