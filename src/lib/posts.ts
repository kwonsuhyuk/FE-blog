import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
}

export interface PostData extends PostMetadata {
  contentHtml: string;
}

export async function getSortedPostsData(): Promise<PostMetadata[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        ...(matterResult.data as Omit<PostMetadata, 'slug'>),
      };
    })
  );

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(matterResult.data as Omit<PostMetadata, 'slug'>),
  };
}

export async function getAllCategories() {
  const posts = await getSortedPostsData();
  const categories = new Set<string>(['All', 'Dev', 'Experience', '회고']);
  posts.forEach(post => {
    if (post.category) categories.add(post.category);
  });
  return Array.from(categories);
}

export async function getPostsByCategory(category: string) {
  const allPosts = await getSortedPostsData();
  if (category.toLowerCase() === 'all') return allPosts;
  return allPosts.filter(post => 
    post.category?.toLowerCase() === category.toLowerCase()
  );
}
