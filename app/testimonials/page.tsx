"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaStar,
  FaQuoteLeft,
  FaCheckCircle,
  FaSearch,
  FaGraduationCap,
  FaArrowRight,
  FaLaptopCode,
  FaBuilding,
} from "react-icons/fa";
import SEO from "../components/SEO";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  course: string;
  category:
    | "Career Switch"
    | "Upskilling"
    | "College Graduates"
    | "SAP Enterprise"
    | "AI & Data";
  image?: string;
  hike?: string;
  content: string;
  rating: number;
  featured?: boolean;
}

const ALL_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Krishna Avtar",
    role: "MLOps & AI Engineer",
    company: "Cognitive Solutions",
    course: "LLMOps & Machine Learning Operations",
    category: "Career Switch",
    hike: "140% Hike",
    image: "https://www.eklabya.com/api/upload/file/Krishna-4629.png",
    content:
      "Before joining Eklabya, I had very little knowledge of Data Science and Machine Learning pipelines, and was unsure about transitioning into AI. After joining Eklabya Centre of Excellence, I gained deep practical mastery in containerized ML deployments, Docker, and real-world LLM pipelines. The step-by-step mentoring and placement assistance helped me land my dream role as an MLOps Engineer.",
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    name: "Manika Gahloat",
    role: "SAP MM Consultant",
    company: "Accenture Partner Network",
    course: "SAP MM Materials Management",
    category: "SAP Enterprise",
    hike: "95% Hike",
    image: "https://www.eklabya.com/api/upload/file/wo-4953.png",
    content:
      "I enrolled in the SAP MM training program after a friend's recommendation. What I loved most was the live server access, real-time enterprise scenarios, and procurement lifecycle workflows. Whenever I had doubts, the certified trainer was available to guide me. It gave me tremendous confidence during client interviews.",
    rating: 5,
    featured: false,
  },
  {
    id: 3,
    name: "Ankit Kumar",
    role: "Generative AI Developer",
    company: "NextGen Technologies",
    course: "GenAI & Database Management Mastery",
    category: "College Graduates",
    hike: "Campus Placed",
    image: "https://www.eklabya.com/api/upload/file/Adarsh-3832.png",
    content:
      "As a final year student, I needed real project experience to stand out. The Database Management & GenAI course at Eklabya covered both core architectural principles and hands-on vector database projects. The portfolio of assignments I built directly helped me clear technical rounds and receive multiple offers before graduation.",
    rating: 5,
    featured: false,
  },
  {
    id: 4,
    name: "Vinay Kumar",
    role: "SAP PP Functional Consultant",
    company: "Tata Technologies Ecosystem",
    course: "SAP PP Production Planning",
    category: "SAP Enterprise",
    hike: "110% Hike",
    image: "https://www.eklabya.com/api/upload/file/dar-0262.png",
    content:
      "The SAP PP course exceeded my highest expectations. Coming from a non-SAP manufacturing background, I was initially nervous, but the mentor broke down BOM, routing, and MRP execution into intuitive concepts with live sandbox practice. The career guidance was world-class.",
    rating: 5,
    featured: false,
  },
  {
    id: 5,
    name: "Devendra Trivedi",
    role: "Machine Learning Engineer",
    company: "DataInsights AI",
    course: "Data Science, Analytics & Python",
    category: "Career Switch",
    hike: "125% Hike",
    image: "https://www.eklabya.com/api/upload/file/df-3710.png",
    content:
      "I was working in a non-technical support role and desperately wanted to transition into Data Science. The instructors at Eklabya explained statistical modelling and predictive algorithms from the ground up. Building my first end-to-end predictive project gave me the technical edge to switch my career path successfully.",
    rating: 5,
    featured: false,
  },
  {
    id: 6,
    name: "Adarsh Srivastava",
    role: "Database & Backend Engineer",
    company: "Fintech Core Corp",
    course: "MySQL & Database Architecture",
    category: "Upskilling",
    hike: "85% Hike",
    image: "https://www.eklabya.com/api/upload/file/1777960745027-1855.png",
    content:
      "I already had basic SQL understanding, but the MySQL Database Architecture course took me to an advanced level. Query optimization, index tuning, and stored procedures were taught with industrial clarity. Now I handle heavy transaction databases in production with zero hesitation.",
    rating: 5,
    featured: false,
  },
  {
    id: 7,
    name: "Pooja Verma",
    role: "SAP FICO Consultant",
    company: "Deloitte India Ecosystem",
    course: "SAP FICO Financial Accounting",
    category: "SAP Enterprise",
    hike: "115% Hike",
    image: "https://www.eklabya.com/api/upload/file/1777960745027-1855.png",
    content:
      "The SAP FICO training bridged the gap between academic accounting and live enterprise ERP financial management. General Ledger, Accounts Payable, and Asset Accounting were explained with live case studies. Truly invaluable for finance professionals looking to switch to SAP.",
    rating: 5,
    featured: false,
  },
  {
    id: 8,
    name: "Rahul Mehta",
    role: "Full Stack Engineer",
    company: "TechNova Labs",
    course: "Full Stack MERN Architecture",
    category: "Upskilling",
    hike: "105% Hike",
    image: "https://www.eklabya.com/api/upload/file/1777960745003-1010.png",
    content:
      "The MERN Stack course helped me transition from simple frontend UI to architecting robust microservices and real-time WebSocket applications. The code reviews by senior mentors simulated a real software engineering sprint environment.",
    rating: 5,
    featured: false,
  },
  {
    id: 9,
    name: "Neha Gupta",
    role: "Data Scientist",
    company: "Analytics Quotient",
    course: "Machine Learning & AI Certification",
    category: "AI & Data",
    hike: "130% Hike",
    image: "https://www.eklabya.com/api/upload/file/1777960745009-2116.png",
    content:
      "The balance between mathematical intuition and Python code implementation in this course is unmatched. Working on real-world datasets for fraud detection and recommendation engines prepared me thoroughly for senior data science interviews.",
    rating: 5,
    featured: false,
  },
];

const CATEGORIES = [
  "All Stories",
  "Career Switch",
  "Upskilling",
  "SAP Enterprise",
  "AI & Data",
  "College Graduates",
];

export default function TestimonialsPage() {
  const [activeCategory, setActiveCategory] = useState("All Stories");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTestimonials = ALL_TESTIMONIALS.filter((item) => {
    // Category filter
    if (activeCategory !== "All Stories" && item.category !== activeCategory) {
      return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchRole = item.role.toLowerCase().includes(q);
      const matchCourse = item.course.toLowerCase().includes(q);
      const matchCompany = item.company?.toLowerCase().includes(q);
      const matchContent = item.content.toLowerCase().includes(q);
      return (
        matchName || matchRole || matchCourse || matchCompany || matchContent
      );
    }

    return true;
  });

  const featuredTestimonial =
    ALL_TESTIMONIALS.find((t) => t.featured) || ALL_TESTIMONIALS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <SEO
        title="Testimonials | Eklabya - What Our Learners Say"
        description="Read authentic, full-length testimonials from our satisfied learners. Discover how Eklabya has helped students and professionals achieve their learning goals."
        keywords="testimonials, reviews, learner feedback, Eklabya reviews, student testimonials, course reviews"
        robots="index, follow"
        og={{
          title: "Testimonials - What Our Learners Say About Eklabya",
          description:
            "Hear from our community of learners who have transformed their careers with Eklabya's courses.",
          type: "website",
        }}
      />

      {/* --- HERO HEADER --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide">
            <FaStar className="text-amber-400 text-xs" />
            <span>4.9 / 5 Rating from 4,500+ Verified Alumni</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Alumni &amp; Learner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-emerald-300 to-teal-200">
              Success Stories
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xs sm:text-sm md:text-base text-blue-100/90 font-medium leading-relaxed">
            Real stories from real engineers and career-switchers who upskilled,
            mastered enterprise workflows, and unlocked life-changing career
            opportunities with Eklabya.
          </p>

          {/* Key Metrics Counters */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                4.9 ★
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                Average Rating
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">
                98%
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                Placement Record
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-sky-300">
                120%
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                Avg. Salary Hike
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-indigo-300">
                500+
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                Hiring Partners
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-10">
        {/* --- FEATURED ALUMNI SPOTLIGHT BANNER --- */}
        {featuredTestimonial && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="bg-blue-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    Featured Career Transition
                  </span>
                  {featuredTestimonial.hike && (
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      ⚡ {featuredTestimonial.hike}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <FaGraduationCap className="text-blue-500" />
                    {featuredTestimonial.course}
                  </span>
                </div>

                <div className="relative">
                  <FaQuoteLeft className="text-3xl sm:text-4xl text-blue-500/20 absolute -top-4 -left-2 pointer-events-none" />
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic pl-6">
                    &ldquo;{featuredTestimonial.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  {featuredTestimonial.image ? (
                    <img
                      src={featuredTestimonial.image}
                      alt={featuredTestimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                      {featuredTestimonial.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-base">
                      <span>{featuredTestimonial.name}</span>
                      <FaCheckCircle
                        className="text-emerald-500 text-xs"
                        title="Verified Graduate"
                      />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {featuredTestimonial.role}{" "}
                      {featuredTestimonial.company && (
                        <span>• {featuredTestimonial.company}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0 flex flex-col gap-3">
                <Link
                  href="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore This Course</span>
                  <FaArrowRight className="text-xs" />
                </Link>
                <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  100% Practical • Live Projects
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTROLS: CATEGORY TABS & SEARCH BAR --- */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200/80 dark:border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] md:min-w-[320px]">
              <FaSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by student, role, course, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* --- TESTIMONIALS GRID --- */}
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-lg">
              <FaSearch />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching learner reviews found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or select another category
              filter above.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All Stories");
                setSearchQuery("");
              }}
              className="mt-2 inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Row: Stars & Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-amber-400 text-xs sm:text-sm">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.hike && (
                        <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {item.hike}
                        </span>
                      )}
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Course Pill */}
                  <div className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50/80 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200/60 dark:border-blue-900/40">
                    <FaLaptopCode className="shrink-0 text-xs" />
                    <span className="truncate">{item.course}</span>
                  </div>

                  {/* Quote Content */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                {/* Author Metadata */}
                <div className="flex items-center gap-3.5 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                      {item.name.charAt(0)}
                    </div>
                  )}

                  <div className="truncate">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                      <span className="truncate">{item.name}</span>
                      <FaCheckCircle
                        className="text-emerald-500 text-xs shrink-0"
                        title="Verified Graduate"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.role}
                    </p>
                    {item.company && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <FaBuilding className="text-[10px]" /> {item.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- STATS ACCREDITATION BANNER --- */}
        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl overflow-hidden relative">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Accelerate Your Tech Career?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              Join over 40,000+ engineers, students, and professionals who
              transformed their skillsets and landed high-growth engineering
              roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Link
                href="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95"
              >
                <span>Browse All Courses</span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 hover:bg-white/10 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
              >
                <span>Speak to a Career Advisor</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
