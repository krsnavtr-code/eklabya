import { MetadataRoute } from "next";

const baseUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || "";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/login/",
        "/register/",
        "/checkout/",
        "/cart/",
        "/account/",
        "/dashboard/",
      ],
    },
    sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : "/sitemap.xml",
  };
}
