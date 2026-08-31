"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { toast } from "react-hot-toast";
import {
  FaStar,
  FaRegStar,
  FaTag,
  FaShare,
  FaClock,
  FaBookOpen,
  FaCertificate,
  FaGlobe,
  FaPlay,
  FaPlayCircle,
  FaFileDownload,
  FaLaptopCode,
  FaProjectDiagram,
  FaRocket,
  FaCrown,
} from "react-icons/fa";
import { FaMessage as MessageSquare } from "react-icons/fa6";
import { formatPrice } from "../../utils/format";
import { getImageUrl } from "../../utils/imageUtils";
import api from "../../utils/api";

export interface CourseTopSectionProps {
  course: {
    _id?: string;
    title: string;
    originalPrice?: number;
    price: number;
    category?: { name?: string };
    isFeatured?: boolean;
    level?: string;
    duration?: string | number;
    curriculum?: Array<{ title: string; topics?: string[] }>;
    language?: string;
    shortDescription?: string;
    rating?: number;
    thumbnail?: string;
    imageUrl?: string;
    certificateIncluded?: boolean;
    hasDiscount?: boolean;
  };
  rating?: number;
  discountPercentage?: number;
  onVideoPreview: () => void;
  onShowCertificate: () => void;
  onShowContactForm: () => void;
}

interface PartnerItem {
  name: string;
  color?: string;
  logoUrl?: string;
}

const certificationPartners: PartnerItem[] = [
  {
    name: "AWS",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Microsoft",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    name: "Google Cloud",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Meta",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Oracle",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    color: "text-red-600 dark:text-red-400",
  },
  {
    name: "CompTIA",
    color: "text-slate-700 dark:text-slate-300",
  },
  {
    name: "Cisco",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
    color: "text-cyan-600 dark:text-cyan-400",
  },
];

const hiringPartners: PartnerItem[] = [
  {
    name: "Google",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Amazon",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Netflix",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    color: "text-red-600 dark:text-red-400",
  },
  {
    name: "TCS",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    color: "text-blue-800 dark:text-blue-300",
  },
  {
    name: "Infosys",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Wipro",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "HCLTech",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/HCLTech_logo.svg",
    color: "text-blue-700 dark:text-blue-400",
  },
  {
    name: "Tech Mahindra",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Tech_Mahindra_New_Logo.svg",
    color: "text-red-600 dark:text-red-400",
  },
  {
    name: "Flipkart",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/07/Flipkart_logo.svg",
    color: "text-yellow-500 dark:text-yellow-400",
  },
  {
    name: "Zomato",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg",
    color: "text-red-600 dark:text-red-500",
  },
];

const MarqueeRow = ({
  items,
  direction,
  title,
}: {
  items: PartnerItem[];
  direction: "rtl" | "ltr";
  title: string;
}) => {
  const trackItems = [...items, ...items, ...items, ...items];

  return (
    <div className="my-2">
      <div className="relative overflow-hidden group">
        <div className="absolute top-0 left-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>

        <div
          className={`flex w-max ${
            direction === "rtl" ? "animate-marquee-rtl" : "animate-marquee-ltr"
          } gap-6 py-2 hover:[animation-play-state:paused]`}
        >
          {trackItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center justify-center h-16 px-6 min-w-[140px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group/logo"
            >
              {item.logoUrl ? (
                <img
                  src={item.logoUrl}
                  alt={`${item.name} logo`}
                  className="max-h-8 max-w-[120px] object-contain filter grayscale opacity-60 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-300"
                  onError={(e: any) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}

              {/* Fallback Text */}
              <span
                className={`font-bold text-sm tracking-wide ${item.color} ${item.logoUrl ? "hidden" : "block"}`}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CourseTopSection: React.FC<CourseTopSectionProps> = ({
  course,
  rating = 4,
  discountPercentage = 0,
  onVideoPreview,
  onShowCertificate,
  onShowContactForm,
}) => {
  const shareCourse = () => {
    if (navigator.share) {
      navigator
        .share({
          title: course.title,
          text: `Check out this course: ${course.title}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const [enquiry, setEnquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEnquiryReminder, setShowEnquiryReminder] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowEnquiryReminder(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const handleEnquiryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEnquiry((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!enquiry.name?.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!enquiry.email?.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(enquiry.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!enquiry.phone?.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^[\d\s\-+()]*$/.test(enquiry.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const enrollmentData = {
        courseId: course._id,
        courseTitle: course.title,
        status: "pending",
        contactInfo: {
          name: enquiry.name.trim(),
          email: enquiry.email.trim(),
          phone: enquiry.phone.trim(),
          message:
            enquiry.message?.trim() ||
            `I would like to enquire about ${course?.title}`,
        },
      };

      const response = await api.post("/enrollments", enrollmentData);

      if (response.data.success) {
        toast.success(
          "Your enquiry has been submitted successfully! Our team will contact you shortly.",
          {
            duration: 5000,
            style: {
              background: "#4caf50",
              color: "white",
            },
          },
        );

        setEnquiry({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        throw new Error(response.data.message || "Failed to submit enquiry");
      }
    } catch (error: any) {
      console.error("Error submitting enquiry:", error);

      if (error.response?.status === 429) {
        toast.error(
          "You have submitted too many requests. Please try again later.",
          {
            duration: 8000,
            icon: "⏱️",
          },
        );
      } else if (!navigator.onLine) {
        toast.error(
          "You are offline. Please check your internet connection and try again.",
          {
            duration: 8000,
            icon: "🌐",
          },
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to submit your enquiry. Please try again.",
          {
            duration: 5000,
          },
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ================= LEFT COLUMN (CONTENT) ================= */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-6">
          {/* Badges & Share */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {course.category?.name && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
                  <FaTag className="mr-1.5 h-3 w-3" />
                  {course.category.name}
                </span>
              )}
              {course.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold tracking-wide backdrop-blur-sm">
                  <FaStar className="mr-1.5 h-3 w-3" />
                  Featured
                </span>
              )}
              {course.level && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
                  {course.level}
                </span>
              )}
            </div>

            <button
              onClick={shareCourse}
              className="group flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              <span className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                <FaShare className="w-3.5 h-3.5" />
              </span>
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
            {course.title}
          </h1>

          {/* Inline Meta Info (Replaced the boxy grid) */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-medium text-slate-700 dark:text-slate-300">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) =>
                  i < rating ? (
                    <FaStar key={i} className="w-4 h-4" />
                  ) : (
                    <FaRegStar key={i} className="w-4 h-4" />
                  ),
                )}
              </div>
              <span className="text-slate-900 dark:text-white font-bold">
                {rating}.0
              </span>
            </div>

            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>

            {/* Duration */}
            <div className="flex items-center gap-2">
              <FaClock className="text-blue-500 w-4 h-4" />
              <span>{course.duration || "Lifetime Access"}</span>
            </div>

            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>

            {/* Lessons */}
            <div className="flex items-center gap-2">
              <FaBookOpen className="text-purple-500 w-4 h-4" />
              <span>
                {course.curriculum?.length ? course.curriculum.length * 2 : 0}{" "}
                Lessons
              </span>
            </div>

            {course.language && (
              <>
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-emerald-500 w-4 h-4" />
                  <span>{course.language}</span>
                </div>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
            {course.shortDescription ||
              "Elevate your skills with this comprehensive course. Learn industry-standard practices from experts and build real-world projects."}
          </p>

          {/* Certifications & Hiring Partners */}
          <div className="pt-10 pb-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                <FaRocket className="w-3.5 h-3.5" />
                Career Accelerator
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Get Certified. Get Noticed.{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Get Hired.
                </span>
              </h3>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed">
                Stand out from the crowd! Earn premium credentials from global
                tech leaders and fast-track your entry into top-paying MNCs with
                our exclusive hiring network.
              </p>
            </div>

            <div className="space-y-4">
              <MarqueeRow
                title="Certifications"
                items={certificationPartners}
                direction="rtl"
              />
              <MarqueeRow
                title="Hiring Partners"
                items={hiringPartners}
                direction="ltr"
              />
            </div>
          </div>

          {/* Certificate of Completion - Full View */}
          {course.certificateIncluded && (
            <div className="pt-6 pb-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                  <FaCertificate className="w-3.5 h-3.5" />
                  Certificate of Completion
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                  Earn a Recognized Certificate
                </h3>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Complete the course and receive a professional certificate to
                  showcase your achievement.
                </p>
              </div>

              <div className="relative cursor-pointer group rounded-2xl overflow-hidden border border-emerald-100 dark:border-emerald-500/50 shadow-lg shadow-slate-200/50 dark:shadow-emerald-900/30 bg-white dark:bg-slate-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/40 dark:to-green-900/20">
                <img
                  src="http://www.eklabya.com/api/upload/file/eklabya-certificate-4563.png"
                  alt="Certificate of Completion"
                  className="w-full h-auto p-10 object-contain transition-transform duration-700 group-hover:scale-105"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = "/images/course-placeholder.jpg";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN (FLOATING CARD) ================= */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 w-full">
          <div className="bg-white dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100 dark:border-slate-700/50 overflow-hidden flex flex-col">
            {/* Thumbnail Header */}
            <div
              className="relative group cursor-pointer"
              onClick={onVideoPreview}
            >
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors z-10"></div>
              <img
                src={getImageUrl(course.thumbnail)}
                alt={course.title}
                className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "/images/course-placeholder.jpg";
                }}
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-14 h-14 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <FaPlay className="text-blue-600 dark:text-blue-400 w-5 h-5 ml-1" />
                </div>
              </div>

              {/* Discount Tag */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wider uppercase">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 flex flex-col">
              {/* Price Section */}
              <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {course.price > 0 ? formatPrice(course.price) : "Free"}
                </span>
                {course.originalPrice &&
                  course.originalPrice > course.price && (
                    <span className="text-base text-slate-700 dark:text-slate-300 line-through font-semibold mb-1">
                      {formatPrice(course.originalPrice)}
                    </span>
                  )}
              </div>

              {/* Main Actions */}
              <div className="flex flex-col gap-3 mb-8">
                <button
                  onClick={onShowContactForm}
                  className="w-full py-1.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Request Details
                </button>
                <button
                  onClick={onVideoPreview}
                  className="w-full py-1.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Watch Preview
                </button>
              </div>

              {/* Features List */}
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
                  This Course Includes:
                </p>
                <ul className="space-y-3.5">
                  {[
                    {
                      icon: (
                        <FaPlayCircle className="text-slate-700 dark:text-slate-300 w-4 h-4" />
                      ),
                      text: "On-demand Sessions",
                    },
                    {
                      icon: (
                        <FaFileDownload className="text-slate-700 dark:text-slate-300 w-4 h-4" />
                      ),
                      text: "Downloadable Resources",
                    },
                    {
                      icon: (
                        <FaLaptopCode className="text-slate-700 dark:text-slate-300 w-4 h-4" />
                      ),
                      text: "Portfolio Website",
                    },
                    {
                      icon: (
                        <FaProjectDiagram className="text-slate-700 dark:text-slate-300 w-4 h-4" />
                      ),
                      text: "Live Industry Project",
                    },
                    {
                      icon: (
                        <FaRocket className="text-slate-700 dark:text-slate-300 w-4 h-4" />
                      ),
                      text: "Freelance Projects",
                    },
                    {
                      icon: (
                        <FaCrown className="text-slate-700 dark:text-slate-300 w-4 h-4" />
                      ),
                      text: "Lifetime eKlabya Membership",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certificate Mini-Banner */}
              {course.certificateIncluded && (
                <div
                  onClick={onShowCertificate}
                  className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl group-hover:scale-105 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-all">
                      <FaCertificate className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        Certificate of Completion
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        Validate your skills and enhance your resume upon
                        completing all modules.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enquiry Form */}
              <div
                ref={formRef}
                className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                  Have a Question?
                </h4>
                <form onSubmit={handleEnquirySubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={enquiry.name}
                      onChange={handleEnquiryChange}
                      placeholder="Your name"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-700 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={enquiry.email}
                      onChange={handleEnquiryChange}
                      placeholder="Your email"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-700 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={enquiry.phone}
                      onChange={handleEnquiryChange}
                      placeholder="Your phone number"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-700 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={enquiry.message}
                      onChange={handleEnquiryChange}
                      placeholder="Your message (optional)"
                      rows={3}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-700 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" /> Send Enquiry
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showEnquiryReminder && (
        <button
          type="button"
          onClick={() =>
            formRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pl-4 pr-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-1 transition-all duration-300 group"
          aria-label="Have a question?"
        >
          <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[140px] transition-all duration-300 whitespace-nowrap text-sm font-bold">
            Have a question?
          </span>
        </button>
      )}
    </div>
  );
};

export default CourseTopSection;
