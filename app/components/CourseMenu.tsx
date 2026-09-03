"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FaChevronRight,
  FaBook,
  FaGraduationCap,
  FaLaptopCode,
  FaChartLine,
  FaArrowRight,
  FaLayerGroup,
} from "react-icons/fa";
import api from "../utils/api";
import { getImageUrl } from "../utils/imageUtils";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  courses?: number;
  image?: string;
}

interface Course {
  _id: string;
  title: string;
  slug?: string;
  thumbnail?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  image?: string;
  rating?: number;
}

interface CourseMenuProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

// Helper to assign icons based on category name
const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("erp") || lowerName.includes("sap"))
    return <FaLayerGroup className="w-4 h-4" />;
  if (lowerName.includes("data") || lowerName.includes("ml"))
    return <FaChartLine className="w-4 h-4" />;
  if (lowerName.includes("language") || lowerName.includes("code"))
    return <FaLaptopCode className="w-4 h-4" />;
  return <FaGraduationCap className="w-4 h-4" />;
};

const CourseMenu = ({
  isMobile = false,
  onItemClick = () => {},
}: CourseMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [categoryCourses, setCategoryCourses] = useState<
    Record<string, Course[]>
  >({});
  const [isLoadingCourses, setIsLoadingCourses] = useState<
    Record<string, boolean>
  >({});

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/categories", {
          params: {
            limit: 12,
            fields: "_id,name,slug,courseCount,isActive,image",
            sort: "name",
          },
        });

        let categoriesData: Category[] =
          response?.data?.data || response?.data || response || [];

        const processedCategories = categoriesData
          .filter((cat) => cat && cat._id && cat.name)
          .map((category) => ({
            _id: category._id,
            name: category.name,
            slug: category.slug || category._id,
            courses: category.courses,
            image: category.image,
          }));

        setCategories(processedCategories);
        if (processedCategories.length > 0 && !isMobile) {
          setActiveCategory(processedCategories[0]);
          fetchCategoryCourses(processedCategories[0]._id);
        }
      } catch (err: any) {
        setError("Failed to load categories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [isMobile]);

  const fetchCategoryCourses = useCallback(
    async (categoryId: string) => {
      if (!categoryId || categoryCourses[categoryId]) return;

      try {
        setIsLoadingCourses((prev) => ({ ...prev, [categoryId]: true }));
        const response = await api.get("/courses", {
          params: {
            limit: 6,
            fields: "_id,title,slug,price,discountPrice,image,thumbnail,rating",
            status: "published",
            category: categoryId,
          },
        });

        let courses: Course[] =
          response?.data?.data || response?.data || response || [];
        setCategoryCourses((prev) => ({ ...prev, [categoryId]: courses }));
      } catch (err: any) {
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoadingCourses((prev) => ({ ...prev, [categoryId]: false }));
      }
    },
    [categoryCourses],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryHover = (category: Category) => {
    if (!isMobile) {
      setActiveCategory(category);
      fetchCategoryCourses(category._id);
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (isMobile) {
      const newActive = activeCategory?._id === category._id ? null : category;
      setActiveCategory(newActive);
      if (newActive) fetchCategoryCourses(category._id);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    onItemClick();
  };

  return (
    <div className={`relative ${isMobile ? "w-full" : ""}`} ref={menuRef}>
      {/* Trigger Button */}
      <div className="flex items-center gap-1.5">
        {!isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-0.5 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-600/20"
          >
            <FaBook className="w-3.5 h-3.5" />
            <span>Top Programme</span>
            <FaChevronRight
              className={`w-2.5 h-2.5 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
            />
          </button>
        )}

        <div className="hidden md:block h-6 w-[2px] w-px bg-black dark:bg-white mx-1"></div>
      </div>

      {/* Dropdown Container */}
      <div
        className={`${isOpen || isMobile ? "block" : "hidden"} ${
          isMobile
            ? "w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-300 dark:border-slate-700"
            : "absolute left-0 mt-1 w-[750px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-300 dark:border-slate-700/50 z-50 overflow-hidden flex"
        }`}
      >
        {/* ================= LEFT PANEL: CATEGORIES ================= */}
        <div
          className={`${isMobile ? "w-full" : "w-[280px] bg-slate-50/50 dark:bg-slate-900/30 border-r border-slate-300 dark:border-slate-700/50 p-1 max-h-[420px] overflow-y-auto"} flex flex-col`}
        >
          {isMobile && (
            <div className="px-1.5 py-1 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white flex justify-between items-center">
                Explore Top Programme
              </h3>
            </div>
          )}

          {isLoading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div
              className={`flex flex-col ${isMobile ? "divide-y divide-slate-100 dark:divide-slate-700" : "gap-1"}`}
            >
              {categories.map((category) => (
                <div key={category._id} className="relative group">
                  <div
                    onMouseEnter={() => handleCategoryHover(category)}
                    onClick={() => handleCategoryClick(category)}
                    className={`cursor-pointer flex items-center justify-between rounded-lg transition-all duration-200 ${
                      isMobile
                        ? "px-1.5 py-1 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        : `px-1.5 py-0.5 ${activeCategory?._id === category._id ? "bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold" : "text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 font-medium"}`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 ${activeCategory?._id === category._id && !isMobile ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                      >
                        {category.image ? (
                          <img
                            src={getImageUrl(category.image)}
                            alt={category.name}
                            className="w-full h-full object-contain p-0.5"
                            onError={(e) => {
                              const img = e.currentTarget;
                              img.onerror = null;
                              img.style.display = "none";
                              const fallback =
                                img.parentElement?.querySelector(
                                  ".fallback-cat-icon",
                                );
                              if (fallback) fallback.classList.remove("hidden");
                            }}
                          />
                        ) : null}
                        <div
                          className={`fallback-cat-icon flex items-center justify-center ${
                            category.image ? "hidden" : ""
                          }`}
                        >
                          {getCategoryIcon(category.name)}
                        </div>
                      </div>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    {(!isMobile || activeCategory?._id === category._id) && (
                      <FaChevronRight
                        className={`w-3 h-3 transition-transform ${isMobile && activeCategory?._id === category._id ? "rotate-90 text-blue-600" : "text-slate-400"}`}
                      />
                    )}
                  </div>

                  {/* Mobile Courses Dropdown */}
                  {isMobile && activeCategory?._id === category._id && (
                    <div className="bg-slate-50 dark:bg-slate-900/30 px-1 py-0.5 border-t border-slate-200 dark:border-slate-700">
                      {isLoadingCourses[category._id] ? (
                        <div className="text-xs text-slate-500 py-2">
                          Loading courses...
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {categoryCourses[category._id]
                            ?.slice(0, 5)
                            .map((course) => (
                              <Link
                                key={course._id}
                                href={`/course/${course.slug || course._id}`}
                                onClick={closeMenu}
                                className="text-sm text-slate-800 hover:text-blue-600 py-0.5 flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-slate-300 before:rounded-full"
                              >
                                {course.title}
                              </Link>
                            ))}
                          <Link
                            href={`/courses/${category.slug}`}
                            onClick={closeMenu}
                            className="text-xs font-bold border-b border-gray-500 pb-1 text-blue-600 pl-3 flex items-center gap-1"
                          >
                            View All {category.name}{" "}
                            <FaArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT PANEL: COURSES (Desktop Only) ================= */}
        {!isMobile && activeCategory && (
          <div className="flex-1 px-3 py-1 flex flex-col bg-white dark:bg-slate-800 max-h-[420px]">
            <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeCategory.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Explore top-rated courses in this category
                </p>
              </div>
              <Link
                href={`/courses/${activeCategory.slug}`}
                onClick={closeMenu}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors group"
              >
                View All{" "}
                <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoadingCourses[activeCategory._id] ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : categoryCourses[activeCategory._id]?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-0.5">
                    {categoryCourses[activeCategory._id].map((course) => (
                      <Link
                        key={course._id}
                        href={`/course/${course.slug || course._id}`}
                        onClick={closeMenu}
                        className="group flex gap-1.5 py-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                      >
                        <div className="w-18 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden relative">
                          {course.image || course.thumbnail ? (
                            <img
                              src={getImageUrl(
                                course.image || course.thumbnail,
                              )}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.onerror = null;
                                img.style.display = "none";
                                const fallback =
                                  img.parentElement?.querySelector(
                                    ".fallback-icon",
                                  );
                                if (fallback)
                                  fallback.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <div
                            className={`fallback-icon w-full h-full flex items-center justify-center text-slate-400 ${
                              course.image || course.thumbnail ? "hidden" : ""
                            }`}
                          >
                            <FaBook />
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
                            {course.title}
                          </h4>
                          {course.price && (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                              {course.discountPrice
                                ? `₹${course.discountPrice}`
                                : `₹${course.price}`}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 relative overflow-hidden rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 group/promo">
                    {/* Decorative Glowing Blobs for Glass Effect */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-xl group-hover/promo:scale-150 transition-transform duration-700 pointer-events-none"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full blur-xl group-hover/promo:scale-150 transition-transform duration-700 pointer-events-none"></div>

                    {/* Highly Attractive Content */}
                    <div className="relative z-10 mb-4">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5 tracking-tight">
                        <span className="text-lg">🎯</span> Find Your Dream Role
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-2">
                        Confused about where to start? Explore our expertly
                        curated categories and pick the exact skills top MNCs
                        are hiring for.
                      </p>
                    </div>

                    {/* Sleek Glassy Button */}
                    <Link
                      href="/categories"
                      onClick={closeMenu}
                      className="relative z-10 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-700/60 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-slate-800 dark:text-white hover:text-white text-sm font-bold backdrop-blur-md border border-white/80 dark:border-slate-600/50 hover:border-transparent hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 group"
                    >
                      <FaLayerGroup className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                      <span>Explore All Categories</span>
                      <FaArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <FaLayerGroup className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm">
                    No courses found in this category yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMenu;
