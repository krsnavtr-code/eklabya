"use client";

import React from "react";
import Link from "next/link";
import { FaGraduationCap, FaArrowRight } from "react-icons/fa";

const Content = () => {
  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 py-4">
      <div className="relative max-w-7xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-5 sm:p-7 md:p-8 space-y-6 overflow-hidden">
        {/* --- Header & Brand Story --- */}
        <div className="text-center max-w-5xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-50/80 dark:bg-blue-950/60 backdrop-blur-md border border-blue-200/80 dark:border-blue-800/80 px-3 py-1 rounded-full text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <FaGraduationCap className="text-xs" /> About Eklabya
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Eklabya Centre of Excellence – Your Online Learning Partner
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-400 leading-relaxed font-normal">
            Eklabya is an ISO-certified, NSDC and NIELIT-recognized online
            learning platform built to make career-ready education accessible,
            regardless of your city, schedule, or background. We started with a
            simple belief: high-quality, job-relevant education shouldn't
            require relocating, quitting your job, or paying a fortune. Every
            program is designed around one question:{" "}
            <em>does this skill actually get someone hired?</em>
          </p>
        </div>

        {/* --- Why Choose Eklabya (Compact 4-grid) --- */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            Why Choose Eklabya?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-1.5">
              <div className="text-blue-600 text-base">💻</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Online, Your Rules
              </h4>
              <p className="text-[11px] text-slate-800 dark:text-slate-400 leading-snug">
                Attend live interactive sessions or catch up at your own pace
                with recordings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-1.5">
              <div className="text-amber-500 text-base">🎯</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Career Support
              </h4>
              <p className="text-[11px] text-slate-800 dark:text-slate-400 leading-snug">
                Placement team helps with resume building, mock interviews, and
                real opportunities.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-1.5">
              <div className="text-purple-500 text-base">👨‍🏫</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Expert Trainers
              </h4>
              <p className="text-[11px] text-slate-800 dark:text-slate-400 leading-snug">
                Industry pros with real-world experience, not just slide
                recruiters.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-1.5">
              <div className="text-emerald-500 text-base">📜</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Verified Certifications
              </h4>
              <p className="text-[11px] text-slate-800 dark:text-slate-400 leading-snug">
                Respected credentials backed by ISO, NSDC, and NIELIT
                partnerships.
              </p>
            </div>
          </div>
        </div>

        {/* --- 3 Simple Steps & Community Joined (Two Column Compact Layout) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Steps Box */}
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Start Learning in 3 Simple Steps
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside">
              <li className="leading-snug">
                <strong className="text-slate-900 dark:text-white">
                  Browse Programs:
                </strong>{" "}
                Explore 110+ career-ready courses across business, tech, and
                marketing.
              </li>
              <li className="leading-snug">
                <strong className="text-slate-900 dark:text-white">
                  Easy Enrollment:
                </strong>{" "}
                Pay conveniently via card, EMI, or education loan options.
              </li>
              <li className="leading-snug">
                <strong className="text-slate-900 dark:text-white">
                  Start Learning:
                </strong>{" "}
                Attend live/recorded sessions, complete projects, and earn your
                certificate.
              </li>
            </ol>
          </div>

          {/* Community Box */}
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Join a Growing Community Across India
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-400 leading-relaxed">
                Thousands of students and working professionals have upskilled
                or switched careers. Eklabya is built to be your complete
                learning partner, offering current course content, real
                mentorship, and placement assistance.
              </p>
            </div>
            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 italic">
              "From learning to employable, fast."
            </p>
          </div>
        </div>

        {/* --- Small Compact CTA Box --- */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 text-center shadow-md max-w-2xl mx-auto space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Ready to Start Your Learning Journey?
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-400 max-w-lg mx-auto">
            Empower your future with Eklabya. No classroom needed—just a device,
            internet, and the passion to grow.
          </p>
          <div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-98"
            >
              <span>Explore Courses</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
