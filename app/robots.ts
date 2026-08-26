import { MetadataRoute } from "next";

const baseUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || "";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : "/sitemap.xml",
  };
}
