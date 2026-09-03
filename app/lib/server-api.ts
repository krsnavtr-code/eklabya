import "server-only";

const DEFAULT_API_URL = "http://localhost:4002/api";

export function getApiBase() {
  const url =
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  return url.replace(/\/$/, "");
}

export function getSiteBase() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "";
  return url.replace(/\/$/, "");
}

function extractList<T>(data: any): T[] | null {
  if (!data) return null;
  const list =
    data.data?.posts ??
    data.posts ??
    data.data ??
    data.courses ??
    data.categories ??
    data.items ??
    data;
  return Array.isArray(list) ? list : null;
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    next: { revalidate: 3600 },
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (res.status === 404) {
    const error = new Error("Not found");
    (error as any).status = 404;
    throw error;
  }

  if (!res.ok) {
    const error = new Error(`API error: ${res.status}`);
    (error as any).status = res.status;
    throw error;
  }

  return (await res.json()) as T;
}

const COURSE_FIELDS = [
  "title",
  "description",
  "shortDescription",
  "category",
  "instructor",
  "price",
  "originalPrice",
  "discount",
  "totalHours",
  "thumbnail",
  "image",
  "rating",
  "enrolledStudents",
  "duration",
  "whatYouWillLearn",
  "requirements",
  "whoIsThisFor",
  "curriculum",
  "reviews",
  "isFeatured",
  "showOnHome",
  "slug",
  "status",
  "metaTitle",
  "metaDescription",
  "metaKeywords",
  "tags",
  "prerequisites",
  "skills",
  "certificateIncluded",
  "isPublished",
  "language",
  "level",
  "mentors",
  "faqs",
  "brochureUrl",
  "brochureGeneratedAt",
  "previewVideo",
  "imageUrl",
].join(",");

export interface CourseData {
  _id: string;
  title: string;
  slug?: string;
  originalPrice?: number;
  price: number;
  category?: { name?: string };
  isFeatured?: boolean;
  level?: string;
  duration?: string | number;
  curriculum?: Array<{
    title: string;
    week?: number | string;
    topics?: string[];
    duration?: number | string;
    description?: string;
  }>;
  language?: string;
  shortDescription?: string;
  description?: string;
  aboutCourseInIndia?: string;
  whatYouWillLearn?: string[];
  prerequisites?: string[];
  whoIsThisFor?: string[];
  skills?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  rating?: number;
  reviews?: any[];
  enrolledStudents?: number;
  thumbnail?: string;
  imageUrl?: string;
  brochureUrl?: string;
  previewVideo?: string;
  certificateIncluded?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  customHeadings?: {
    aboutCourse: string;
    aboutCourseInIndia: string;
    whatYouWillLearn: string;
    requirements: string;
    whoIsThisFor: string;
    curriculum: string;
    skills: string;
    topics: string;
    prerequisites: string;
    faq: string;
  };
  hasDiscount?: boolean;
}

export async function fetchCourseBySlug(
  slug: string,
): Promise<CourseData | null> {
  const base = getApiBase();
  try {
    const json = await fetchJson<any>(
      `${base}/courses/${slug}?fields=${COURSE_FIELDS}`,
    );
    const course = json?.data ?? json ?? null;
    return course as CourseData | null;
  } catch (err: any) {
    if (err.status === 404) return null;
    throw err;
  }
}

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  imageUrl?: string;
  author?: { name?: string; bio?: string };
  createdAt: string;
  categories?: BlogCategory[];
  tags?: string[];
  readingTime?: number;
}

export async function fetchBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const base = getApiBase();
  try {
    const json = await fetchJson<any>(`${base}/blog/posts/${slug}`);
    const post = json?.data?.post ?? json?.post ?? json?.data ?? json ?? null;
    return post as BlogPost | null;
  } catch (err: any) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function fetchRelatedPosts(
  categoryId: string,
  excludePostId: string,
  limit: number = 3,
): Promise<BlogPost[]> {
  const base = getApiBase();
  const json = await fetchJson(
    `${base}/blog/categories/${categoryId}?status=published&exclude=${excludePostId}&limit=${limit}`,
  );
  const list = extractList<BlogPost>(json);
  return list || [];
}

export async function fetchNextBlogs(
  currentSlug: string,
  limit: number = 4,
): Promise<BlogPost[]> {
  const base = getApiBase();
  const json = await fetchJson(
    `${base}/blog/posts?status=published&limit=1000&fields=title,slug,featuredImage,createdAt,readingTime,_id`,
  );
  const list = extractList<BlogPost>(json);
  if (!list) return [];
  const currentIndex = list.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return [];
  return list.slice(currentIndex + 1, currentIndex + 1 + limit);
}

export interface CategoryData {
  _id: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}

export interface CourseListItem {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  price?: number;
  originalPrice?: number;
  duration?: string;
  isFeatured?: boolean;
  category?: { _id: string; name: string };
}

export async function fetchActiveCategories(): Promise<CategoryData[]> {
  const base = getApiBase();
  const json = await fetchJson(`${base}/categories?limit=100&status=active`);
  return extractList<CategoryData>(json) || [];
}

export async function fetchCoursesByCategory(
  categoryId: string,
): Promise<CourseListItem[]> {
  const base = getApiBase();
  const json = await fetchJson(
    `${base}/courses?category=${categoryId}&limit=100&isPublished=true&status=published`,
  );
  return extractList<CourseListItem>(json) || [];
}

export async function fetchAllPublishedCourses(): Promise<CourseListItem[]> {
  const base = getApiBase();
  const json = await fetchJson(
    `${base}/courses?limit=100&isPublished=true&status=published`,
  );
  return extractList<CourseListItem>(json) || [];
}

export async function fetchAllPublishedCourseSlugs(): Promise<
  { slug?: string; _id?: string }[]
> {
  const base = getApiBase();
  const json = await fetchJson(
    `${base}/courses?limit=2000&isPublished=true&fields=slug,title`,
  );
  return extractList<{ slug?: string; _id?: string }>(json) || [];
}

export async function fetchAllPublishedBlogSlugs(): Promise<
  { slug?: string; _id?: string; title?: string }[]
> {
  const base = getApiBase();
  const json = await fetchJson(
    `${base}/blog/posts?limit=2000&status=published&fields=slug,title`,
  );
  return (
    extractList<{ slug?: string; _id?: string; title?: string }>(json) || []
  );
}
