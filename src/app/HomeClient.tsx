"use client";

import Link from "next/link";
import { PostMetadata } from "@/src/lib/posts";
import { Hero } from "@/src/components/Hero";
import { PostCard } from "@/src/components/PostCard";
import { PostCardSkeleton } from "@/src/components/Skeleton";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface HomeClientProps {
  allPostsData: PostMetadata[];
}

const SOCIAL_LINKS = [
  { label: 'github', href: 'https://github.com/kwonsuhyuk' },
  { label: 'linkedIn', href: 'https://www.linkedin.com/in/%EC%88%98%ED%98%81-%EA%B6%8C-191521328/' },
  { label: 'legacy blogs', href: 'https://velog.io/@tngur0716/posts' }
];

export default function HomeClient({ allPostsData }: HomeClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="w-full">
      <Hero 
        line1="안녕하세요!"
        line3="프론트엔드 개발자 권수혁입니다."
        socialLinks={SOCIAL_LINKS}
      />

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Section Header */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-2"
              >
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-text-main">
                  Recent <br /> Posts
                </h2>
              </motion.div>
              
              <p className="text-text-muted text-sm leading-relaxed max-w-[240px] font-medium">
                생각과 배움을 기록합니다.
              </p>

              <div className="pt-2">
                <Link href="/posts" className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-text-main">
                  <span>All Posts</span>
                  <motion.span 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >→</motion.span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Post List */}
          <div className="lg:col-span-8">
            <div className="grid gap-8">
              {!mounted ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))
              ) : (
                allPostsData.slice(0, 5).map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard post={post} headingLevel="h3" />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
