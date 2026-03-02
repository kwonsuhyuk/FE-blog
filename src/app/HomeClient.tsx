"use client";

import Link from "next/link";
import { PostMetadata } from "@/src/lib/posts";
import { Hero } from "@/src/components/Hero";
import { PostCard } from "@/src/components/PostCard";

interface HomeClientProps {
  allPostsData: PostMetadata[];
}

const SOCIAL_LINKS = [
  { label: 'github', href: 'https://github.com/kwonsuhyuk' },
  { label: 'linkedIn', href: 'https://www.linkedin.com/in/%EC%88%98%ED%98%81-%EA%B6%8C-191521328/' },
  { label: 'legacy blogs', href: 'https://velog.io/@tngur0716/posts' }
];

export default function HomeClient({ allPostsData }: HomeClientProps) {
  return (
    <main className="w-full">
      <Hero 
        line1="안녕하세요!"
        line3="프론트엔드 개발자 권수혁입니다."
        socialLinks={SOCIAL_LINKS}
      />

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-12 flex items-center justify-between pb-6">
          <div className="space-y-1">
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-text-light">Recently Published</h2>
          </div>
          <Link href="/posts" className="text-xs font-black tracking-[0.1em] text-text-light hover:text-primary transition-colors uppercase">
            전체 포스트 보기 →
          </Link>
        </header>

        <div className="grid gap-8">
          {allPostsData.slice(0, 5).map((post) => (
            <PostCard key={post.slug} post={post} headingLevel="h3" />
          ))}
        </div>
      </div>
    </main>
  );
}
