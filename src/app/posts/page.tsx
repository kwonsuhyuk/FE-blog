import { getSortedPostsData, getAllCategories } from "@/src/lib/posts";
import PostsClient from "./PostsClient";

export default async function PostsPage() {
  const allPosts = await getSortedPostsData();
  const categories = await getAllCategories();

  return (
    <main className="max-w-6xl mx-auto px-6 py-24">
      <PostsClient allPosts={allPosts} categories={categories} />
    </main>
  );
}
