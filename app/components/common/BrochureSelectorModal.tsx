"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaTimes, FaDownload, FaBook, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

interface Course {
  _id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  thumbnail?: string;
  brochureUrl: string;
  category?: { name?: string };
}

interface BrochureSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrochureSelectorModal({
  isOpen,
  onClose,
}: BrochureSelectorModalProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCourses = async () => {
      setLoading(true);
      setSelectedCourse(null);
      setFormData({ name: "", email: "", phone: "" });
      try {
        const response = await api.get("/courses", {
          params: { isPublished: "true", limit: 500 },
        });

        const data: any[] = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const withBrochure = data
          .filter(
            (c) =>
              c.isPublished !== false &&
              (!c.status || c.status === "published") &&
              c.brochureUrl &&
              String(c.brochureUrl).trim() !== "",
          )
          .map((c) => ({
            _id: c._id,
            title: c.title || "Untitled Course",
            slug: c.slug,
            shortDescription: c.shortDescription,
            thumbnail: c.thumbnail,
            brochureUrl: c.brochureUrl,
            category: c.category,
          }))
          .sort((a, b) => a.title.localeCompare(b.title));

        setCourses(withBrochure);
      } catch (error) {
        console.error("Error fetching courses for brochures:", error);
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isOpen]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFileUrl = (path: string | undefined | null) => {
    if (!path) return "";
    const trimmed = path.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002")
      .replace(/\/api\/?$/, "")
      .replace(/\/+$/, "");
    const clean = trimmed.replace(/^\/+/, "");
    return `${baseUrl}/${clean}`;
  };

  const handleDownload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsDownloading(true);
    const toastId = toast.loading("Downloading course brochure...");
    try {
      // 1. Submit lead inquiry so admin / counselors receive contact
      try {
        await api.post("/contacts", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          courseId: selectedCourse._id,
          courseTitle: selectedCourse.title,
          subject: "Course Brochure Download",
          message: `User downloaded uploaded course brochure for "${selectedCourse.title}".`,
        });
      } catch (contactErr) {
        console.warn("Contact logging warning:", contactErr);
      }

      // 2. Fetch and trigger brochure download
      let downloadSucceeded = false;
      try {
        const response = await api.get(
          `/courses/${selectedCourse._id}/download-brochure`,
          {
            params: {
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
            },
            responseType: "blob",
          },
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        const filename = `${selectedCourse.title.replace(/[^a-zA-Z0-9]/g, "_")}_Brochure.pdf`;

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        downloadSucceeded = true;
      } catch (endpointErr) {
        console.warn(
          "Endpoint download failed, attempting direct download:",
          endpointErr,
        );
        if (selectedCourse.brochureUrl) {
          const directFileUrl = getFileUrl(selectedCourse.brochureUrl);
          const link = document.createElement("a");
          link.href = directFileUrl;
          link.download = `${selectedCourse.title.replace(/[^a-zA-Z0-9]/g, "_")}_Brochure.pdf`;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          downloadSucceeded = true;
        }
      }

      if (downloadSucceeded) {
        toast.success("Brochure downloaded successfully", { id: toastId });
        setFormData({ name: "", email: "", phone: "" });
        setSelectedCourse(null);
        setTimeout(onClose, 800);
      } else {
        throw new Error("Unable to download brochure file");
      }
    } catch (error) {
      console.error("Error downloading brochure:", error);
      toast.error("Failed to download brochure. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
          <div className="p-2 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {selectedCourse ? "Download Brochure" : "Select a Course"}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-all"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {selectedCourse ? (
              <div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
                >
                  <FaArrowLeft size={12} /> Back to courses
                </button>

                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/40">
                  <p className="text-sm text-blue-900 dark:text-blue-200 font-semibold">
                    {selectedCourse.title}
                  </p>
                </div>

                <form onSubmit={handleDownload} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 8080808080"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isDownloading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all disabled:opacity-70"
                    >
                      {isDownloading ? (
                        <span>Downloading...</span>
                      ) : (
                        <>
                          <FaDownload className="text-sm" />
                          <span>Download Brochure</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Choose an active course to download its brochure.
                </p>

                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-10">
                    <FaBook className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-300">
                      No brochures available right now.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    {courses.map((course) => (
                      <button
                        key={course._id}
                        onClick={() => handleCourseSelect(course)}
                        className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all"
                      >
                        <div className="h-24 mb-2 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          {course.thumbnail ? (
                            <img
                              src={getFileUrl(course.thumbnail)}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FaBook className="text-2xl" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                          {course.title}
                        </h4>
                        {course.category?.name && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                            {course.category.name}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
