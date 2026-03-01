"use client";

import Link from "next/link";
import { useState } from "react";
import { PostData } from "@/src/lib/posts";

interface PostsClientProps {
  allPosts: Omit<PostData, 'contentHtml'>[];
}

export default function PostsClient({ allPosts }: PostsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Dev", "Experience", "회고"];

  const filteredPosts = selectedCategory === "All" 
    ? allPosts 
    : allPosts.filter(post => post.category === selectedCategory);

  return (
    <>
      {/* Category Navigation */}
      <nav className="flex items-center gap-8 mb-16 overflow-x-auto no-scrollbar pb-4 border-b border-border-subtle">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-lg font-bold transition-all whitespace-nowrap ${
              selectedCategory === category 
              ? "text-text-main scale-110" 
              : "text-text-light hover:text-text-muted"
            }`}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Post List */}
      <div className="grid gap-20">
        {filteredPosts.map(({ slug, date, title, description, category }) => (
          <Link key={slug} href={`/posts/${slug}`} className="group block">
            <article className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-black text-text-main group-hover:text-primary transition-colors duration-300 tracking-tight leading-snug">
                {title}
              </h2>
              <p className="text-text-muted text-base leading-relaxed line-clamp-6 font-medium">
                {description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-text-light tracking-widest uppercase">{date}</span>
                <span className="text-sm font-black text-text-light group-hover:text-text-muted transition-colors">
                  {category}
                </span>
              </div>
            </article>
          </Link>
        ))}
        {filteredPosts.length === 0 && (
          <p className="text-text-light font-medium py-20 text-center text-xl">
            해당 카테고리에 작성된 포스트가 없습니다.
          </p>
        )}
      </div>
    </>
  );
}
