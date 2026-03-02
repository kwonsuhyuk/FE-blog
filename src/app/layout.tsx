import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import NavLinks from "./NavLinks";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
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
    <html lang="ko" className={montserrat.variable}>
      <head>
        <link rel="icon" href="/짱구.jpg" />
        {/* Pretendard for Korean support */}
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        
        {/* 브라우저 확장 프로그램의 강제 폰트를 이기기 위한 최종 단계 */}
        <style dangerouslySetInnerHTML={{ __html: `
          *:not(i, .material-symbols-outlined, .material-icons) {
            font-family: var(--font-montserrat), "Pretendard Variable", Pretendard, sans-serif !important;
          }
        ` }} />
      </head>
      <body
        className={`${montserrat.variable} font-sans antialiased min-h-screen bg-white text-text-main`}
      >
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
              <img src="/짱구.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover group-hover:rotate-12 transition-transform shadow-sm" />
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

        <footer className="py-16 bg-slate-50/50 backdrop-blur-sm">
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
