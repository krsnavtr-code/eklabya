"use client";

import React from "react";
import {
  FaStar,
  FaRegStar,
  FaGoogle,
  FaFacebookF,
  FaInstagram,
  FaQuoteLeft,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type Platform = "google" | "facebook" | "x" | "instagram";

interface Testimonial {
  id: number;
  name: string;
  platform: Platform;
  rating: number;
  text: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rohit Sharma",
    platform: "google",
    rating: 5,
    text: "The course completely transformed my career. The instructors are industry experts and the projects are real-world. Highly recommended for anyone looking to upskill.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Priya Patel",
    platform: "facebook",
    rating: 5,
    text: "Excellent curriculum and amazing support from the team. I landed my first MNC job within two months of completing the program. Thank you Eklabya!",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Amit Verma",
    platform: "x",
    rating: 4,
    text: "Great value for money. The live industry project gave me hands-on experience that I could talk about in interviews. Worth every penny. Great value for money. The live industry project gave me hands-on experience that I could talk about in interviews. Worth every penny.",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Neha Gupta",
    platform: "instagram",
    rating: 5,
    text: "Loved the community and mentorship. The certificate boosted my resume and the hiring partners helped me connect with top companies.",
    date: "5 days ago",
  },
];

const platformConfig: Record<
  Platform,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    border: string;
    bg: string;
  }
> = {
  google: {
    label: "Google",
    icon: FaGoogle,
    color: "text-red-500",
    border: "border-t-red-500",
    bg: "bg-red-50 dark:bg-red-900/10",
  },
  facebook: {
    label: "Facebook",
    icon: FaFacebookF,
    color: "text-blue-600",
    border: "border-t-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/10",
  },
  x: {
    label: "X",
    icon: FaXTwitter,
    color: "text-slate-900 dark:text-white",
    border: "border-t-slate-900 dark:border-t-white",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
    color: "text-pink-500",
    border: "border-t-pink-500",
    bg: "bg-pink-50 dark:bg-pink-900/10",
  },
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <FaRegStar key={i} className="w-3.5 h-3.5 text-slate-300" />
      ),
    )}
  </div>
);

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <FaQuoteLeft className="w-3.5 h-3.5" />
            Loved by Learners
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed">
            Real reviews from Google, Facebook, X, and Instagram from learners
            who transformed their careers with us.
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Fading Edges */}
          <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-max gap-6 py-4 animate-marquee-rtl hover:[animation-play-state:paused]">
            {[
              ...testimonials,
              ...testimonials,
              ...testimonials,
              ...testimonials,
            ].map((review, index) => {
              const config = platformConfig[review.platform];
              const PlatformIcon = config.icon;
              
              // ==========================================
              // DYNAMIC WIDTH LOGIC BASED ON TEXT LENGTH
              // ==========================================
              const textLen = review.text?.length || 0;
              let dynamicWidthClass = "w-[300px]"; // Default for short text

              if (textLen > 220) {
                dynamicWidthClass = "w-[500px]"; // Longest text
              } else if (textLen > 120) {
                dynamicWidthClass = "w-[400px]"; // Medium text
              }

              return (
                <div
                  key={`${review.id}-${index}`}
                  className={`${dynamicWidthClass} shrink-0 relative group rounded-2xl bg-white dark:bg-slate-800/95 border border-slate-100 dark:border-slate-700/50 shadow-lg shadow-slate-200/40 dark:shadow-black/20 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-blue-900/20 border-t-4 ${config.border}`}
                >
                  <div
                    className={`absolute -top-3 left-6 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color} shadow-sm`}
                  >
                    <PlatformIcon className="w-3 h-3" />
                    {config.label}
                  </div>

                  <div className="mt-4 flex items-center gap-1 mb-4">
                    <StarRating rating={review.rating} />
                    <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                      {review.date}
                    </span>
                  </div>

                  {/* Removed line-clamp-4 so full text is visible according to the dynamic width */}
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
                        Eklabya Verified Learner
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
