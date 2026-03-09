import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface PostData extends PostMetadata {
  contentHtml: string;
  toc: TocItem[];
  prevPost?: PostMetadata;
  nextPost?: PostMetadata;
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

      // 본문에서 미리보기 텍스트 추출 (마크다운 태그 및 특수 기호 제거)
      const contentPreview = matterResult.content
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 텍스트만 남기기
        .replace(/[#*`>_\[\]]/g, '')             // 마크다운 기호 제거
        .replace(/\n+/g, ' ')                    // 줄바꿈을 공백으로 변경
        .trim()
        .substring(0, 500);                      // 충분한 분량 확보 (3줄을 꽉 채우기 위해 500자로 상향)

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
  const decodedSlug = decodeURIComponent(slug);
  const allPosts = await getSortedPostsData();
  const postIndex = allPosts.findIndex((post) => post.slug === decodedSlug);
  
  if (postIndex === -1) {
    throw new Error(`Post with slug "${decodedSlug}" not found`);
  }

  // 최신글이 리스트의 앞에 있으므로 (sort b.date - a.date)
  const nextPost = postIndex > 0 ? allPosts[postIndex - 1] : undefined;
  const prevPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : undefined;

  const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // 목차(TOC) 추출 및 ID 생성 로직
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(matterResult.content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣-]/g, '');
    toc.push({ id, text, level });
  }

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm) // GFM 지원 추가
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(matterResult.content);
  
  let contentHtml = processedContent.toString();

  // HTML 내의 h 태그들에 ID 주입 (목차 링크 연결용)
  toc.forEach(item => {
    const hTag = `<h${item.level}>${item.text}</h${item.level}>`;
    const hTagWithId = `<h${item.level} id="${item.id}">${item.text}</h${item.level}>`;
    contentHtml = contentHtml.replace(hTag, hTagWithId);
  });

  const contentPreview = matterResult.content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`>_\[\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, 500);

  return {
    slug,
    contentHtml,
    toc,
    prevPost,
    nextPost,
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
