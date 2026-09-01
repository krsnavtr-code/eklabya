import { MetadataRoute } from "next";
import {
  getSiteBase,
  fetchActiveCategories,
  fetchAllPublishedCourseSlugs,
  fetchAllPublishedBlogSlugs,
} from "./lib/server-api";

const FALLBACK_SITE_URL = "https://www.theeklavya.com";

const staticPaths = [
  { path: "/", priority: 1.0 },
  { path: "/about", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/courses", priority: 0.9 },
  { path: "/categories", priority: 0.7 },
  { path: "/blog", priority: 0.9 },
  { path: "/faq", priority: 0.7 },
  { path: "/success-stories", priority: 0.7 },
  { path: "/awards-recognition", priority: 0.7 },
  { path: "/media-mentions", priority: 0.7 },
  { path: "/news-events", priority: 0.7 },
  { path: "/privacy-policy", priority: 0.5 },
  { path: "/terms-of-service", priority: 0.5 },
  { path: "/payment-terms-and-conditions", priority: 0.5 },
  { path: "/scholarship", priority: 0.7 },
  { path: "/register", priority: 0.6 },
  { path: "/login", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (getSiteBase() || FALLBACK_SITE_URL).replace(/\/$/, "");

  let categories: Awaited<ReturnType<typeof fetchActiveCategories>> = [];
  let courseSlugs: Awaited<ReturnType<typeof fetchAllPublishedCourseSlugs>> =
    [];
  let blogSlugs: Awaited<ReturnType<typeof fetchAllPublishedBlogSlugs>> = [];

  try {
    [categories, courseSlugs, blogSlugs] = await Promise.all([
      fetchActiveCategories(),
      fetchAllPublishedCourseSlugs(),
      fetchAllPublishedBlogSlugs(),
    ]);
  } catch (err) {
    console.error("Sitemap fetch failed:", err);
  }

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(
    ({ path, priority }) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
    }),
  );

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.isActive !== false)
    .map((cat) => {
      const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
      return {
        url: `${base}/courses/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

  const courseEntries: MetadataRoute.Sitemap = courseSlugs
    .map((course) => course.slug || course._id)
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    )
    .map((slug) => ({
      url: `${base}/course/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs
    .map((post) => post.slug || post._id)
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    )
    .map((slug) => ({
      url: `${base}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...courseEntries,
    ...blogEntries,
  ];
}
