import Link from "next/link";
import { getPostData, getSortedPostsData } from "@/src/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post(props: Props) {
  const params = await props.params;
  const postData = await getPostData(params.slug);

  return (
    <article className="max-w-3xl mx-auto px-6 py-24 text-text-main">
      <header className="mb-16 border-b border-slate-100 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-xs font-black text-text-light uppercase tracking-[0.2em]">
            <span>{postData.date}</span>
          </div>
          <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">
            {postData.category}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-[1.2]">
          {postData.title}
        </h1>
        
        <p className="text-lg text-text-muted font-medium leading-relaxed">
          {postData.description}
        </p>
      </header>

      <div
        className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tight 
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-pre:bg-slate-900 prose-pre:rounded-2xl prose-pre:p-6
          prose-img:rounded-2xl prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:py-1
          text-text-muted"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
      
      <footer className="mt-20 pt-10 border-t border-slate-100">
        <Link
          href="/posts"
          className="group inline-flex items-center text-xs font-black text-text-light hover:text-primary transition-colors tracking-widest uppercase"
        >
          <span className="mr-3 transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
          목록으로 돌아가기
        </Link>
      </footer>
    </article>
  );
}
