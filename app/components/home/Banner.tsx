"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  FaSearch,
  FaBookOpen,
  FaUsers,
  FaCertificate,
  FaPlay,
  FaArrowRight,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCheckCircle,
  FaDownload,
  FaPaperPlane,
  FaGraduationCap,
} from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { submitContactForm } from "../../api/contactApi";
import ContactFormModal from "../common/ContactFormModal";
import BrochureSelectorModal from "../common/BrochureSelectorModal";

const bannerImg =
  "https://www.eklabya.com/api/upload/file/Home-Page-Image-9212.png";
const logoImg = "https://www.eklabya.com/api/upload/file/eKlabya-0644.png";

interface Course {
  _id: string;
  title?: string;
  name?: string;
}

const CertificateModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      if (isOpen) e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-[500px] w-full max-h-[500px] overflow-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white z-20 transition-all"
        >
          <FaTimes className="text-sm" />
        </button>
        <div className="p-5 relative">
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            Verified Certificate
          </h3>
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)",
                mixBlendMode: "multiply",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="text-xl font-black text-gray-400/40 transform -rotate-45 select-none tracking-widest">
                SAMPLE CERTIFICATE
              </div>
            </div>
            <div
              className="certificate-image-container"
              style={{
                backgroundImage:
                  "url('http://eklabya.com/api/upload/file/eklabya-certificate-4563.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: "100%",
                aspectRatio: "4/3",
                filter: "blur(1px)",
                userSelect: "none",
                pointerEvents: "none",
              }}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function Banner() {
  const [courseCount, setCourseCount] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Lead Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseInterest: "",
    otherCourse: "",
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [showBrochureModal, setShowBrochureModal] = useState(false);

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await api.get("/courses", {
          params: { fields: "_id", isPublished: "true" },
        });
        const count =
          response?.data?.data?.length || response?.data?.length || 0;
        setCourseCount(count + 0);
      } catch (error) {
        console.error("Error fetching course count:", error);
        setCourseCount(180); // Fallback value
      }
    };
    fetchCourseCount();

    const loadCourses = async () => {
      try {
        const response = await api.get("/courses", {
          params: { limit: 200, isPublished: "true" },
        });
        const data = response?.data?.data || response?.data || [];
        const rawList: any[] = Array.isArray(data) ? data : [];
        // Ensure only active and published courses are listed
        const activeOnly = rawList.filter((course) => {
          if (course.isPublished === false) return false;
          if (course.status && course.status !== "published") return false;
          return true;
        });
        setCourses(activeOnly);
      } catch (error) {
        console.error("Error loading courses for lead form:", error);
      } finally {
        setIsLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      toast.error("Please wait a few seconds before submitting again");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("Please accept the terms & conditions and privacy policy");
      return;
    }

    setLastSubmitTime(now);
    setIsSubmitting(true);

    try {
      const isOther = formData.courseInterest === "other";
      const matchedCourse = courses.find(
        (c) => c._id === formData.courseInterest,
      );

      const courseTitle = isOther
        ? formData.otherCourse.trim() || "Other / Not Listed"
        : matchedCourse?.title || matchedCourse?.name || "";

      const submissionData: Record<string, any> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        courseTitle: courseTitle,
        agreedToTerms: formData.agreedToTerms,
        ...(formData.courseInterest && !isOther
          ? { courseId: formData.courseInterest }
          : {}),
      };

      const result = await submitContactForm(submissionData);

      if (result.success) {
        if (result.data?.trackingId) {
          localStorage.setItem("user_tracker_id", result.data.trackingId);
        }
        setIsSubmitted(true);
        toast.success(
          result.message ||
            "Thank you! Our career expert will contact you soon.",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          courseInterest: "",
          otherCourse: "",
          agreedToTerms: false,
        });
      } else {
        if (result.errors) {
          Object.values(result.errors).forEach((err) => {
            toast.error(String(err));
          });
        } else {
          toast.error(result.message || "Failed to submit request.");
        }
      }
    } catch (error: any) {
      console.error("Error submitting lead form:", error);
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to submit. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <FaBookOpen className="text-lg text-blue-600 dark:text-blue-400" />,
      title: `${courseCount}+ Top Programme`,
      desc: "Across IT, data, business & design",
    },
    {
      icon: (
        <FaUsers className="text-lg text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Expert Mentors",
      desc: "Industry practitioners, not just trainers",
    },
    {
      icon: (
        <FaCertificate className="text-lg text-amber-600 dark:text-amber-400" />
      ),
      title: "ISO & NSDC/NIELIT Certification",
      desc: "Recognized, verifiable credentials",
      onClick: () => setShowCertificate(true),
    },
    {
      icon: (
        <FaArrowRight className="text-lg text-purple-600 dark:text-purple-400" />
      ),
      title: "98% Placement Support Rate",
      desc: "Real outcomes, not just promises",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-6 md:py-10 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="lg:w-[55%] space-y-4">
            {/* Top Badge */}
            <div className="inline-flex items-center">
              <span className="text-blue-600 dark:text-blue-400 tracking-wider font-extrabold uppercase text-[11px] md:text-xs bg-blue-100/80 dark:bg-blue-950/80 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 shadow-2xs">
                ✦ Career Acceleration Platform
              </span>
            </div>

            {/* --- REFINED PREMIUM STAIRCASE DESIGN --- */}
            <div className="space-y-2 w-full font-sans">
              <h1 className="flex flex-col space-y-2 tracking-tight text-xl sm:text-2xl md:text-3xl font-black">
                {/* Step 1 */}
                <span className="flex items-center gap-3 text-slate-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950 shrink-0"></span>
                  <span>
                    Learn{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      Job-Ready Skills.
                    </span>
                  </span>
                </span>

                {/* Step 2 (Slightly Indented) */}
                <span className="flex items-center gap-3 pl-5 sm:pl-8 text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950 shrink-0"></span>
                  <span>Get Certified.</span>
                </span>

                {/* Step 3 (Further Indented) */}
                <span className="flex items-center gap-3 pl-10 sm:pl-16 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950 animate-pulse shrink-0"></span>
                  <span>Get Hired. 🚀</span>
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl pt-1">
              Eklabya is an ISO certified, NSDC & NIELIT recognized online
              learning platform helping students and working professionals build
              in-demand skills in IT, data, business, and design, with live
              mentorship, hand-on projects, and dedicated placement support. No
              fixed schedules, no boundaries, just structured, career-focused
              learning you can start today.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={feature.onClick}
                  className={`flex flex-col p-2.5 bg-white dark:bg-gray-800/90 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 transition-all duration-200 hover:-translate-y-0.5 ${
                    feature.onClick
                      ? "cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 shadow-sm"
                      : ""
                  }`}
                >
                  <div className="mb-1.5">{feature.icon}</div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setShowContactModal(true)}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-6 py-1.5 md:py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 flex items-center justify-center shadow-md shadow-blue-600/20"
              >
                <span>Start Learning</span>
                <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                onClick={() => setShowBrochureModal(true)}
                className="group bg-orange-600 hover:bg-orange-700 text-white px-2 md:px-6 py-1.5 md:py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 flex items-center justify-center shadow-md shadow-orange-600/20"
              >
                <span>Download Brochure</span>
                <FaDownload className="ml-2 text-xs group-hover:translate-y-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Right Content - Lead Form (Banner Image Commented Out Below) */}
          <div className="lg:w-[45%] w-full flex justify-center mt-6 lg:mt-0">
            {/* 
            <div className="relative w-full max-w-[400px]">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-gray-800 shadow-xl shadow-blue-500/5 hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={bannerImg}
                  alt="Skill Development and Online Training Courses"
                  className="w-full h-auto object-cover block"
                />
              </div>

              <div className="absolute -top-6 -right-6 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
            */}

            {/* Lead Form Card */}
            <div className="relative w-full max-w-[430px]">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl shadow-blue-500/10 p-5 sm:p-6 transition-all duration-300">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Free Career Counselling
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Book a Free Course Consultation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Speak to our mentors &amp; get a personalized learning
                    roadmap.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                      <FaCheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      Request Received!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                      Thank you for reaching out. One of our senior counselors
                      will call you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="Your Name"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <FaEnvelope className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="you@email.com"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <FaPhone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="+91 9876543210"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Course You&apos;re Interested In (Optional)
                      </label>
                      <div className="relative">
                        <FaGraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <select
                          name="courseInterest"
                          value={formData.courseInterest}
                          onChange={handleFormChange}
                          disabled={isLoadingCourses}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">Select a course (optional)</option>
                          {courses.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.title || c.name || c._id}
                            </option>
                          ))}
                          <option value="other">Other / Not Listed</option>
                        </select>
                      </div>
                    </div>

                    {formData.courseInterest === "other" && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Specify Course / Interest
                        </label>
                        <input
                          type="text"
                          name="otherCourse"
                          value={formData.otherCourse}
                          onChange={handleFormChange}
                          placeholder="e.g., Cyber Security, Cloud Computing, etc."
                          className="w-full px-3.5 py-2 bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    )}

                    <div className="flex items-start space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="bannerAgreedToTerms"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleFormChange}
                        required
                        className="mt-0.5 h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 cursor-pointer shrink-0"
                      />
                      <label
                        htmlFor="bannerAgreedToTerms"
                        className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight select-none cursor-pointer"
                      >
                        I agree to receive communications via WhatsApp/SMS/Call.{" "}
                        <Link
                          href="/terms-of-service"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          T&amp;C
                        </Link>{" "}
                        &amp;{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        <span className="text-rose-500 ml-0.5">*</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <span>Request Call Back</span>
                          <FaArrowRight className="text-xs" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Background Glows */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />
      <ContactFormModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        // autoOpen
        // autoOpenDelay={60000}
        autoOpen={false}
      />
      <BrochureSelectorModal
        isOpen={showBrochureModal}
        onClose={() => setShowBrochureModal(false)}
      />
    </div>
  );
}

export default Banner;
