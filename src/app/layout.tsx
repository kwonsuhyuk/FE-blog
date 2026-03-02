import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import NavLinks from "./NavLinks";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { PageTransition } from "@/src/components/PageTransition";
import { ScrollToTop } from "@/src/components/ScrollToTop";

const gmarketSans = localFont({
  src: [
    {
      path: "../../public/fonts/GmarketSansLight.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GmarketSansMedium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GmarketSansBold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gmarket",
});

export const metadata: Metadata = {
  title: {
    default: "suhyukLog | FE Developer",
    template: "suhyukLog | %s",
  },
  description: "프론트엔드 개발자 권수혁의 기술 블로그입니다. 배움과 경험을 기록합니다.",
  openGraph: {
    title: "suhyukLog | FE Developer",
    description: "프론트엔드 개발자 권수혁의 기술 블로그입니다. 배움과 경험을 기록합니다.",
    url: "https://kwonsuhyuk.github.io/FE-blog/",
    siteName: "suhyukLog",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "suhyukLog | FE Developer",
    description: "프론트엔드 개발자 권수혁의 기술 블로그입니다. 배움과 경험을 기록합니다.",
  },
  icons: {
    icon: "/짱구.jpg",
    apple: "/짱구.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={gmarketSans.variable}>
      <head>
        <link rel="icon" href="/짱구.jpg" />
        {/* Pretendard for Korean support */}
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        
        {/* Force font application to override aggressive browser extensions */}
        <style dangerouslySetInnerHTML={{ __html: `
          *:not(i, .material-symbols-outlined, .material-icons) {
            font-family: var(--font-gmarket), "Pretendard Variable", Pretendard, sans-serif !important;
          }
        ` }} />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-bg-main text-text-main transition-colors duration-300"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navigation Bar */}
          <nav className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
                <img src="/짱구.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover group-hover:rotate-12 transition-transform shadow-sm" />
                suhyukLog
              </Link>
              <div className="flex items-center gap-8">
                <NavLinks />
                <ThemeToggle />
              </div>
            </div>
          </nav>

          {/* Global Subtle Background Elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[5%] right-[10%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full dark:hidden" />
            <div className="absolute bottom-[20%] left-[-5%] w-[25%] h-[25%] bg-secondary/10 blur-[100px] rounded-full dark:hidden" />
          </div>

          <PageTransition>
            {children}
          </PageTransition>

          <ScrollToTop />

          <footer className="py-12 bg-bg-subtle/50 backdrop-blur-sm">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
