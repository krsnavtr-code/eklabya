import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaTags,
} from "react-icons/fa";
import { fetchBlogPostBySlug, getSiteBase } from "../../lib/server-api";
import { getImageUrl } from "../../utils/imageUtils";
import ShareButton from "../../components/ShareButton";
import RelatedPosts from "../_components/RelatedPosts";

const FALLBACK_SITE_URL = "https://www.theeklavya.com";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) return {};

  const siteBase = getSiteBase() || FALLBACK_SITE_URL;
  const canonical = `${siteBase}/blog/${post.slug}`;
  const image = getImageUrl(post.imageUrl || post.featuredImage);

  return {
    title: `${post.title} | Eklabya Blog`,
    description: post.excerpt || "Read this article on Eklabya",
    keywords: post.tags?.join(", ") || "blog, article, education, learning",
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt || "Read this article on Eklabya",
      url: canonical,
      type: "article",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Read this article on Eklabya",
      images: image ? [image] : [],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) notFound();

  const siteBase = getSiteBase() || FALLBACK_SITE_URL;
  const canonical = `${siteBase}/blog/${post.slug}`;
  const blogImage =
    getImageUrl(post.imageUrl || post.featuredImage) ||
    `${siteBase}/images/eklabya-logo-fit-E.jpeg`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || "Read this article on Eklabya",
      image: blogImage,
      author: {
        "@type": "Person",
        name: post.author?.name || "Eklabya",
      },
      publisher: {
        "@type": "Organization",
        name: "The Eklavya",
        logo: {
          "@type": "ImageObject",
          url: `${siteBase}/images/eklabya-logo-fit-E.jpeg`,
        },
      },
      datePublished: post.createdAt,
      dateModified: post.createdAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteBase,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteBase}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: canonical,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/blog"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Blog
            </Link>
            <ShareButton
              title={post.title}
              text={post.excerpt}
              url={canonical}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3">
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {post.featuredImage && (
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={getImageUrl(post.featuredImage)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-3 sm:p-6 md:p-12">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.categories?.map((category) => (
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
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center mr-6 mb-2 sm:mb-0">
                  <FaUser className="mr-1" />
                  <span>{post.author?.name || "Eklabya"}</span>
                </div>
                <div className="flex items-center mr-6 mb-2 sm:mb-0">
                  <FaCalendarAlt className="mr-1" />
                  <time dateTime={post.createdAt}>
                    {formatDate(post.createdAt)}
                  </time>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{Math.ceil(post.readingTime || 5)} min read</span>
                </div>
              </div>

              {post.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-3 font-medium">
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="px-3 sm:px-6 md:px-12 pb-6">
              <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                {post.content ? (
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <p>No content available.</p>
                )}
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="px-3 sm:px-6 md:px-12 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <FaTags className="text-gray-500 mr-2" />
                  {post.tags.map((tag, index) => (
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

          {post.categories && post.categories.length > 0 && (
            <RelatedPosts
              categoryId={post.categories[0]._id}
              excludePostId={post._id}
            />
          )}
        </section>

        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              About the Author
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {post.author?.bio ||
                "This author loves writing about technology, design, and web development."}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Enjoyed the post?
            </p>
            <ShareButton
              title={post.title}
              text={post.excerpt}
              url={canonical}
              className="w-full"
            />
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Categories
              </h3>
              <ul className="space-y-2">
                {post.categories.map((category) => (
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

          {post.tags && post.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
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
