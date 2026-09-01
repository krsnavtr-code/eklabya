import Link from "next/link";
import { fetchRelatedPosts, BlogPost } from "../../lib/server-api";
import { getImageUrl } from "../../utils/imageUtils";
import { FaClock } from "react-icons/fa";

export default async function RelatedPosts({
  categoryId,
  excludePostId,
}: {
  categoryId: string;
  excludePostId: string;
}) {
  const relatedPosts = await fetchRelatedPosts(categoryId, excludePostId);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-l-4 border-blue-600 pl-3">
        Related Articles
      </h2>

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
                src={getImageUrl(relatedPost.featuredImage)}
                alt={relatedPost.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              </Link>
            )}
            <div className="p-6">
              {relatedPost.categories && relatedPost.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {relatedPost.categories.slice(0, 2).map((category) => (
                    <Link
                      key={category._id}
                      href={`/blog?category=${category.slug}`}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
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
    </section>
  );
}
