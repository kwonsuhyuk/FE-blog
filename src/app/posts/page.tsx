import { Metadata } from "next";
import { getSortedPostsData, getAllCategories } from "@/src/lib/posts";
import PostsClient from "./PostsClient";

export const metadata: Metadata = {
  title: "Posts",
  description: "프론트엔드 개발 과정에서의 생각과 배움을 기록한 포스트 목록입니다.",
};

export default async function PostsPage() {
  const allPosts = await getSortedPostsData();
  const categories = await getAllCategories();

  return (
    <main className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <PostsClient allPosts={allPosts} categories={categories} />
      </div>
    </main>
  );
}
