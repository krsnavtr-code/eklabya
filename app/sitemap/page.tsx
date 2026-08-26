import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap | Eklabya",
  description:
    "Browse all pages, courses, and blog posts available on Eklabya.",
  robots: "index, follow",
};

const apiBase =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "") || "";

const staticPages = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/courses", label: "Courses" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/awards", label: "Awards" },
  { href: "/media-mentions", label: "Media Mentions" },
  { href: "/faq", label: "FAQs" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/payment-terms-and-conditions", label: "Payment T&C" },
  { href: "/scholarship", label: "Scholarship" },
  { href: "/register", label: "Register" },
  { href: "/login", label: "Login" },
];

async function fetchCourses(): Promise<{ slug?: string; _id?: string; title?: string }[]> {
  if (!apiBase) return [];
  try {
    const res = await fetch(
      `${apiBase}/courses?limit=2000&isPublished=true&fields=slug,title`,
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

async function fetchBlogPosts(): Promise<{ slug?: string; _id?: string; title?: string }[]> {
  if (!apiBase) return [];
  try {
    const res = await fetch(
      `${apiBase}/blog/posts?limit=2000&status=published&fields=slug,title`,
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

export default async function SitemapPage() {
  const [courses, posts] = await Promise.all([fetchCourses(), fetchBlogPosts()]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Sitemap
        </h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Pages
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {staticPages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Courses
          </h2>
          {courses.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {courses.map((course) => {
                const slug = course.slug || course._id;
                if (!slug) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/course/${slug}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      {course.title || slug}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No courses found.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Blog Posts
          </h2>
          {posts.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {posts.map((post) => {
                const slug = post.slug || post._id;
                if (!slug) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/blog/${slug}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      {post.title || slug}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
