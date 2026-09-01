"use client";

import React from "react";
import { FaStar, FaRegStar, FaGoogle, FaQuoteLeft } from "react-icons/fa";

interface GoogleReview {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const googleReviews: GoogleReview[] = [
  {
    id: 1,
    name: "Classes with Karan",
    rating: 5,
    text: "I had a great learning experience at Eklabya Centre for Excellence. The teaching methodology is practical, easy to understand, and focused on real-world applications. If you're searching for the best data science courses online, I highly recommend Eklabya Centre for Excellence. The course content is well-structured, industry-relevant, and suitable for both beginners and professionals looking to upskill.",
    date: "3 months ago",
  },
  {
    id: 2,
    name: "Gaurav Jha",
    rating: 5,
    text: "Hi, I am Gaurav. I completed the Data Science course Online from Eklabya. The learning experience was excellent, with supportive faculty, practical training, and well-structured classes. The course helped me gain strong knowledge in Data Science and improve my skills confidently, and also they provide 100% job Assurance.",
    date: "3 months ago",
  },
  {
    id: 3,
    name: "Aryan Verma",
    rating: 5,
    text: "I am Aryan Verma and completed the Digital Marketing Course at Eklabya . The trainers were supportive, and the course provided practical knowledge with hands-on projects. It was a great learning experience, they give 100% job assurance and I would highly recommend it to anyone interested in digital marketing.",
    date: "2 months ago",
  },
  {
    id: 4,
    name: "NITESH SINGH",
    rating: 5,
    text: "Myself Nitesh Singh, and I had a great learning experience with Eklabya. I completed the Digital Marketing Course from this platform, and the training was very informative and practical. The mentors explained every topic clearly, including SEO, social media marketing, Google Ads, and content marketing. I gained valuable skills and confidence in digital marketing after completing the course.They also conduct interviews in different companies and Job assurance.",
    date: "3 months ago",
  },
  {
    id: 5,
    name: "Neha Kashyap",
    rating: 5,
    text: "I completed the SAP Material Management course from Eklabya, and my experience was very positive. As a student, I found the training well-structured and easy to understand. The trainer explained SAP MM concepts clearly with practical examples and real-time scenarios, which helped me build a strong understanding of the subject.",
    date: "2 months ago",
  },
  {
    id: 6,
    name: "Vivek Thakur",
    rating: 5,
    text: "One of the best institutes for an SAP online certification course. The faculty is very supportive, and the live classes with real-time projects made learning easy. I successfully cleared my SAP interview after completing the course.",
    date: "3 months ago",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <FaRegStar key={i} className="w-3.5 h-3.5 text-amber-400" />
      ),
    )}
  </div>
);

const GoogleReviews = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <FaQuoteLeft className="w-3.5 h-3.5" />
            Google Reviews
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Loved on Google
          </h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Real feedback from our learners on Google.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max gap-6 py-4 animate-marquee-google hover:[animation-play-state:paused]">
          {[
            ...googleReviews,
            ...googleReviews,
            ...googleReviews,
            ...googleReviews,
          ].map((review, index) => {
            // ==========================================
            // DYNAMIC WIDTH LOGIC BASED ON TEXT LENGTH
            // ==========================================
            const textLen = review.text?.length || 0;
            let dynamicWidthClass = "w-[320px]"; // Default for short text

            if (textLen > 350) {
              dynamicWidthClass = "w-[500px]"; // Very long text (like Nitesh Singh's review)
            } else if (textLen > 250) {
              dynamicWidthClass = "w-[420px]"; // Medium-long text (like Karan or Gaurav's review)
            }

            return (
              <div
                key={`${review.id}-${index}`}
                className={`${dynamicWidthClass} shrink-0 relative rounded-2xl bg-white dark:bg-slate-800/95 border border-slate-100 dark:border-slate-700/50 shadow-lg shadow-slate-200/40 dark:shadow-black/20 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-blue-900/20 border-t-4 border-amber-400 dark:border-amber-500`}
              >
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-sm">
                  <FaGoogle className="w-3 h-3" />
                  Google
                </div>

                <div className="mt-4 flex items-center gap-1 mb-4">
                  <StarRating rating={review.rating} />
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                    {review.date}
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {review.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Verified on Google
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes marquee-google {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-google {
          display: flex;
          width: max-content;
          animation: marquee-google 70s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default GoogleReviews;
