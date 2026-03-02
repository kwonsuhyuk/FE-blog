import { getSortedPostsData, getAllCategories } from "@/src/lib/posts";
import PostsClient from "./PostsClient";

export default async function PostsPage() {
  const allPosts = await getSortedPostsData();
  const categories = await getAllCategories();

  return (
    <main className="max-w-6xl mx-auto px-6 py-24">
      <header className="mb-16">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-text-main">
          Posts
        </h1>
      </header>

      <PostsClient allPosts={allPosts} categories={categories} />
    </main>
  );
}
