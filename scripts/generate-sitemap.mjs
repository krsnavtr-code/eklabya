import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  "/scholarship",
  "/register",
  "/login",
];

async function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  try {
    const content = await readFile(envPath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/);
      if (!match) continue;
      const key = match[1];
      let value = match[2].trim();
      value = value.replace(/^["'](.*)["']$/, "$1");
      process.env[key] = value;
    }
  } catch (err) {
    console.warn("Could not read .env:", err.message);
  }
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchCourses(apiBase) {
  if (!apiBase) return [];
  try {
    const { data } = await axios.get(
      `${apiBase}/courses?limit=2000&isPublished=true&fields=slug,updatedAt`,
      { timeout: 60000 },
    );
    const list = data?.data || data?.courses || data?.items || data;
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn("Failed to fetch courses:", err.message);
    return [];
  }
}

async function fetchBlogPosts(apiBase) {
  if (!apiBase) return [];
  try {
    const { data } = await axios.get(
      `${apiBase}/blog/posts?limit=2000&status=published&fields=slug,updatedAt`,
      { timeout: 60000 },
    );
    const list =
      data?.data?.posts || data?.posts || data?.data || data?.items || data;
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn("Failed to fetch blog posts:", err.message);
    return [];
  }
}

async function main() {
  await loadEnv();

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is not set in .env");
    process.exit(1);
  }

  const [courses, posts] = await Promise.all([
    fetchCourses(apiBase),
    fetchBlogPosts(apiBase),
  ]);

  const now = new Date().toISOString();
  const urls = staticPaths.map((p) => `${baseUrl}${p}`);

  for (const course of courses) {
    const slug = course?.slug || course?._id;
    if (slug) urls.push(`${baseUrl}/course/${slug}`);
  }

  for (const post of posts) {
    const slug = post?.slug || post?._id;
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

  const publicDir = path.resolve(__dirname, "../public");
  await mkdir(publicDir, { recursive: true });
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  await writeFile(sitemapPath, body, "utf-8");

  console.log(`Sitemap generated with ${urls.length} URLs at ${sitemapPath}`);
  console.log(`Site base URL: ${baseUrl}`);
  console.log(`API base URL: ${apiBase || "(not set)"}`);
  console.log(`Courses: ${courses.length}, Blog posts: ${posts.length}`);
}

main();
