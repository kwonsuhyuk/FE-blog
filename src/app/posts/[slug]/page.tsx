import Link from "next/link";
import { getPostData, getSortedPostsData } from "@/src/lib/posts";
import { notFound } from "next/navigation";
import { TOC } from "@/src/components/TOC";
import { Metadata } from "next";
import { CodeBlockManager } from "@/src/components/CodeBlockManager";
import { Comments } from "@/src/components/Comments";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const postData = await getPostData(params.slug);
    return {
      title: postData.title,
      description: postData.description,
      openGraph: {
        title: postData.title,
        description: postData.description,
        type: "article",
        publishedTime: postData.date,
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

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
        <CodeBlockManager />
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
              prose-img:rounded-2xl prose-blockquote:border-primary prose-blockquote:bg-bg-subtle prose-blockquote:py-1
              text-text-muted"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
          
          {/* Post Navigation */}
          <nav className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-4 pt-12 border-t border-border-subtle">
            {postData.prevPost ? (
              <Link 
                href={`/posts/${postData.prevPost.slug}`}
                className="group p-6 rounded-2xl border border-border-subtle hover:bg-bg-subtle transition-all text-left flex flex-col gap-2"
              >
                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-light transition-colors group-hover:text-primary">
                  <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                  Older Post
                </div>
                <span className="text-base font-bold text-text-main line-clamp-1">
                  {postData.prevPost.title}
                </span>
              </Link>
            ) : <div />}

            {postData.nextPost ? (
              <Link 
                href={`/posts/${postData.nextPost.slug}`}
                className="group p-6 rounded-2xl border border-border-subtle hover:bg-bg-subtle transition-all text-right flex flex-col items-end gap-2"
              >
                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-light transition-colors group-hover:text-primary">
                  Newer Post
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <span className="text-base font-bold text-text-main line-clamp-1">
                  {postData.nextPost.title}
                </span>
              </Link>
            ) : <div />}
          </nav>

          {/* Comments Section */}
          <Comments />

          <footer className="mt-16">
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
