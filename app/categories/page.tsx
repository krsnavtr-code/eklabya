"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaImage,
  FaArrowRight,
  FaSearch,
  FaThLarge,
  FaLayerGroup,
  FaRocket,
  FaCompass,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../utils/api";
import { getImageUrl } from "../utils/imageUtils";
import SEO from "../components/SEO";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  courseCount?: number;
  isActive?: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesWithCount = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/categories", {
          params: { limit: 100, status: "active" },
        });

        let categoriesData: Category[] = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          categoriesData = response as Category[];
        }

        const validCategories = categoriesData
          .filter((cat) => cat && cat._id && cat.name && cat.isActive !== false)
          .map((category) => ({
            ...category,
            courseCount: category.courseCount || 0,
          }));

        setCategories(validCategories);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithCount();
  }, []);

  const renderCategoryImage = (category: Category) => {
    const imageUrl = category.image ? getImageUrl(category.image) : null;

    return (
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-gray-700/80 flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform duration-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        {!imageUrl && (
          <FaLayerGroup className="text-indigo-500 dark:text-indigo-400 text-2xl" />
        )}
      </div>
    );
  };

  const filteredCategories = categories.filter((category) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchName = category.name.toLowerCase().includes(q);
    const matchDesc = category.description?.toLowerCase().includes(q);
    const matchSlug = category.slug?.toLowerCase().includes(q);
    return matchName || matchDesc || matchSlug;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <SEO
        title="Explore Course Categories | Online Learning | Eklabya"
        description="Explore Eklabya course categories and find online courses to build in-demand skills, advance your career, and achieve your learning goals."
        keywords="Eklabya courses, online courses, course categories, skill development courses, professional courses, career courses, online learning, career skills"
      />
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* --- DISTINCT CATEGORIES HERO HEADER --- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-indigo-500/20">
          {/* Subtle decorative mesh elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-10">
            {/* Left Content */}
            <div className="space-y-3.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-semibold tracking-wide">
                <FaCompass className="text-amber-400 text-xs" />
                <span>Domain Learning Tracks</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                Explore Courses by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">
                  Specialized Domains
                </span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                Choose your field of expertise. From enterprise SAP and Data
                Science to Full Stack &amp; Cloud engineering, select your
                learning track to master in-demand industry skills.
              </p>

              {/* Quick Tags / Domain Highlights */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] sm:text-xs text-slate-200 font-semibold">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  <FaCheckCircle className="text-emerald-400 text-[10px]" />{" "}
                  {categories.length} Specialized Tracks
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  <FaRocket className="text-sky-400 text-[10px]" /> Hands-on
                  Projects
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  <FaThLarge className="text-amber-400 text-[10px]" /> Industry
                  Accredited
                </span>
              </div>
            </div>

            {/* Right Interactive Search & Shortcuts */}
            <div className="w-full lg:w-96 shrink-0 bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-5 rounded-2xl space-y-3">
              <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider">
                Find Your Track
              </label>

              <div className="relative">
                <FaSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories (e.g. SAP, Python, Data)..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white/95 dark:bg-gray-900/95 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-xs sm:text-sm border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                />
              </div>

              {/* Popular Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">
                  Popular:
                </span>
                {["SAP", "Data Science", "Java", "Python"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-100 transition-colors border border-white/10"
                  >
                    {tag}
                  </button>
                ))}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[11px] font-bold text-amber-300 hover:underline ml-auto"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- CATEGORIES RESULT STATUS --- */}
        <div className="flex justify-between items-center px-1">
          {/* <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {searchQuery.trim() ? (
              <>
                Found{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {filteredCategories.length}
                </span>{" "}
                categories for &ldquo;{searchQuery}&rdquo;
              </>
            ) : (
              <>
                Showing{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {filteredCategories.length}
                </span>{" "}
                Learning Domains
              </>
            )}
          </p> */}

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* --- GRID OF CATEGORIES --- */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-6 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-lg">
              <FaSearch />
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              No categories match &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try searching with another keyword or explore all our available
              domains.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 inline-block px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              View All Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category._id}
                href={`/courses/${
                  category.slug ||
                  category.name.toLowerCase().replace(/\s+/g, "-")
                }`}
                className="group block bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500"
              >
                <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {renderCategoryImage(category)}
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <FaArrowRight className="text-xs" />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-1">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="mt-2 text-xs text-slate-800 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {category.courseCount || 0} Available Courses
                    </span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform duration-300">
                      &rarr;
                    </span>
                  </div> */}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
