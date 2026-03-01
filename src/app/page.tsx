import { getSortedPostsData } from "@/src/lib/posts";
import HomeClient from "./HomeClient";

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return <HomeClient allPostsData={allPostsData} />;
}
