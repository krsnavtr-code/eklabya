"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";
import SEO from "../components/SEO";
import { getBlogPosts } from "../api/blogApi";

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

export default function BlogListPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 9;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogPosts({
          page,
          limit: pageSize,
          status: "published",
        });
        setPosts(response.data?.posts || []);
        setTotal(response.data?.total || 0);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const buildPageHref = (p: number) => (p === 1 ? "/blog" : `/blog?page=${p}`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title="Eklabya Centre of Excellence Blog | Career Insights"
        description="Explore expert articles, career guidance, technology updates, and industry insights on the official blog of Eklabya Centre of Excellence."
        keywords="education blog, career advice, learning resources, industry insights, Eklabya articles, professional development"
        og={{
          title:
            "Eklabya Centre of Excellence Blog - Education & Career Insights",
          description:
            "Discover expert articles, study tips, and industry insights from Eklabya. Stay ahead in your learning journey with our educational blog.",
          type: "website",
        }}
      />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and updates from our team
          </p>
        </div>

        <div className="mb-5 text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {posts.length} of {total} posts
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
                >
                  {post.featuredImage && (
                    <div className="h-48 overflow-hidden">
                      <Link href={`/blog/${post.slug}`}>
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="flex items-center mr-4">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        {Math.ceil(post.readingTime || 5)} min read
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold mb-3 dark:text-white">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 text-black dark:text-white dark:hover:text-blue-400 transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                      {post.excerpt ||
                        `${post.content?.substring(0, 200) || ""}...`}
                    </p>

                    {post.categories && post.categories.length > 0 && (
                      <div className="mt-2 mb-4 flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                          <span
                            key={category._id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
                      >
                        Read More
                        <FaArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildPageHref(page - 1)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={buildPageHref(p)}
                      className={`px-4 py-2 rounded-md ${
                        p === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {p}
                    </Link>
                  ),
                )}
                {page < totalPages && (
                  <Link
                    href={buildPageHref(page + 1)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No blog posts found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
