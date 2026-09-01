"use client";

import React from "react";
import Link from "next/link";
import {
  FaShieldAlt,
  FaRocket,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const ScholarshipProgram = () => {
  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 py-4">
      <div className="relative max-w-7xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-5 sm:p-7 md:p-8 space-y-6 overflow-hidden">
        {/* --- Section Header --- */}
        <div className="text-center max-w-3xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Why Learn with Eklabya?
          </h2>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left Column: Core Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-xs border border-slate-200/80 dark:border-slate-700/60 space-y-4">
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                Eklabya isn't just your run of the mill course library, it's
                built around one single purpose : making learning actually lead
                to a job. Through the Eklabya Scholarship Exam we help deserving
                students get some real financial backing. All we consider is
                their talent. We've also got job-focused online courses, where
                every learner gets a curriculum that's been tailored to the jobs
                that are currently up for grabs, not some outdated syllabus that
                was written five years ago and never changed.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600/90 to-indigo-700/90 dark:from-blue-900/90 dark:to-indigo-950/90 backdrop-blur-md rounded-2xl p-4 md:p-5 text-white shadow-xl space-y-2">
              <h3 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
                <FaRocket className="text-amber-400" /> What Sets Us Apart
              </h3>
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed font-normal">
                The key thing that sets Eklabya apart from a normal online
                course site or some free YouTube videos is plain to see : we
                build our programs to help you get a job, not just finish a
                course. Every program we offer will include some
                industry-relevant projects that employers actually care about,
                some verified certification to give you that extra boost, and a
                bit of direct exposure to the people who actually do the hiring
                . So when you finish one of our courses you'll have a heap more
                on your CV, not just a list that says you "completed the
                course".
              </p>
            </div>
          </div>

          {/* Right Column: Highlight Card & Quick Actions */}
          <div className="lg:col-span-5">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-xl border border-slate-200/80 dark:border-slate-700/60 space-y-6 relative overflow-hidden">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/80 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
                  Career First Approach
                </span>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-3 tracking-tight">
                  Ready to transform your career?
                </h3>
              </div>

              <div className="space-y-3 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
                  <span>
                    Real financial backing through merit scholarships.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
                  <span>
                    Up-to-date curricula matching active job market demands.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
                  <span>Direct exposure to industry hiring managers.</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-700/60">
                <Link
                  href="/scholarship"
                  className="w-full text-center border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-xs"
                >
                  Learn About Scholarship
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipProgram;
