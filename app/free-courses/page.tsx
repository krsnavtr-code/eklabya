"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaStar, FaClock, FaBook } from "react-icons/fa";
import SEO from "../components/SEO";
import api from "../utils/api";

interface Course {
  _id: string;
  slug?: string;
  title: string;
  shortDescription?: string;
  thumbnail?: string;
  instructor?: string;
  rating?: number;
  duration?: string;
  price?: number;
  isFree?: boolean;
  category?: { name?: string };
}

export default function FreeCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        setLoading(true);

        const response = await api.get("/courses", {
          params: { isPublished: "true", limit: 500 },
        });

        const coursesData: Course[] = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const matchesFree = (course: Course) =>
          course.category?.name?.toLowerCase().includes("free") ||
          course.price === 0 ||
          course.isFree;

        const freeCourses = coursesData.filter(matchesFree);

        const sortedCourses = [...freeCourses].sort((a, b) =>
          a.title.localeCompare(b.title),
        );

        setCourses(sortedCourses);
        setFilteredCourses(sortedCourses);
      } catch (error) {
        console.error("Error fetching free courses:", error);
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeCourses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const term = searchQuery.toLowerCase();
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          (course.instructor &&
            course.instructor.toLowerCase().includes(term)) ||
          (course.category?.name &&
            course.category.name.toLowerCase().includes(term)),
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEO
        title="Free Online Courses with Certificate | Eklabya Centre of Excellence"
        description="Join Eklabya free online courses with certificate. Upgrade your skills with expert-led training in business, tech, and career development. Start learning today!"
        keywords="free courses, online learning, free online courses, learn new skills, free education, online courses, free certification, skill development, Eklabya, Eklabya centre of excellence"
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-white py-6 md:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.2),transparent_40%)]" />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur text-sm font-semibold mb-2 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              100% Free Learning
            </span>
            <h1 className="text-xl md:text-4xl font-extrabold mb-2 tracking-tight">
              Get Free Course with an any paid course
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-5xl mx-auto mb-4">
              Master new skills with expert-led courses at zero cost. Learn at
              your own pace, anytime, anywhere.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search free courses..."
                className="w-full pl-14 pr-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold">{filteredCourses.length}</p>
                <p className="text-xs uppercase tracking-wider text-white/70">
                  Free Courses
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">Lifetime</p>
                <p className="text-xs uppercase tracking-wider text-white/70">
                  Access
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">Free</p>
                <p className="text-xs uppercase tracking-wider text-white/70">
                  Certificate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="max-w-7xl mx-auto px-4 py-14">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {filteredCourses.map((course) => (
                <Link
                  key={course._id}
                  href={`/course/${course.slug || course._id}`}
                  className="group relative block bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="h-48 overflow-hidden relative">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 text-gray-400 dark:text-gray-300">
                        <FaBook className="text-5xl" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      FREE
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-5">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                      {course.category?.name || "General"}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {course.shortDescription || "No description available"}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-5">
                      <span className="flex items-center gap-1.5">
                        <FaStar className="text-yellow-400" />
                        {course.rating?.toFixed(1) || "New"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaClock />
                        {course.duration || "Self-paced"}
                      </span>
                    </div>

                    <div className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold group-hover:from-blue-700 group-hover:to-indigo-700 transition-all shadow-md">
                      Start Learning
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-5">
                <FaBook size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No free courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {searchQuery
                  ? "Try adjusting your search to find what you're looking for."
                  : "Check back later for new free courses!"}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
