"use client";

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  og?: {
    title?: string;
    description?: string;
    type?: string;
    image?: string;
    url?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
  };
}

export default function SEO({
  title = "Eklabya - Online Learning Platform",
  description =
    "Eklabya offers professional and management courses, including short programs and degree collaborations.",
  keywords =
    "online courses, e-learning, professional courses, management courses, online education, eklabya",
  canonical = "https://eklabya.com",
  robots = "index, follow",
  og = {},
  twitter = {},
}: SEOProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = title;

    const setMeta = (
      nameOrProperty: string,
      content: string | undefined,
      property = false,
    ) => {
      if (!content) return;
      const attr = property ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string | undefined) => {
      if (!href) return;
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", robots);
    setLink("canonical", canonical);

    setMeta("og:title", og.title || title, true);
    setMeta("og:description", og.description || description, true);
    setMeta("og:image", og.image, true);
    setMeta("og:type", og.type || "website", true);
    setMeta("og:url", og.url || canonical, true);

    setMeta("twitter:card", twitter.card || "summary_large_image");
    setMeta("twitter:title", og.title || title);
    setMeta("twitter:description", og.description || description);
    setMeta("twitter:image", og.image);
    if (twitter.site) setMeta("twitter:site", twitter.site);
    if (twitter.creator) setMeta("twitter:creator", twitter.creator);
  }, [title, description, keywords, canonical, robots, og, twitter]);

  return null;
}
