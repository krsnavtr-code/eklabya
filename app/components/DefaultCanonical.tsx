"use client";

import { useInsertionEffect } from "react";
import { usePathname } from "next/navigation";

export default function DefaultCanonical() {
  const pathname = usePathname();

  useInsertionEffect(() => {
    if (typeof document === "undefined") return;

    const siteUrl =
      typeof process !== "undefined"
        ? process.env.NEXT_PUBLIC_SITE_URL
        : undefined;
    const baseUrl = (siteUrl || "").replace(/\/$/, "");
    const href = `${baseUrl}${pathname}`;

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }, [pathname]);

  return null;
}
