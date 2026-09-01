import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import {
  fetchActiveCategories,
  fetchCoursesByCategory,
  getSiteBase,
  CategoryData,
} from "../../lib/server-api";
import { getImageUrl } from "../../utils/imageUtils";
import { formatPrice } from "../../utils/format";

const FALLBACK_SITE_URL = "https://www.theeklavya.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  const categories = await fetchActiveCategories();
  const categoryData = findCategory(categories, categoryName);

  if (!categoryData) return {};

  const siteBase = getSiteBase() || FALLBACK_SITE_URL;
  const slug = categoryData.slug || categoryName;
  const canonical = `${siteBase}/courses/${slug}`;
  const title = `${categoryData.name} Courses | Eklabya`;
  const description = `Explore ${categoryData.name} courses on Eklabya and upgrade your skills with industry-recognized programs.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function findCategory(
  categories: CategoryData[],
  categoryName: string,
): CategoryData | undefined {
  const name = categoryName.toLowerCase().trim();

  return (
    categories.find((cat) => cat.slug?.toLowerCase() === name) ||
    categories.find(
      (cat) => cat.name?.toLowerCase().replace(/\s+/g, "-") === name,
    ) ||
    categories.find(
      (cat) =>
        cat.name?.trim().toLowerCase() ===
        decodeURIComponent(name.replace(/-/g, " ")).trim().toLowerCase(),
    )
  );
}

export default async function CoursesByCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  const categories = await fetchActiveCategories();

  const categoryData = findCategory(categories, categoryName);

  if (!categoryData) notFound();

  const courses = await fetchCoursesByCategory(categoryData._id);

  const siteBase = getSiteBase() || FALLBACK_SITE_URL;
  const slug = categoryData.slug || categoryName;
  const canonical = `${siteBase}/courses/${slug}`;

  const schema = {
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
        name: "Courses",
        item: `${siteBase}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryData.name,
        item: canonical,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-1/4 lg:w-1/5 md:sticky md:top-32 self-start">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-2 border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Categories
              </h2>
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/courses"
                    className={`block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white`}
                  >
                    All Courses
                  </Link>
                </li>
                {categories
                  .filter((cat) => cat && cat.isActive !== false)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((cat) => {
                    const catSlug =
                      cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
                    const isActive =
                      (categoryData.slug || "").toLowerCase() ===
                      catSlug.toLowerCase();
                    return (
                      <li key={cat._id}>
                        <Link
                          href={`/courses/${catSlug}`}
                          className={`block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-black dark:text-white"
                          }`}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>

          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {categoryData.name} Courses
              </h1>
              <p className="text-black dark:text-white">
                Total Courses: {courses.length}
              </p>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-black dark:text-white text-lg">
                  No courses found in this category.
                </p>
                <Link
                  href="/courses"
                  className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  Browse All Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {courses.map((course) => (
                  <Link
                    key={course._id}
                    href={`/course/${course.slug || course._id}`}
                    className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
                  >
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={getImageUrl(course.thumbnail)}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          No image available
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>

                      <div className="flex items-center text-sm text-black dark:text-gray-300 mb-3">
                        <FaClock className="mr-1 text-gray-600 dark:text-gray-300" />
                        {course.duration || "Self-paced"} Weeks
                      </div>

                      <div className="flex flex-col justify-between">
                        <span className="font-bold text-lg text-black dark:text-white">
                          {formatPrice(course.price)}
                        </span>
                        <span className="w-1/2 self-end px-2 py-1 bg-blue-600 text-white text-sm rounded text-center transition-colors duration-200">
                          Check Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
