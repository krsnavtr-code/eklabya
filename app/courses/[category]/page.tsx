"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaClock } from "react-icons/fa";
import api from "../../utils/api";

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

interface Category {
  _id: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}

export default function CoursesByCategoryPage() {
  const params = useParams();
  const categoryName =
    typeof params?.category === "string" ? params.category : "";

  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesResponse = await api.get("/categories", {
          params: { limit: 100, status: "active" },
        });

        let categoriesData: Category[] = [];
        if (
          categoriesResponse?.data?.data &&
          Array.isArray(categoriesResponse.data.data)
        ) {
          categoriesData = categoriesResponse.data.data;
        } else if (
          categoriesResponse?.data &&
          Array.isArray(categoriesResponse.data)
        ) {
          categoriesData = categoriesResponse.data;
        } else if (Array.isArray(categoriesResponse)) {
          categoriesData = categoriesResponse as Category[];
        }

        const activeCategories = categoriesData.filter(
          (cat) => cat && cat.isActive !== false,
        );
        setAllCategories(activeCategories);

        if (categoryName) {
          let categoryData = activeCategories.find(
            (cat) => cat?.slug?.toLowerCase() === categoryName.toLowerCase(),
          );

          if (!categoryData) {
            categoryData = activeCategories.find(
              (cat) =>
                cat?.name?.toLowerCase().replace(/\s+/g, "-") ===
                categoryName.toLowerCase(),
            );
          }

          if (!categoryData) {
            const decodedCategoryName = decodeURIComponent(
              categoryName.replace(/-/g, " "),
            );
            categoryData = activeCategories.find(
              (cat) =>
                cat?.name?.trim().toLowerCase() ===
                decodedCategoryName.trim().toLowerCase(),
            );
          }

          if (categoryData) {
            setCategory(categoryData);
            const coursesResponse = await api.get("/courses", {
              params: {
                category: categoryData._id,
                limit: 100,
                isPublished: "true",
                status: "published",
              },
            });

            let coursesData: Course[] = [];
            if (
              coursesResponse?.data?.data &&
              Array.isArray(coursesResponse.data.data)
            ) {
              coursesData = coursesResponse.data.data;
            } else if (
              coursesResponse?.data &&
              Array.isArray(coursesResponse.data)
            ) {
              coursesData = coursesResponse.data;
            } else if (Array.isArray(coursesResponse)) {
              coursesData = coursesResponse as Course[];
            }

            setCourses(coursesData);
            return;
          }
        }

        const allCoursesResponse = await api.get("/courses", {
          params: {
            limit: 100,
            isPublished: "true",
            status: "published",
          },
        });

        let allCourses: Course[] = [];
        if (
          allCoursesResponse?.data?.data &&
          Array.isArray(allCoursesResponse.data.data)
        ) {
          allCourses = allCoursesResponse.data.data;
        } else if (
          allCoursesResponse?.data &&
          Array.isArray(allCoursesResponse.data)
        ) {
          allCourses = allCoursesResponse.data;
        } else if (Array.isArray(allCoursesResponse)) {
          allCourses = allCoursesResponse as Course[];
        }

        setCourses(allCourses);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {/* <nav className="mb-6 text-sm max-w-7xl mx-auto" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-500 dark:text-gray-400">/</li>
            <li>
              <Link
                href="/courses"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Courses
              </Link>
            </li>
            {category && (
              <>
                <li className="text-gray-500 dark:text-gray-400">/</li>
                <li
                  className="text-blue-600 dark:text-blue-400 font-medium"
                  aria-current="page"
                >
                  {category.name}
                </li>
              </>
            )}
          </ol>
        </nav> */}

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
                    className={`block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      !categoryName
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-black dark:text-white"
                    }`}
                  >
                    All Courses
                  </Link>
                </li>
                {allCategories
                  .filter((cat) => cat && cat.isActive !== false)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((cat) => (
                    <li key={cat._id}>
                      <Link
                        href={`/courses/${
                          cat.slug ||
                          cat.name.toLowerCase().replace(/\s+/g, "-")
                        }`}
                        className={`block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          category?._id === cat._id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-black dark:text-white"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {category ? `${category.name} Courses` : "All Courses"}
              </h1>
              <p className="text-black dark:text-white">
                Total Courses: {courses.length}
              </p>
            </div>

            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-300 text-lg">
                  {error}
                </p>
              </div>
            ) : courses.length === 0 ? (
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
      </div>
    </div>
  );
}
