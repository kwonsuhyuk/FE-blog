"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PostData } from "@/src/lib/posts";

interface HomeClientProps {
  allPostsData: Omit<PostData, 'contentHtml'>[];
}

export default function HomeClient({ allPostsData }: HomeClientProps) {
  const line1 = "안녕하세요!";
  const line2 = "React 를 좋아하는";
  const line3 = "개발자 입니다.";

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden border-b border-border-subtle bg-white/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          <div className="lg:col-span-8 z-10">
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-5xl font-extralight tracking-tight mb-3 leading-tight text-text-main">
                {line1.split("").map((char, index) => (
                  <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.08, duration: 0.4 }}>
                    {char}
                  </motion.span>
                ))}
              </h1>
              <h2 className="text-3xl md:text-5xl tracking-tight mb-3 leading-tight text-text-main">
                {line2.split("").map((char, index) => {
                  const isReactChar = index >= 0 && index < 5; 
                  return (
                    <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (line1.length + index) * 0.08, duration: 0.4 }} className={isReactChar ? "font-black text-primary" : ""}>
                      {char}
                    </motion.span>
                  );
                })}
              </h2>
              <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-tight text-text-main">
                {line3.split("").map((char, index) => {
                  const isEmphasized = index >= 4; 
                  return (
                    <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (line1.length + line2.length + index) * 0.08, duration: 0.4 }} className={isEmphasized ? "font-bold text-text-light" : ""}>
                      {char}
                    </motion.span>
                  );
                })}
              </h2>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: (line1.length + line2.length + line3.length) * 0.08, duration: 0.8 }} className="mt-10 h-1 w-12 bg-primary/60 rounded-full origin-left"></motion.div>
          </div>
          <div className="lg:col-span-4 flex flex-col items-end gap-5 z-10">
            {['github', 'linkedIn', 'personal portfolio', 'legacy blogs'].map((link, i) => (
              <motion.a key={link} href="#" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 + (i * 0.1) }} className="text-lg md:text-xl font-extralight text-text-light hover:text-primary transition-all tracking-tight">
                {link}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section - Simplified */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <header className="mb-16 flex items-center justify-between border-b border-border-subtle pb-8">
          <div className="space-y-1">
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-text-light">Recently Published</h2>
          </div>
          <Link href="/posts" className="text-xs font-black tracking-[0.1em] text-text-light hover:text-primary transition-colors uppercase">
            Browse Archive →
          </Link>
        </header>

        <div className="space-y-24">
          {allPostsData.slice(0, 5).map(({ slug, date, title, description, category }) => (
            <Link key={slug} href={`/posts/${slug}`} className="group block">
              <article className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-light tracking-widest uppercase">{date}</span>
                  <span className="text-[10px] font-black text-text-light uppercase tracking-widest px-2 py-1 border border-border-subtle rounded group-hover:border-primary/30 group-hover:text-primary transition-all">
                    {category}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-text-main group-hover:text-primary transition-colors duration-500 tracking-tight leading-snug">
                  {title}
                </h3>
                <p className="text-text-muted text-lg leading-relaxed line-clamp-4 font-medium">
                  {description}
                </p>
                <div className="pt-2">
                  <span className="text-sm font-black text-text-main border-b-2 border-primary/20 group-hover:border-primary transition-all pb-1">
                    Read Story
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
