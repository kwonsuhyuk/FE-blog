import Link from "next/link";
import { PostMetadata } from "@/src/lib/posts";

interface PostCardProps {
  post: PostMetadata;
  headingLevel?: "h2" | "h3";
}

export function PostCard({ post, headingLevel = "h2" }: PostCardProps) {
  const Heading = headingLevel;
  return (
    <Link href={`/posts/${post.slug}`} className="group block -mx-4">
      <article className="p-4 rounded-2xl transition-all duration-300 group-hover:bg-slate-50 text-left">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-bold text-text-light tracking-widest uppercase">
            {post.date}
          </span>
          <span className="w-1 h-1 rounded-full bg-border-main" />
          <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">
            {post.category}
          </span>
        </div>
        
        <Heading className="text-xl md:text-2xl font-black text-text-main tracking-tight leading-snug mb-2">
          {post.title}
        </Heading>
        
        <p className="text-text-muted text-sm leading-relaxed line-clamp-3 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
          {post.description}
        </p>
      </article>
    </Link>
  );
}
