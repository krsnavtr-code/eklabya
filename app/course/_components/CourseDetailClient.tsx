"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { FaBookOpen, FaTimes } from "react-icons/fa";
import {
  FaMessage as MessageSquare,
  FaCreditCard as CreditCard,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

import type { CourseData } from "../../lib/server-api";
import { enrollInCourse } from "../../api/enrollmentApi";
import { useAuth } from "../../context/AuthContext";
import PaymentForm from "../../components/PaymentForm";
import CourseTopSection from "../../components/course/CourseTopSection";
import TestimonialsSection from "../../components/course/TestimonialsSection";

interface FormDataState {
  name: string;
  email: string;
  phone: string;
  message: string;
  courseInterests: string[];
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CourseDetailClientProps {
  course: CourseData;
}

const CourseDetailClient: React.FC<CourseDetailClientProps> = ({ course }) => {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();

  // State declarations
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showCheckoutOptions, setShowCheckoutOptions] =
    useState<boolean>(false);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Initialize expanded sections when course data is loaded
  useEffect(() => {
    if (course?.curriculum && course.curriculum.length > 0) {
      const initialExpandedState = course.curriculum.reduce(
        (acc: Record<number, boolean>, _, index) => ({
          ...acc,
          [index]: true,
        }),
        {},
      );
      setExpandedSections(initialExpandedState);
    }
  }, [course]);

  const [formData, setFormData] = useState<FormDataState>({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    message: "",
    courseInterests: [],
  });

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
      }));
    }
  }, [currentUser]);

  const discountPercentage =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(
          ((course.originalPrice - course.price) / course.originalPrice) * 100,
        )
      : 0;

  const handleContactTeam = () => {
    setShowCheckoutOptions(false);
    setTimeout(() => setShowContactForm(true), 50);
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const enrollmentResponse: any = await enrollInCourse(course._id);

      if (enrollmentResponse.success) {
        toast.success(
          "Your enrollment request has been received. Our team will contact you shortly.",
          {
            style: {
              background: "#4caf50",
              color: "white",
            },
            duration: 5000,
          },
        );
        setShowContactForm(false);
      } else {
        if (enrollmentResponse.shouldLogout) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(
            enrollmentResponse.message ||
              "Failed to process enrollment. Please try again.",
          );
        }
      }
    } catch (enrollError) {
      console.error("Error in enrollment process:", enrollError);
      toast.error(
        "An error occurred while processing your request. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.email?.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.phone?.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^[\d\s\-+()]*$/.test(formData.phone)) {
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
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message:
            formData.message?.trim() ||
            `I would like to enroll in ${course?.title}`,
        },
      };

      const response = await api.post("/enrollments", enrollmentData);

      if (response.data.success) {
        toast.success(
          "Your enrollment request has been submitted successfully! Our team will contact you shortly.",
          {
            duration: 5000,
            style: {
              background: "#4caf50",
              color: "white",
            },
          },
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          courseInterests: [],
        });

        setShowContactForm(false);
      } else {
        throw new Error(response.data.message || "Failed to submit enrollment");
      }
    } catch (error: any) {
      console.error("Error submitting enrollment:", error);

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
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors;

        if (Array.isArray(errorMessages)) {
          errorMessages.forEach((msg) => {
            toast.error(msg, {
              style: {
                background: "#f44336",
                color: "white",
              },
              duration: 5000,
            });
          });
        } else if (typeof errorMessages === "object") {
          Object.values(errorMessages).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => {
                toast.error(msg, {
                  style: {
                    background: "#f44336",
                    color: "white",
                  },
                  duration: 5000,
                });
              });
            }
          });
        }
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred. Please try again.";

        toast.error(errorMessage, {
          style: {
            background: "#f44336",
            color: "white",
          },
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const expandAllSections = () => {
    const allExpanded: Record<number, boolean> = {};
    course.curriculum?.forEach((_, index) => {
      allExpanded[index] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAllSections = () => {
    setExpandedSections({});
  };

  const rating = course.rating || 4;

  const customHeadings: NonNullable<CourseData["customHeadings"]> =
    course.customHeadings || {
      aboutCourse: "About This Course",
      aboutCourseInIndia: "About the course in India",
      whatYouWillLearn: "What You'll Learn",
      requirements: "Requirements",
      whoIsThisFor: "Who is this course for?",
      curriculum: "Full Curriculum",
      skills: "Skills Student Will Learn",
      topics: "Topics Student Will Learn",
      prerequisites: "Requirements",
      faq: "Frequently Asked Questions",
    };

  const handleVideoPreview = () => {
    setShowVideoModal(true);
  };

  const CertificateModal: React.FC<CertificateModalProps> = ({
    isOpen,
    onClose,
  }) => {
    useEffect(() => {
      const handleContextMenu = (e: MouseEvent | Event) => {
        if (isOpen) {
          e.preventDefault();
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-[550px] w-full max-h-[550px] overflow-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white z-20"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div className="p-6 relative">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Certificate
            </h3>
            <div className="relative">
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)",
                  mixBlendMode: "multiply",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="text-2xl font-bold text-gray-400 opacity-30 transform -rotate-45 select-none">
                  SAMPLE CERTIFICATE
                </div>
              </div>
              <div className="relative">
                <div
                  className="hidden"
                  data-decoysrc="ignore-this-decoysrc"
                  style={{ display: "none" }}
                >
                  <img
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    alt=""
                  />
                </div>

                <div
                  className="certificate-image-container"
                  style={{
                    backgroundImage:
                      "url('http://www.eklabya.com/api/upload/file/eklabya-certificate-4563.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    width: "100%",
                    aspectRatio: "4/3",
                    filter: "blur(1px)",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                    pointerEvents: "none",
                    WebkitTouchCallout: "none",
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                />

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E\")",
                    pointerEvents: "none",
                    mixBlendMode: "overlay",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <CourseTopSection
        course={course}
        rating={rating}
        discountPercentage={discountPercentage}
        onVideoPreview={handleVideoPreview}
        onShowCertificate={() => setShowCertificate(true)}
        onShowContactForm={() => setShowContactForm(true)}
      />

      <TestimonialsSection />

      <div className="container mx-auto px-4">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8 sticky top-4 md:top-20 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-xs">
          <nav className="flex flex-wrap -mb-px whitespace-nowrap space-x-1 py-2">
            <button
              onClick={() => {
                setActiveTab("overview");
                document
                  .getElementById("overview")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`py-2 px-3 md:px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveTab("curriculum");
                document
                  .getElementById("curriculum")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`py-2 px-3 md:px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "curriculum"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => {
                setActiveTab("skills");
                document
                  .getElementById("skills")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`py-2 px-3 md:px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "skills"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => {
                setActiveTab("faq");
                document
                  .getElementById("faq")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`py-2 px-3 md:px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === "faq"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => {
                setShowCheckoutOptions(true);
              }}
              className="my-1 py-1 px-3 md:px-6 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Apply Now
            </button>
          </nav>
        </div>

        <div className="space-y-12 mb-12">
          {/* 1. Overview Section */}
          <section
            id="overview"
            className="scroll-mt-36 border-b border-gray-200 dark:border-gray-800 pb-12"
          >
            <div className="text-black dark:text-white prose max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold mb-4">
                {customHeadings.aboutCourse}
              </h2>
              <div
                className="mb-6"
                dangerouslySetInnerHTML={{
                  __html: course.description || "No description available",
                }}
              />

              {course.aboutCourseInIndia && (
                <>
                  <h3 className="text-xl font-semibold mb-4">
                    {customHeadings.aboutCourseInIndia}
                  </h3>
                  <div
                    className="mb-6"
                    dangerouslySetInnerHTML={{
                      __html: course.aboutCourseInIndia,
                    }}
                  />
                </>
              )}

              <h3 className="text-xl font-semibold mb-4">
                {customHeadings.whoIsThisFor}
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {course.whoIsThisFor?.map((item, index) => (
                  <li key={index}>{item}</li>
                )) || <li>Anyone interested in learning about this topic</li>}
              </ul>
            </div>
          </section>

          {/* 2. Curriculum Section */}
          <section
            id="curriculum"
            className="scroll-mt-36 border-b border-gray-200 dark:border-gray-800 pb-12"
          >
            <div className="text-black dark:text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {customHeadings.curriculum}
                </h2>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <button
                    onClick={expandAllSections}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1.5 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAllSections}
                    className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {course.curriculum && course.curriculum.length > 0 ? (
                  <div className="space-y-3">
                    {course.curriculum.map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-200"
                      >
                        <div
                          className={`px-5 py-4 font-medium flex justify-between items-center cursor-pointer transition-colors ${
                            expandedSections[sectionIndex]
                              ? "bg-blue-50 dark:bg-slate-800/50"
                              : "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                          }`}
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-3 ${
                                expandedSections[sectionIndex]
                                  ? "bg-blue-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <p className="text-black dark:text-white font-semibold text-sm sm:text-base">
                                {section.title}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center text-xs text-black dark:text-white bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                                  {section.topics?.length || 0} topics
                                </span>
                                {section.duration && (
                                  <span className="inline-flex items-center text-xs text-black dark:text-white bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                                    {section.duration} hours
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <svg
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                              expandedSections[sectionIndex]
                                ? "transform rotate-180"
                                : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        <AnimatePresence>
                          {expandedSections[sectionIndex] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-white dark:bg-slate-800 overflow-hidden"
                            >
                              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                                <div className="p-4">
                                  <p className="text-sm text-black dark:text-white mb-3">
                                    {section.description}
                                  </p>
                                  <h4 className="text-sm font-medium text-black dark:text-white mb-2">
                                    Topics Covered:
                                  </h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {section.topics?.map(
                                      (topic, topicIndex) => (
                                        <li
                                          key={topicIndex}
                                          className="text-sm text-black dark:text-white"
                                        >
                                          {topic}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-black dark:text-white">
                      No curriculum available
                    </h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      The course curriculum will be available soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. Skills Section */}
          <section
            id="skills"
            className="scroll-mt-36 border-b border-gray-200 dark:border-gray-800 pb-12"
          >
            <div className="flex flex-col gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-6 text-black dark:text-white">
                  {customHeadings.skills}
                </h3>
                {course.skills && course.skills.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.skills.map((skill, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-black dark:text-white">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No skills available for this course.
                  </p>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-6 text-black dark:text-white">
                  {customHeadings.topics}
                </h3>
                {course.whatYouWillLearn &&
                course.whatYouWillLearn.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.whatYouWillLearn.map((skill, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-black dark:text-white">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No skills available for this course.
                  </p>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-6 text-black dark:text-white">
                  {customHeadings.prerequisites}
                </h3>
                {course.prerequisites && course.prerequisites.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-black dark:text-white">
                          {prerequisite}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No prerequisites available for this course.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 4. FAQ Section */}
          <section id="faq" className="scroll-mt-36">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                {customHeadings.faq}
              </h3>

              {course.faqs && course.faqs.length > 0 ? (
                <div className="space-y-4">
                  {course.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        onClick={() => {
                          const newOpenIndex =
                            openFaqIndex === index ? null : index;
                          setOpenFaqIndex(newOpenIndex);
                        }}
                        aria-expanded={openFaqIndex === index}
                        aria-controls={`faq-${index}`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-black dark:text-white">
                            Q{index + 1}: {faq.question}
                          </h4>
                          <svg
                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                              openFaqIndex === index
                                ? "transform rotate-180"
                                : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>
                      <div
                        id={`faq-${index}`}
                        className={`px-6 overflow-hidden transition-all duration-200 ${
                          openFaqIndex === index
                            ? "max-h-96 py-4"
                            : "max-h-0 py-0"
                        }`}
                      >
                        <p className="text-black dark:text-white">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No FAQs available for this course yet.
                  </p>
                </div>
              )}

              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Still have questions?
                </h4>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Can't find the answer you're looking for? Our team is here to
                  help.
                </p>
                <button
                  onClick={() => {
                    setShowContactForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {showCheckoutOptions && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCheckoutOptions(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-6 text-center text-black dark:text-white">
                Choose Enrollment Option
              </h3>

              <div className="space-y-4">
                <button
                  onClick={handleContactTeam}
                  className="w-full flex items-center justify-center space-x-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-6 py-4 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Contact Our Team</span>
                </button>

                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed with Payment</span>
                </button>
              </div>

              <button
                onClick={() => setShowCheckoutOptions(false)}
                className="mt-6 w-full py-2 text-black dark:text-white hover:text-gray-800 dark:hover:text-black transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContactForm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-bold text-black dark:text-white">
                  Process Your Enrollment by Fill the Form
                </p>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-black"
                  aria-label="Close"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-0 mb-2">
                <div className="relative flex-1">
                  <button
                    onClick={handleEnroll}
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-2 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                      isSubmitting
                        ? "opacity-80 cursor-not-allowed"
                        : "shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Enroll Now -{" "}
                        {course.price ? `₹${course.price.toFixed(2)}` : "Free"}
                      </>
                    )}
                  </button>
                  {course.hasDiscount && course.originalPrice && (
                    <div className="absolute bottom-0 left-0 right-0 text-center">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium text-black bg-amber-500 rounded-full">
                        {Math.round(
                          (1 - course.price / course.originalPrice) * 100,
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-black dark:text-white"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black dark:text-white"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    disabled={!!currentUser}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-1 border ${
                      currentUser ? "cursor-not-allowed" : ""
                    } border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-white`}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-black dark:text-white"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-white"
                    placeholder="+91 8080808080"
                  />
                </div>

                {course && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You're inquiring about: <strong>{course.title}</strong>
                    </p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-black dark:text-white"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={1}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-white"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacy-policy"
                    name="privacy-policy"
                    onChange={handleInputChange}
                    required
                    className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:checked:bg-blue-600"
                  />
                  <label
                    htmlFor="privacy-policy"
                    className="ml-2 text-xs font-medium text-black dark:text-white"
                  >
                    I hereby agree with{" "}
                    <Link
                      href="/terms-of-service"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Privacy Policy
                    </Link>
                    <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white font-medium bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentForm && (
          <PaymentForm
            onClose={() => setShowPaymentForm(false)}
            courseId={course._id}
            courseName={course.title}
            price={course.price}
          />
        )}
      </AnimatePresence>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />

      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Course Preview</h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <video controls className="w-full rounded" preload="metadata">
                  <source
                    src={
                      course.previewVideo ||
                      "http://www.eklabya.com/api/upload/file/DemoVideo-1781.mp4"
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetailClient;
