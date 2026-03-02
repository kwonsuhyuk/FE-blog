import Link from "next/link";
import { PostMetadata } from "@/src/lib/posts";

interface PostCardProps {
  post: PostMetadata;
  headingLevel?: "h2" | "h3";
}

export function PostCard({ post, headingLevel = "h2" }: PostCardProps) {
  const Heading = headingLevel;
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="space-y-3 text-left">
        <Heading className="text-xl md:text-2xl font-black text-text-main group-hover:text-primary transition-colors duration-300 tracking-tight leading-snug">
          {post.title}
        </Heading>
        <p className="text-text-muted text-sm leading-relaxed line-clamp-2 font-medium">
          {post.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-bold text-text-light tracking-widest uppercase">{post.date}</span>
          <span className="text-[10px] font-black text-text-light group-hover:text-text-muted transition-colors uppercase tracking-widest">
            {post.category}
          </span>
        </div>
      </article>
    </Link>
  );
}
