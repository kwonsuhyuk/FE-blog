import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import NavLinks from "./NavLinks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "suhyukLog | FE Developer",
  description: "Personal dev blog of suhyuk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌱</text></svg>" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-text-main`}
      >
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-subtle">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-[10px] text-white group-hover:rotate-12 transition-transform shadow-sm font-black">SL</span>
              suhyukLog
            </Link>
            <NavLinks />
          </div>
        </nav>

        {/* Global Subtle Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[5%] right-[10%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[20%] left-[-5%] w-[25%] h-[25%] bg-secondary/10 blur-[100px] rounded-full" />
        </div>

        <div className="min-h-[calc(100vh-64px)]">
          {children}
        </div>

        <footer className="py-16 border-t border-border-subtle bg-slate-50/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[10px] text-text-light font-black uppercase tracking-[0.2em]">
              @ powered by suhyuk
            </div>
            <div className="flex gap-6 text-[10px] text-text-light font-black uppercase tracking-[0.2em]">
              <a href="https://github.com/kwonsuhyuk" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Github</a>
              <a href="https://www.linkedin.com/in/%EC%88%98%ED%98%81-%EA%B6%8C-191521328/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
