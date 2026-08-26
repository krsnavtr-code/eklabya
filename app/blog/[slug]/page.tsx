"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaShareAlt,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaTags,
} from "react-icons/fa";
import SEO from "../../components/SEO";
import JsonLd from "../../components/JsonLd";
import { getImageUrl } from "../../utils/imageUtils";
import { getBlogPostBySlug, getPostsByCategory } from "../../api/blogApi";

interface Author {
  name?: string;
  bio?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  author?: Author;
  createdAt: string;
  categories?: Category[];
  tags?: string[];
  readingTime?: number;
  imageUrl?: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRelatedLoading, setIsRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        const response = await getBlogPostBySlug(slug);
        const postData = response?.data?.post || response?.post;

        if (!postData) {
          throw new Error("No post data received");
        }

        setPost(postData);

        if (postData?.categories?.length > 0) {
          fetchRelatedPosts(postData.categories[0]._id, postData._id);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(
          "Failed to load blog post. It may have been moved or deleted.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRelatedPosts = async (
      categoryId: string,
      excludePostId: string,
    ) => {
      try {
        setIsRelatedLoading(true);
        const response = await getPostsByCategory(categoryId, {
          exclude: excludePostId,
          limit: 3,
        });
        const posts = response?.data?.posts || response?.posts || [];
        setRelatedPosts(Array.isArray(posts) ? posts : []);
      } catch (error) {
        console.error("Error fetching related posts:", error);
        setRelatedPosts([]);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleShare = async () => {
    if (!post) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    notFound();
    return null;
  }

  const {
    title,
    content,
    excerpt,
    featuredImage,
    author,
    createdAt,
    categories,
    tags,
    readingTime,
    imageUrl,
  } = post;

  const seoTitle = `${title} | Eklabya Blog`;
  const baseUrl =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL
      : undefined;
  const siteBase = (baseUrl || "").replace(/\/$/, "");
  const canonicalUrl = `${siteBase}/blog/${post.slug}`;
  const blogImage =
    getImageUrl(imageUrl || featuredImage) ||
    `${siteBase}${imageUrl || featuredImage || "/images/eklabya-logo-fit-E.jpeg"}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt || "Read this article on Eklabya",
    image: blogImage,
    author: {
      "@type": "Person",
      name: author?.name || "Eklabya",
    },
    publisher: {
      "@type": "Organization",
      name: "The Eklavya",
      logo: {
        "@type": "ImageObject",
        url: `${siteBase}/images/eklabya-logo-fit-E.jpeg`,
      },
    },
    datePublished: createdAt,
    dateModified: createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <JsonLd data={jsonLd} />
      <SEO
        title={seoTitle}
        description={excerpt || "Read this article on Eklabya"}
        keywords={tags?.join(", ") || "blog, article, education, learning"}
        canonical={canonicalUrl}
        og={{
          title: title,
          description: excerpt || "Read this article on Eklabya",
          type: "article",
          image: imageUrl || featuredImage,
          url: canonicalUrl,
        }}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push("/blog")}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Blog
            </button>
            <button
              onClick={handleShare}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              <FaShareAlt className="mr-2" /> Share Article
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Article */}
        <section className="lg:col-span-3">
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {featuredImage && (
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={featuredImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-3 sm:p-6 md:p-12">
              <div className="flex flex-wrap gap-2 mb-2">
                {categories?.map((category) => (
                  <Link
                    key={category._id}
                    href={`/blog?category=${category.slug}`}
                    className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:underline"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
              </h1>

              <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center mr-6 mb-2 sm:mb-0">
                  <FaUser className="mr-1" />
                  <span>{author?.name || "Eklabya"}</span>
                </div>
                <div className="flex items-center mr-6 mb-2 sm:mb-0">
                  <FaCalendarAlt className="mr-1" />
                  <time dateTime={createdAt}>{formatDate(createdAt)}</time>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{Math.ceil(readingTime || 5)} min read</span>
                </div>
              </div>

              {excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-3 font-medium">
                  {excerpt}
                </p>
              )}
            </div>

            {/* Article Content */}
            <div className="px-3 sm:px-6 md:px-12 pb-6">
              <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                {content ? (
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <p>No content available.</p>
                )}
              </div>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="px-3 sm:px-6 md:px-12 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <FaTags className="text-gray-500 mr-2" />
                  {tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-l-4 border-blue-600 pl-3">
                Related Articles
              </h2>

              {isRelatedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
                    >
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="p-6 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <article
                      key={relatedPost._id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {relatedPost.featuredImage && (
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="block h-48 overflow-hidden"
                        >
                          <img
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                      )}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {relatedPost.categories
                            ?.slice(0, 2)
                            .map((category) => (
                              <Link
                                key={category._id}
                                href={`/blog?category=${category.slug}`}
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {category.name}
                              </Link>
                            ))}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                          <Link
                            href={`/blog/${relatedPost.slug}`}
                            className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {relatedPost.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <FaClock className="mr-1" />
                          <span>
                            {Math.ceil(relatedPost.readingTime || 5)} min read
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              About the Author
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {author?.bio ||
                "This author loves writing about technology, design, and web development."}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Enjoyed the post?
            </p>
            <button
              onClick={handleShare}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center justify-center gap-2 transition"
            >
              <FaShareAlt /> Share This Post
            </button>
          </div>

          {categories && categories.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link
                      href={`/blog?category=${category.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
