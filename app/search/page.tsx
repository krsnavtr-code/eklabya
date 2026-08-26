"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import api from "../utils/api";

interface Course {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  originalPrice?: number;
  duration?: string;
  isFeatured?: boolean;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002";
    return `${baseUrl.replace("/api", "")}${imagePath}`;
  };

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return "Free";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setCourses([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/courses", {
        params: {
          search: query,
          limit: 50,
          isPublished: "true",
          fields:
            "_id,title,slug,description,thumbnail,price,originalPrice,duration",
        },
      });
      const data =
        response?.data?.data ||
        (Array.isArray(response?.data) ? response.data : []);
      setCourses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Search error:", err);
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Search Results
          </h1>
          {query ? (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Showing results for &quot;<strong>{query}</strong>&quot;
            </p>
          ) : (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enter a search term to find courses.
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black dark:text-white text-lg">
              No courses found for &quot;{query}&quot;.
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Browse all courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                  {course.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {course.description
                        .replace(/^<p>/i, "")
                        .replace(/<\/p>$/i, "")}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-black dark:text-gray-300 mb-3">
                    <FaClock className="mr-1 text-gray-600 dark:text-gray-300" />
                    {course.duration || "Self-paced"} Weeks
                  </div>

                  <div className="flex flex-col justify-between">
                    <span className="font-bold text-lg text-black dark:text-white">
                      {formatPrice(course.price)}
                      {course.originalPrice &&
                        course.originalPrice > (course.price || 0) && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(course.originalPrice)}
                          </span>
                        )}
                    </span>
                    <button className="w-1/2 self-end px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200">
                      Check Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
