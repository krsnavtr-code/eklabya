"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import SEO from "../components/SEO";
import { submitContactForm } from "../api/contactApi";
import api from "../utils/api";

interface Course {
  _id: string;
  title?: string;
  name?: string;
}

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseInterest: "",
    agreedToTerms: false,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

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
    loadCourses();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Contact Eklabya | Courses & Admissions Support"
        description="Contact Eklabya for admissions, courses and corporate training. Get expert guidance and find the right learning path to achieve your career goals today."
        keywords="Eklabya contact, contact Eklabya, Eklabya courses, admissions support, online courses, corporate training, career guidance, Noida"
        og={{
          title: "Contact Eklabya | Courses & Admissions Support",
          description:
            "Contact Eklabya for admissions, courses and corporate training. Get expert guidance and find the right learning path to achieve your career goals today.",
          type: "website",
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions about admissions, courses, or corporate training? Our
            team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-blue-500 mt-1" />
                  <span>
                    G-25, Block G, Sector 3, Noida, Uttar Pradesh 201301
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="text-emerald-500" />
                  <a
                    href="tel:+919891030303"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    +91 9891030303
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-purple-500" />
                  <a
                    href="mailto:info@eklabya.com"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    info@eklabya.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Need urgent help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Chat with us on WhatsApp and our team will guide you through the
                right course or admission.
              </p>
              <a
                href="https://wa.me/919891030303?text=Hi%2C%20I%20would%20like%20to%20talk%20to%20an%20expert%20about%20career%20guidance%20and%20course%20recommendations."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
                  placeholder="+91 8080808080"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interested in: (Optional)
                </label>
                {isLoadingCourses ? (
                  <select
                    disabled
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-gray-500"
                  >
                    <option>Loading courses...</option>
                  </select>
                ) : courses.length > 0 ? (
                  <select
                    name="courseInterest"
                    value={formData.courseInterest}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
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
                    disabled
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-gray-500"
                  >
                    <option>No courses available</option>
                  </select>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="agreedToTerms"
                  name="agreedToTerms"
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="agreedToTerms"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  I agree to receive promotional emails &amp; messages through
                  WhatsApp/RCS/SMS{" "}
                  <Link
                    href="/terms-of-service"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    T&amp;C
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-red-500">*</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-70"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
