import { MetadataRoute } from "next";

const baseUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || "";

const apiBase =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "") || "";

const staticRoutes = [
  { path: "/", priority: 1.0 },
  { path: "/about", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/courses", priority: 0.9 },
  { path: "/categories", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/testimonials", priority: 0.7 },
  { path: "/awards", priority: 0.7 },
  { path: "/media-mentions", priority: 0.7 },
  { path: "/faq", priority: 0.7 },
  { path: "/privacy-policy", priority: 0.6 },
  { path: "/terms-of-service", priority: 0.6 },
  { path: "/payment-terms-and-conditions", priority: 0.6 },
  { path: "/scholarship", priority: 0.7 },
  { path: "/register", priority: 0.5 },
  { path: "/login", priority: 0.5 },
];

async function fetchCourses(): Promise<{ slug?: string; _id?: string }[]> {
  if (!apiBase) return [];
  try {
    const res = await fetch(
      `${apiBase}/courses?limit=2000&isPublished=true&fields=slug,updatedAt`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const list =
      data?.data || data?.courses || data?.items || data;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function fetchBlogPosts(): Promise<{ slug?: string; _id?: string; updatedAt?: string }[]> {
  if (!apiBase) return [];
  try {
    const res = await fetch(
      `${apiBase}/blog/posts?limit=2000&status=published&fields=slug,updatedAt`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const list =
      data?.posts || data?.data || data?.items || data;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  if (!baseUrl) return entries;

  for (const route of staticRoutes) {
    entries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route.priority,
    });
  }

  const courses = await fetchCourses();
  for (const course of courses) {
    const slug = course.slug || course._id;
    if (!slug) continue;
    entries.push({
      url: `${baseUrl}/course/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  const posts = await fetchBlogPosts();
  for (const post of posts) {
    const slug = post.slug || post._id;
    if (!slug) continue;
    entries.push({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
