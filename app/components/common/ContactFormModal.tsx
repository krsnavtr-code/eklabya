"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { submitContactForm } from "../../api/contactApi";

interface ContactFormModalProps {
  isOpen?: boolean;
  onClose: () => void;
  autoOpen?: boolean;
  autoOpenDelay?: number;
}

interface Course {
  _id: string;
  title?: string;
  name?: string;
}

export default function ContactFormModal({
  isOpen = false,
  onClose,
  autoOpen = false,
  autoOpenDelay = 60000,
}: ContactFormModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    courseInterest: "",
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [autoOpened, setAutoOpened] = useState(false);

  const isVisible = isOpen || autoOpened;

  const closeModal = () => {
    setAutoOpened(false);
    onClose();
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.get("/courses", {
          params: { limit: 200, isPublished: "true" },
        });
        const data = response?.data?.data || response?.data || [];
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    if (isVisible) {
      loadCourses();
    }
  }, [isVisible]);

  // Auto-open the lead form after the user has been on the page for a while
  useEffect(() => {
    if (!autoOpen || isVisible) return;
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("contactLeadShown") === "1"
    )
      return;

    const timer = setTimeout(() => {
      setAutoOpened(true);
    }, autoOpenDelay);

    return () => clearTimeout(timer);
  }, [autoOpen, autoOpenDelay, isVisible]);

  useEffect(() => {
    if (isVisible && typeof window !== "undefined") {
      sessionStorage.setItem("contactLeadShown", "1");
    }
  }, [isVisible]);

  const handleChange = (
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

  const handleSubmit = async (e: FormEvent) => {
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
      const submissionData: Record<string, any> = {
        ...formData,
        courseId: formData.courseInterest,
        courseTitle: formData.courseInterest
          ? courses.find((c) => c._id === formData.courseInterest)?.title ||
            courses.find((c) => c._id === formData.courseInterest)?.name ||
            ""
          : "",
      };
      delete submissionData.courseInterest;

      const result = await submitContactForm(submissionData);

      if (result.success) {
        if (result.data?.trackingId) {
          localStorage.setItem("user_tracker_id", result.data.trackingId);
        }
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          courseInterest: "",
          agreedToTerms: false,
        });
        closeModal();
        const thanksMessage =
          result.message || "Your message has been sent successfully!";
        router.push("/thank-you?message=" + encodeURIComponent(thanksMessage));
      } else {
        if (result.errors) {
          Object.values(result.errors).forEach((error) => {
            toast.error(String(error));
          });
        } else {
          toast.error(result.message || "Failed to send message.");
        }
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to send message. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500/75"
          onClick={closeModal}
          aria-hidden="true"
        ></div>

        <div className="inline-block align-middle bg-white dark:bg-gray-800 rounded-lg text-left overflow-y-auto shadow-xl transform transition-all max-h-[90vh] sm:my-4 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 py-4 sm:px-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Request A Call Back
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-white">
                  Message Sent!
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                  Thank you for contacting us.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
                    placeholder="+91 8080808080"
                  />
                </div>

                <div>
                  <label
                    htmlFor="courseInterest"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    I&apos;m interested in: (Optional)
                  </label>
                  {isLoadingCourses ? (
                    <select
                      id="courseInterest"
                      name="courseInterest"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    >
                      <option>Loading courses...</option>
                    </select>
                  ) : courses.length > 0 ? (
                    <select
                      id="courseInterest"
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
                    >
                      <option value="">Select a course (optional)</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title || course.name || course._id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      id="courseInterest"
                      name="courseInterest"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    >
                      <option>No courses available</option>
                    </select>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    id="agreedToTerms"
                    name="agreedToTerms"
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    className="mt-1 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 bg-gray-50"
                    required
                  />
                  <div className="text-xs">
                    <label
                      htmlFor="agreedToTerms"
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      I hereby agree to receive the promotional emails &amp;
                      messages through WhatsApp/RCS/SMS{" "}
                      <Link
                        href="/terms-of-service"
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                      >
                        T&amp;C
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                      >
                        Privacy Policy
                      </Link>
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
