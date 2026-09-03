"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaBook,
  FaUsers,
  FaGraduationCap,
  FaBriefcase,
  FaCommentAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  {
    id: 1,
    name: "Professional Courses",
    value: "22+",
    icon: FaBook,
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 2,
    name: "Expert Tutors",
    value: "25+",
    icon: FaUsers,
    color: "from-purple-400 to-indigo-500",
  },
  {
    id: 3,
    name: "Happy Learners",
    value: "690+",
    icon: FaGraduationCap,
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: 4,
    name: "Job Placement Support Rate",
    value: "98%",
    icon: FaBriefcase,
    color: "from-amber-400 to-orange-500",
  },
];

const techCompanies = [
  {
    name: "TCS",
    logo: "/images/Company%20logos/Tata_Consultancy_Services_old_logo.svg",
  },
  { name: "Infosys", logo: "/images/Company%20logos/Infosys_logo.svg" },
  {
    name: "Wipro",
    logo: "/images/Company%20logos/Wipro_Primary_Logo_Color_RGB.svg",
  },
  { name: "HCL", logo: "/images/Company%20logos/hcltech-1.svg" },
  {
    name: "Mahindra & Mahindra",
    logo: "/images/Company%20logos/mahindra-mahindra-logo.svg",
  },
  { name: "Microsoft", logo: "/images/Company%20logos/Microsoft_logo.svg" },
  { name: "Amazon", logo: "/images/Company%20logos/amazon-icon.svg" },
  { name: "Google", logo: "/images/Company%20logos/Google_2015_logo.svg" },
  {
    name: "Google Cloud",
    logo: "/images/Company%20logos/google_cloud-icon.svg",
  },
  { name: "Meta", logo: "/images/Company%20logos/Meta_Platforms_logo.svg" },
  { name: "Netflix", logo: "/images/Company%20logos/Netflix_icon.svg" },
  { name: "Flipkart", logo: "/images/Company%20logos/flipkart-icon.svg" },
  { name: "Zomato", logo: "/images/Company%20logos/Zomato_Logo.svg" },
];

const Stats = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth,
    );
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize, { passive: true });
    const interval = setInterval(checkScroll, 300);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // --- REVISED AUTO-SCROLL LOGIC ---
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number;
    let direction = 1; // 1 = moving right (revealing left), -1 = moving left
    let exactScroll = el.scrollLeft; // Keeps track of fractional pixels
    let lastTime = performance.now();
    const speed = 40; // Pixels per second (adjust to make it faster/slower)
    let isHovered = false;

    // Pause animation when user hovers over the logos
    const handleMouseEnter = () => (isHovered = true);
    const handleMouseLeave = () => {
      isHovered = false;
      lastTime = performance.now(); // Reset time to prevent sudden jump
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("touchstart", handleMouseEnter, { passive: true });
    el.addEventListener("touchend", handleMouseLeave, { passive: true });

    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const maxScroll = el.scrollWidth - el.clientWidth;

      // Only scroll if there is overflow and user is not hovering
      if (maxScroll > 0 && !isHovered) {
        exactScroll += speed * delta * direction;

        // Ping-Pong Logic (Reverse direction when hitting edges)
        if (exactScroll >= maxScroll) {
          exactScroll = maxScroll;
          direction = -1; // Go left
        } else if (exactScroll <= 0) {
          exactScroll = 0;
          direction = 1; // Go right
        }

        el.scrollLeft = exactScroll;

        // Allow manual overriding: If user clicked buttons or scrolled manually,
        // sync our exactScroll variable with the actual scrollLeft.
        if (Math.abs(el.scrollLeft - exactScroll) > 1.5) {
          exactScroll = el.scrollLeft;
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("touchstart", handleMouseEnter);
      el.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 py-4">
      <div className="relative max-w-7xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-5 sm:p-7 md:p-8 space-y-8 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-3xl" />
        </div>

        <div>
          {/* --- PART 1: Our Impact Numbers --- */}
          <div className="text-center mb-6 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50/80 dark:bg-indigo-950/60 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-800/80 px-3.5 py-1 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
              Our Impact
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Numbers That Actually Mean Something
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="relative group p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}
                >
                  <stat.icon className="h-7 w-7" aria-hidden="true" />
                </div>

                <div className="mt-2 text-center">
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="mt-1.5 text-xs font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                    {stat.name}
                  </p>
                </div>

                <div
                  className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${stat.color} transition-all duration-500 group-hover:w-full rounded-b-2xl`}
                />
              </motion.div>
            ))}
          </div>

          {/* --- PART 2: SECTION: Placements --- */}
          <div className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 md:p-6 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Placement Intro */}
            <div className="text-center max-w-5xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-100 dark:border-blue-900">
                Placements
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Our Placements Speak Louder Than Our Marketing
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                We don't just teach code, frameworks, or theory, we build
                professional futures. Join{" "}
                <strong className="text-blue-600 dark:text-blue-400">
                  480+ alumni
                </strong>{" "}
                now working across some of the world's most recognized
                technology companies.
              </p>
            </div>

            {/* Trusted Tech Leaders Badges */}
            <div className="space-y-2 pt-2">
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                Trusted by Global Tech Leaders
              </p>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Previous"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow backdrop-blur flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-0 transition-opacity"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>

                {/* Scroll Container */}
                <div
                  ref={scrollRef}
                  className="flex items-center gap-3 md:gap-4 overflow-x-hidden scroll-smooth px-10 py-2"
                >
                  {techCompanies.map((company, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 px-5 py-2 rounded-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-gray-700 flex items-center justify-center shadow-2xs hover:border-blue-500 transition-colors h-14"
                    >
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-8 w-auto max-w-[130px] object-contain dark:invert"
                        />
                      ) : (
                        <span className="text-sm md:text-base font-extrabold text-slate-700 dark:text-slate-300 tracking-wider">
                          {company.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Next"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow backdrop-blur flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-0 transition-opacity"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Alumni Stories Teaser Bar */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mx-auto sm:mx-0 shadow-md">
                  <FaCommentAlt className="text-sm" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Alumni Stories
                  </h4>
                  <p className="text-xs text-slate-800 dark:text-gray-400">
                    Hear real success stories from our graduates working
                    globally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
