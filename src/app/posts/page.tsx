import { getSortedPostsData } from "@/src/lib/posts";
import PostsClient from "./PostsClient";

export default async function PostsPage() {
  const allPosts = await getSortedPostsData();

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-20 text-center md:text-left">
        <h1 className="text-5xl font-black tracking-tighter mb-4 text-text-main">Posts</h1>
        <p className="text-lg text-text-muted font-medium leading-relaxed max-w-2xl">
          프론트엔드 개발 과정에서 마주한 고민과 해결책들을 <br className="hidden md:block" />
          하나씩 기록해 나가는 공간입니다.
        </p>
      </header>

      <PostsClient allPosts={allPosts} />
    </main>
  );
}
