"use client";

import { useEffect, useState, Suspense, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaClock,
  FaArrowRight,
  FaSearch,
  FaBook,
} from "react-icons/fa";
import { getImageUrl } from "../utils/imageUtils";
import { getBlogPosts, searchBlogPosts } from "../api/blogApi";
import SEO from "../components/SEO";

interface Category {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  createdAt: string;
  readingTime?: number;
  categories?: Category[];
}

const pageSize = 9;

function BlogListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const q = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        if (q.trim()) {
          const response = await searchBlogPosts(q.trim());
          const found = response.data?.posts || [];
          setPosts(found);
          setTotal(found.length);
        } else {
          const response = await getBlogPosts({
            page,
            limit: pageSize,
            status: "published",
          });
          setPosts(response.data?.posts || []);
          setTotal(response.data?.total || 0);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, q]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = searchInput.trim();
    if (term) {
      router.push(`/blog?q=${encodeURIComponent(term)}`);
    } else {
      router.push("/blog");
    }
  };

  const clearSearch = () => {
    router.push("/blog");
  };

  const totalPages = Math.ceil(total / pageSize);

  const buildPageHref = (p: number) => (p === 1 ? "/blog" : `/blog?page=${p}`);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Eklabya Blog | Learn Skills, Build Your Career Today"
        description="Explore career tips, skill insights, industry trends and expert learning resources to build in-demand skills and grow your career with Eklabya."
        keywords="Eklabya blog, career tips, skill development, online learning, professional courses, career growth, industry trends, job skills, career guidance, education blog"
        og={{
          title: "Eklabya Blog | Learn Skills, Build Your Career Today",
          description:
            "Explore career tips, skill insights, industry trends and expert learning resources to build in-demand skills and grow your career with Eklabya.",
          type: "website",
        }}
      />

      {/* ===== HERO HEADER WITH SEARCH ===== */}
      <section className="relative overflow-hidden pt-4 sm:pt-10 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full backdrop-blur-md border border-white/20 text-gray-800 dark:text-gray-100 text-xs sm:text-sm font-semibold tracking-wide">
            <FaBook className="text-yellow-300" />
            <span>Eklabya Insights</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl text-gray-800 dark:text-gray-100 font-black tracking-tight leading-tight">
            Career Insights &amp; Learning Resources
          </h1>
          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-100 font-medium max-w-5xl mx-auto leading-relaxed">
            Expert articles, tutorials, and industry updates to help you stay
            ahead in your career and learning journey.
          </p>

          <form onSubmit={handleSearch} className="pt-2">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles, topics, skills..."
                className="w-full pl-11 pr-24 py-3.5 bg-white/95 dark:bg-gray-900/95 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl text-sm border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ===== RESULTS BAR ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {q ? (
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Found{" "}
              <span className="text-blue-600 dark:text-blue-400">{total}</span>{" "}
              results for &ldquo;{q}&rdquo;
            </p>
          ) : (
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Showing{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {posts.length}
              </span>{" "}
              of{" "}
              <span className="text-blue-600 dark:text-blue-400">{total}</span>{" "}
              articles
            </p>
          )}

          {q && (
            <button
              onClick={clearSearch}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* ===== POSTS GRID ===== */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(pageSize)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 p-5 space-y-4 animate-pulse shadow-md"
                >
                  <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-1 flex flex-col h-full"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block h-auto bg-slate-100 dark:bg-gray-700 overflow-hidden relative"
                    >
                      {post.featuredImage ? (
                        <img
                          src={getImageUrl(post.featuredImage)}
                          alt={post.title}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-auto flex items-center justify-center text-slate-400">
                          <FaBook className="text-4xl opacity-50" />
                        </div>
                      )}
                    </Link>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="inline-flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FaClock className="text-emerald-500" />
                          {Math.ceil(post.readingTime || 5)} min read
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 flex-grow leading-relaxed">
                        {post.excerpt ||
                          `${post.content?.substring(0, 180) || ""}...`}
                      </p>

                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.slice(0, 3).map((category) => (
                            <span
                              key={category._id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/60">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          Read More
                          <FaArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {!q && totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                  {page > 1 && (
                    <Link
                      href={buildPageHref(page - 1)}
                      className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={buildPageHref(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                          p === page
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {p}
                      </Link>
                    ),
                  )}
                  {page < totalPages && (
                    <Link
                      href={buildPageHref(page + 1)}
                      className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-lg">
                <FaSearch />
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {q ? "No articles matching your search" : "No articles found"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {q ? (
                  <>
                    We couldn&apos;t find any articles for &ldquo;{q}&rdquo;.
                    Try a different keyword or clear the search.
                  </>
                ) : (
                  "Check back soon for new career insights and learning resources."
                )}
              </p>
              {q && (
                <button
                  onClick={clearSearch}
                  className="mt-2 inline-block px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
          <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 animate-pulse" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(pageSize)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 p-5 space-y-4 animate-pulse h-80"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BlogListContent />
    </Suspense>
  );
}
