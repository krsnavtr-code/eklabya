"use client";

import { useEffect, useState, ChangeEvent, FormEvent, ReactNode } from "react";
import { toast } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import api from "../../utils/api";
import { submitContactForm } from "../../api/contactApi";

interface Course {
  _id: string;
  title?: string;
  name?: string;
}

interface StandaloneLeadFormProps {
  heading?: ReactNode;
  subheading?: ReactNode;
  // Only show courses whose title contains this keyword (e.g. "SAP").
  courseKeyword?: string;
  // Pre-select a course by keyword match.
  defaultCourseKeyword?: string;
  // Hide the optional message textarea (e.g. compact hero/banner forms).
  showMessage?: boolean;
  // Render without the card background/border/shadow (when wrapped in a
  // custom container, e.g. inside the hero banner).
  noCard?: boolean;
}

// Self-contained lead capture form for standalone landing pages.
// Submits to the same /contacts API as the main site but never navigates
// away and contains no links back to the main website.
export default function StandaloneLeadForm({
  heading = "Request a Free Career Counselling Call",
  subheading = "Fill in your details and our counsellor will call you back shortly.",
  courseKeyword,
  defaultCourseKeyword,
  showMessage = true,
  noCard = false,
}: StandaloneLeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    courseInterest: "",
    agreedToTerms: false,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [courseLocked, setCourseLocked] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.get("/courses", {
          params: { limit: 200, isPublished: "true" },
        });
        const data = response?.data?.data || response?.data || [];
        const list: Course[] = Array.isArray(data) ? data : [];
        const filtered = courseKeyword
          ? list.filter((c) =>
              (c.title || c.name || "")
                .toLowerCase()
                .includes(courseKeyword.toLowerCase()),
            )
          : list;
        setCourses(filtered);

        if (defaultCourseKeyword) {
          const match = filtered.find((c) =>
            (c.title || c.name || "")
              .toLowerCase()
              .includes(defaultCourseKeyword.toLowerCase()),
          );
          if (match) {
            setFormData((prev) => ({ ...prev, courseInterest: match._id }));
            setCourseLocked(true);
          }
        }
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };
    loadCourses();
  }, [courseKeyword, defaultCourseKeyword]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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

    if (!formData.agreedToTerms) {
      toast.error("Please accept the terms & conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      const selected = courses.find((c) => c._id === formData.courseInterest);
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        courseId: formData.courseInterest || "",
        courseTitle: selected?.title || selected?.name || "",
      });

      if (result.success) {
        if (result.data?.trackingId) {
          localStorage.setItem("user_tracker_id", result.data.trackingId);
        }
        setIsSuccess(true);
        toast.success("Submitted successfully! We will call you back soon.");
      } else {
        if (result.errors) {
          Object.values(result.errors).forEach((err) =>
            toast.error(String(err)),
          );
        } else {
          toast.error(result.message || "Failed to submit. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to submit. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-xl shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white bg-white text-slate-900 outline-none";

  return (
    <div
      className={
        noCard
          ? "w-full"
          : "w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-3 md:p-6"
      }
    >
      {(heading || subheading) && (
        <div className="text-center max-w-xl mx-auto mb-6">
          {heading && (
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1.5">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
              {subheading}
            </p>
          )}
        </div>
      )}

      {isSuccess ? (
        <div className="text-center py-10 max-w-md mx-auto">
          <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Thank You!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your details have been submitted successfully. Our career counsellor
            will contact you shortly.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+91 8080808080"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className={inputClass}
            />
          </div>
          {!courseLocked && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                I&apos;m interested in
              </label>
              <select
                name="courseInterest"
                value={formData.courseInterest}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select a course (optional)</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title || course.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {showMessage && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us about your goals or ask a question..."
                className={inputClass}
              />
            </div>
          )}
          <div className="sm:col-span-2 flex items-start gap-2">
            <input
              type="checkbox"
              id="leadAgreedToTerms"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="leadAgreedToTerms"
              className="text-xs text-slate-600 dark:text-slate-400"
            >
              I agree to be contacted by Eklabya regarding courses and career
              counselling.
            </label>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 hover:scale-102 transition-all shadow-md shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Request Call Back"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
