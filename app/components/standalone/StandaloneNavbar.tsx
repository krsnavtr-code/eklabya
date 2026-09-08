"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export interface StandaloneNavLink {
  label: string;
  // In-page anchor target, e.g. "#courses"
  href: string;
}

interface StandaloneNavbarProps {
  links: StandaloneNavLink[];
  ctaLabel?: string;
  ctaHref?: string;
}

const LOGO_URL = "http://eklabya.com/api/upload/file/eKlabya-fit-logo-8874.png";

// Self-contained navbar for standalone landing pages. Uses the main site's
// logo but only scrolls to sections within the current page — it never
// navigates to the main website.
export default function StandaloneNavbar({
  links,
  ctaLabel = "Enquire Now",
  ctaHref = "#enquire",
}: StandaloneNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16 gap-3">
            {/* Logo (same as main site, no navigation) */}
            <a
              href="#top"
              onClick={(e) => scrollTo(e, "#top")}
              className="flex-shrink-0 flex items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO_URL}
                alt="eklabya – Your Online Learning Partner"
                className="h-10 rounded"
              />
            </a>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-2">
              <a
                href={ctaHref}
                onClick={(e) => scrollTo(e, ctaHref)}
                className="bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                {ctaLabel}
              </a>
              <button
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-200/80 dark:border-slate-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 space-y-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="block px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Spacer so page content starts below the fixed navbar */}
      <div className="h-14 md:h-16" aria-hidden="true" />
    </>
  );
}
