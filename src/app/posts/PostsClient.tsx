"use client";

import { useState, useMemo, useEffect } from "react";
import { PostMetadata } from "@/src/lib/posts";
import { PostCard } from "@/src/components/PostCard";
import { PostCardSkeleton } from "@/src/components/Skeleton";

interface PostsClientProps {
  allPosts: PostMetadata[];
  categories: string[];
}

export default function PostsClient({ allPosts, categories }: PostsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allPosts.length };
    allPosts.forEach(post => {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1;
      }
    });
    return counts;
  }, [allPosts]);

  return (
    <>
      {/* Search and Filter Header */}
      <div className="flex flex-col gap-10 mb-16">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="포스트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pb-4 text-lg font-medium focus:outline-none transition-colors placeholder:text-text-light/50"
          />
          <div className="absolute right-0 bottom-4 text-text-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-2">
          {categories.map((category) => {
            const count = categoryCounts[category] || 0;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`group flex items-center gap-2 text-base font-bold transition-all whitespace-nowrap ${
                  selectedCategory === category 
                  ? "text-text-main" 
                  : "text-text-light hover:text-text-muted"
                }`}
              >
                <span>{category}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border transition-colors ${
                  selectedCategory === category
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-bg-subtle border-border-subtle text-text-light group-hover:text-text-muted"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Post List */}
      <div className="grid gap-8">
        {!mounted ? (
          Array.from({ length: 5 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} headingLevel="h2" />
          ))
        )}
        {mounted && filteredPosts.length === 0 && (
          <p className="text-text-light font-medium py-20 text-center text-xl">
            해당 조건에 맞는 포스트가 없습니다.
          </p>
        )}
      </div>
    </>
  );
}
