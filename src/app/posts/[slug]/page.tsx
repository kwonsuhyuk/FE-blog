import Link from "next/link";
import { getPostData, getSortedPostsData } from "@/src/lib/posts";
import { notFound } from "next/navigation";
import { TOC } from "@/src/components/TOC";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post(props: Props) {
  const params = await props.params;
  try {
    const postData = await getPostData(params.slug);

    return (
      <div className="max-w-6xl mx-auto relative px-6">
        <article className="max-w-3xl mx-auto py-24 text-text-main">
          <header className="mb-16 pb-12">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text-main mb-6 leading-[1.1]">
              {postData.title}
            </h1>
            <div className="flex items-center gap-3 text-sm md:text-base text-text-light font-medium tracking-tight">
              <time>{postData.date}</time>
              <span className="text-border-main">|</span>
              <span className="text-primary font-bold">{postData.category}</span>
            </div>
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

        {/* Table of Contents - Right Sidebar */}
        <TOC items={postData.toc} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
