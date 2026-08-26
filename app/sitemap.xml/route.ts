import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600;

const baseUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || "";

const apiBase =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "") || "";

const staticPaths = [
  "/",
  "/about",
  "/contact",
  "/courses",
  "/categories",
  "/blog",
  "/testimonials",
  "/awards",
  "/media-mentions",
  "/faq",
  "/privacy-policy",
  "/terms-of-service",
  "/payment-terms-and-conditions",
  // "/scholarship",
  // "/register",
  // "/login",
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

async function fetchBlogPosts(): Promise<{ slug?: string; _id?: string }[]> {
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  if (!baseUrl) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { "Content-Type": "application/xml" } },
    );
  }

  const [courses, posts] = await Promise.all([fetchCourses(), fetchBlogPosts()]);
  const now = new Date().toISOString();
  const urls: string[] = [...staticPaths];

  for (const course of courses) {
    const slug = course.slug || course._id;
    if (slug) urls.push(`${baseUrl}/course/${slug}`);
  }

  for (const post of posts) {
    const slug = post.slug || post._id;
    if (slug) urls.push(`${baseUrl}/blog/${slug}`);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml" },
  });
}

