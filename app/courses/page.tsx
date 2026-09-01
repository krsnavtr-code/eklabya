"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaClock,
  FaSearch,
  FaGraduationCap,
  FaAward,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";
import api from "../utils/api";
import { getImageUrl } from "../utils/imageUtils";

interface Course {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  image?: string;
  price?: number;
  originalPrice?: number;
  duration?: string;
  isFeatured?: boolean;
  category?: { _id: string; name: string } | string;
  skills?: string[];
  tags?: string[];
  whatYouWillLearn?: string[];
  benefits?: string[];
  instructor?: string;
  level?: string;
  metaKeywords?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/courses", {
          params: {
            limit: 100,
            isPublished: "true",
            status: "published",
            sort: "-createdAt",
            fields:
              "_id,title,slug,description,shortDescription,thumbnail,price,originalPrice,duration,isFeatured,category,skills,tags,whatYouWillLearn,benefits,instructor,level,metaKeywords",
          },
        });

        let coursesData: Course[] = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          coursesData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          coursesData = response.data;
        } else if (Array.isArray(response)) {
          coursesData = response as Course[];
        }

        setCourses(coursesData);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return "Free";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;

    // Split search query into individual search tokens
    const searchTerms = searchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    // Extract category name
    const categoryName =
      typeof course.category === "object" && course.category !== null
        ? course.category.name || ""
        : typeof course.category === "string"
          ? course.category
          : "";

    const skillsText = Array.isArray(course.skills)
      ? course.skills.join(" ")
      : "";
    const tagsText = Array.isArray(course.tags) ? course.tags.join(" ") : "";
    const learnText = Array.isArray(course.whatYouWillLearn)
      ? course.whatYouWillLearn.join(" ")
      : "";
    const benefitsText = Array.isArray(course.benefits)
      ? course.benefits.join(" ")
      : "";

    const cleanDescription = (course.description || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ");

    const searchableCorpus = [
      course.title || "",
      course.slug || "",
      cleanDescription,
      course.shortDescription || "",
      categoryName,
      skillsText,
      tagsText,
      learnText,
      benefitsText,
      course.instructor || "",
      course.level || "",
      course.metaKeywords || "",
    ]
      .join(" ")
      .toLowerCase();

    // Check if EVERY search term is present anywhere in the course's content
    return searchTerms.every((term) => searchableCorpus.includes(term));
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* --- HERO HEADER --- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white p-3 sm:p-4 md:p-4 shadow-2xl border border-blue-500/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-1.5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide">
              <FaGraduationCap className="text-yellow-400" />
              <span>Industry-Aligned Learning Programs</span>
            </div>

            {/* Main Title */}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-300 to-emerald-300">
                Professional Certification Courses
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 font-medium leading-relaxed max-w-2xl mx-auto">
              Upgrade your career with live mentorship, real-world capstone
              projects, and industry-certified courses in Data Science, Cloud,
              SAP &amp; Full Stack.
            </p>

            {/* Value Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] sm:text-xs text-blue-100 font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <FaStar className="text-amber-400 text-[10px]" /> 4.9/5 Student
                Rating
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <FaAward className="text-emerald-400 text-[10px]" /> Recognized
                Certification
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <FaShieldAlt className="text-sky-400 text-[10px]" /> 100%
                Placement Support
              </span>
            </div>

            {/* Integrated Course Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative">
                <FaSearch className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course title, skill, category, topic, or technology (e.g. Python, SAP, DevOps, AI)..."
                  className="w-full pl-11 pr-4 py-3 bg-white/95 dark:bg-gray-900/95 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl text-xs sm:text-sm border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- COURSE COUNT & STATUS --- */}
        <div className="flex justify-between items-center px-1">
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {searchQuery.trim() ? (
              <>
                Found{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {filteredCourses.length}
                </span>{" "}
                results for &ldquo;{searchQuery}&rdquo;
              </>
            ) : (
              <>
                Showing{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {filteredCourses.length}
                </span>{" "}
                Available Courses
              </>
            )}
          </p>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-lg">
              <FaSearch />
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              No courses matching your search
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any courses matching &ldquo;{searchQuery}
              &rdquo;. Try another keyword or clear the search filter.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 inline-block px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              View All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course._id}
                href={`/course/${course.slug || course._id}`}
                className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
              >
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {course.thumbnail || course.image ? (
                    <img
                      src={getImageUrl(course.thumbnail || course.image)}
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
