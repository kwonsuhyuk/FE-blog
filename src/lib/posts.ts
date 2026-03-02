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
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory).filter(fileName => fileName.endsWith('.md'));
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // 본문에서 미리보기 텍스트 추출 (마크다운 태그 제거)
      const contentPreview = matterResult.content
        .replace(/[#*`>]/g, '') // 간단한 마크다운 기호 제거
        .replace(/\n+/g, ' ')   // 줄바꿈을 공백으로 변경
        .trim()
        .substring(0, 160);     // 약 2~3줄 분량

      return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        category: matterResult.data.category,
        description: matterResult.data.description || contentPreview,
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

  const contentPreview = matterResult.content
    .replace(/[#*`>]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, 160);

  return {
    slug,
    contentHtml,
    title: matterResult.data.title,
    date: matterResult.data.date,
    category: matterResult.data.category,
    description: matterResult.data.description || contentPreview,
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
