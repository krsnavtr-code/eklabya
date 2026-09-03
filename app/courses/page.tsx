"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaClock,
  FaSearch,
  FaGraduationCap,
  FaAward,
  FaStar,
  FaShieldAlt,
  FaBook,
  FaCheckCircle,
  FaGift,
} from "react-icons/fa";
import api from "../utils/api";
import { getImageUrl } from "../utils/imageUtils";
import SEO from "../components/SEO";

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
  isFree?: boolean;
  category?: { _id: string; name: string } | string;
  skills?: string[];
  tags?: string[];
  whatYouWillLearn?: string[];
  benefits?: string[];
  instructor?: string;
  level?: string;
  metaKeywords?: string;
}

const isFreeCourse = (course: Course): boolean => {
  const catName =
    typeof course.category === "object" && course.category !== null
      ? course.category.name || ""
      : typeof course.category === "string"
        ? course.category
        : "";
  return (
    catName.toLowerCase().includes("free") ||
    course.price === 0 ||
    Boolean(course.isFree)
  );
};

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "free" ? "free" : "all";

  const [activeTab, setActiveTab] = useState<"all" | "free">(initialTab);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl === "free" && activeTab !== "free") {
      setActiveTab("free");
    } else if (!tabFromUrl && activeTab !== "all") {
      setActiveTab("all");
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (tab: "all" | "free") => {
    setActiveTab(tab);
    if (tab === "free") {
      router.push("/courses?tab=free", { scroll: false });
    } else {
      router.push("/courses", { scroll: false });
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/courses", {
          params: {
            limit: 500,
            isPublished: "true",
            status: "published",
            sort: "-createdAt",
            fields:
              "_id,title,slug,description,shortDescription,thumbnail,image,price,originalPrice,duration,isFeatured,isFree,category,skills,tags,whatYouWillLearn,benefits,instructor,level,metaKeywords",
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

  const freeCount = useMemo(
    () => courses.filter(isFreeCourse).length,
    [courses],
  );

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return "Free Course";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const filteredCourses = useMemo(() => {
    let list = courses;

    if (activeTab === "free") {
      list = list.filter(isFreeCourse);
    }

    if (!searchQuery.trim()) return list;

    const searchTerms = searchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return list.filter((course) => {
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

      return searchTerms.every((term) => searchableCorpus.includes(term));
    });
  }, [courses, activeTab, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-16 px-4">
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
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <SEO
        title="Eklabya Courses | Learn Skills for Career Growth"
        description="Explore Eklabya courses in Data Science, AI, Digital Marketing and more. Gain practical skills and prepare for better career opportunities today."
        keywords="Eklabya courses, online courses, career courses, professional courses, Data Science course, AI course, Digital Marketing course, skill development, career growth, job ready courses"
      />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* --- HERO HEADER --- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white p-4 sm:p-6 md:p-8 shadow-2xl border border-blue-500/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-2">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide">
              <FaGraduationCap className="text-yellow-400" />
              <span>
                {activeTab === "free"
                  ? "100% Free Learning with Certificate"
                  : "Industry-Aligned Learning Programs"}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-300 to-emerald-300">
                {activeTab === "free"
                  ? "Free Online Certification Courses"
                  : "Professional Certification Courses"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 font-medium leading-relaxed max-w-2xl mx-auto">
              {activeTab === "free"
                ? "Start learning for free today. Gain foundational and job-ready skills with verifiable certificates at zero cost."
                : "Upgrade your career with live mentorship, real-world capstone projects, and industry-certified courses in Data Science, Cloud, SAP & Full Stack."}
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
                <FaShieldAlt className="text-sky-400 text-[10px]" /> Lifetime
                Access
              </span>
            </div>

            {/* Integrated Course Search Bar */}
            <div className="pt-3 max-w-xl mx-auto">
              <div className="relative">
                <FaSearch className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "free"
                      ? "Search free courses by title, topic, or technology..."
                      : "Search by course title, skill, category, topic (e.g. Python, SAP, AI)..."
                  }
                  className="w-full pl-11 pr-4 py-3 bg-white/95 dark:bg-gray-900/95 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl text-xs sm:text-sm border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- TAB SWITCHER: ALL COURSES VS FREE COURSES --- */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/60 shadow-lg shadow-slate-200/40 dark:shadow-black/30 gap-2">
            <button
              onClick={() => handleTabChange("all")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-gray-800/60"
              }`}
            >
              <FaGraduationCap className="text-sm" />
              <span>All Courses</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === "all"
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/70 dark:bg-gray-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {courses.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("free")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "free"
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-gray-800/60"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <FaGift className="text-sm" />
              <span>Free Courses</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === "free"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                {freeCount}
              </span>
            </button>
          </div>
        </div>

        {/* --- FREE PROMO BANNER (When Free tab is selected) --- */}
        {activeTab === "free" && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shrink-0">
                🎁
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">
                  100% Free Learning Opportunities
                </h3>
                <p className="text-xs text-emerald-100">
                  Get Free Course with any paid course. Enjoy unlimited access
                  to free modules, projects, and verifiable credentials.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl">
              <FaCheckCircle className="text-emerald-300" /> No Credit Card
              Required
            </div>
          </div>
        )}

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
                {activeTab === "free" ? "Free Courses" : "Available Courses"}
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
          <div className="text-center py-16 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3 shadow-md">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-lg">
              <FaSearch />
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              No courses matching your search
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any {activeTab === "free" ? "free" : ""}{" "}
              courses matching &ldquo;{searchQuery}
              &rdquo;. Try another keyword or clear the search filter.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 inline-block px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              View All {activeTab === "free" ? "Free Courses" : "Courses"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isFree = isFreeCourse(course);
              return (
                <Link
                  key={course._id}
                  href={`/course/${course.slug || course._id}`}
                  className="group relative block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative">
                      {course.thumbnail || course.image ? (
                        <img
                          src={getImageUrl(course.thumbnail || course.image)}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <FaBook className="text-4xl opacity-50" />
                        </div>
                      )}

                      {/* FREE Badge */}
                      {isFree && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg z-10">
                          FREE
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>

                      {course.shortDescription || course.description ? (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                          {(course.shortDescription || course.description || "")
                            .replace(/<[^>]*>/g, "")
                            .trim()}
                        </p>
                      ) : null}

                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <FaClock className="mr-1.5 text-blue-500" />
                        {course.duration || "Self-paced"} Weeks
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-700/60 mt-auto flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        {formatPrice(course.price)}
                      </span>
                      {/* {course.originalPrice &&
                        course.originalPrice > (course.price || 0) && (
                          <span className="ml-2 text-xs text-slate-400 line-through">
                            {formatPrice(course.originalPrice)}
                          </span>
                        )} */}
                    </div>
                    <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors duration-200 shadow-sm">
                      Check Details
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-16 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
