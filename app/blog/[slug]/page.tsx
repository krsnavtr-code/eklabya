import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUserCircle,
  FaCalendarAlt,
  FaClock,
  FaTags,
  FaFolderOpen,
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
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500/30">
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* 
        ======================================================================
        Custom CSS for Quill Editor Rendering
        Ye block ensure karega ki admin panel se aane wala alignment, 
        text size, aur YouTube videos frontend par perfectly render ho!
        ======================================================================
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .blog-content .ql-align-center { text-align: center; }
        .blog-content .ql-align-right { text-align: right; }
        .blog-content .ql-align-justify { text-align: justify; }
        .blog-content .ql-size-small { font-size: 0.875rem; }
        .blog-content .ql-size-large { font-size: 1.5rem; font-weight: 600; line-height: 1.2; }
        .blog-content .ql-size-huge { font-size: 2.25rem; font-weight: 700; line-height: 1.1; }
        
        /* Responsive iframe for YouTube/Vimeo Videos */
        .blog-content iframe.ql-video { 
          width: 100%; 
          aspect-ratio: 16/9; 
          border-radius: 12px; 
          margin: 2rem 0; 
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); 
        }

        /* Prevent Tailwind Prose from overriding inline background colors */
        .blog-content [style*="background-color"] {
          padding: 0.1rem 0.25rem;
          border-radius: 0.25rem;
        }

        /* Blockquote Styling */
        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          background-color: #f8fafc;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
        }
        .dark .blog-content blockquote {
          background-color: #1e293b;
          border-left-color: #60a5fa;
        }
      `,
        }}
      />

      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/blog"
              className="group flex items-center text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              </div>
              Back to Articles
            </Link>
            <ShareButton
              title={post.title}
              text={post.excerpt}
              url={canonical}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ================= LEFT CONTENT AREA ================= */}
        <section className="lg:col-span-8 space-y-8">
          <article className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/60 overflow-hidden">
            {/* Header / Meta Info */}
            <div className="p-6 md:p-10 pb-6">
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/blog?category=${category.slug}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm font-medium text-slate-500 dark:text-slate-400 py-4 border-y border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FaUserCircle className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    {post.author?.name || "Eklabya"}
                  </span>
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" />
                  <time dateTime={post.createdAt}>
                    {formatDate(post.createdAt)}
                  </time>
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-emerald-500" />
                  <span>{Math.ceil(post.readingTime || 5)} min read</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="px-6 md:px-10 pb-8">
                <div className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden relative shadow-inner">
                  <img
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"></div>
                </div>
              </div>
            )}

            {/* 
              Article Content 
              Prose classes modified to respect inline styles from Quill 
            */}
            <div className="px-6 md:px-10 pb-10">
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-img:rounded-xl">
                {post.content ? (
                  <div
                    className="blog-content leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <p className="text-center text-slate-500 italic py-10">
                    No content available for this post.
                  </p>
                )}
              </div>
            </div>

            {/* Footer Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="px-6 md:px-10 py-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white mr-2 flex items-center gap-2">
                    <FaTags className="text-blue-500" /> Tags:
                  </span>
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Related Posts */}
          {post.categories && post.categories.length > 0 && (
            <div className="pt-8">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                Keep Reading
              </h2>
              <RelatedPosts
                categoryId={post.categories[0]._id}
                excludePostId={post._id}
              />
            </div>
          )}
        </section>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Author Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {(post.author?.name || "Eklabya").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    Written By
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {post.author?.name || "Eklabya"}
                  </h3>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {post.author?.bio ||
                  "Passionate about education, technology, and sharing knowledge to help students build a better future."}
              </p>
            </div>

            {/* Share Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 rounded-2xl shadow-lg p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                Enjoyed this article?
              </h3>
              <p className="text-slate-300 text-sm mb-6 relative z-10">
                Share it with your network and help others learn something new
                today.
              </p>
              <div className="relative z-10 bg-white dark:bg-slate-900 rounded-xl p-1">
                <ShareButton
                  title={post.title}
                  text={post.excerpt}
                  url={canonical}
                  className="w-full font-bold"
                />
              </div>
            </div>

            {/* Categories Widget */}
            {post.categories && post.categories.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 p-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaFolderOpen className="text-blue-500" /> Topics in this post
                </h3>
                <div className="flex flex-col gap-2">
                  {post.categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/blog?category=${category.slug}`}
                      className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                    >
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </span>
                      <span className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
