"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlay, FaClock, FaCheckCircle, FaBook } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { getUserEnrollments } from "../api/enrollmentApi";
import { getImageUrl } from "../utils/imageUtils";
import SEO from "../components/SEO";

interface Module {
  lessons?: any[];
}

interface Course {
  _id?: string;
  title?: string;
  instructor?: string | { name?: string };
  thumbnail?: string;
  image?: string;
  duration?: string;
  modules?: Module[];
}

interface Enrollment {
  _id: string;
  course?: Course;
  courseId?: string;
  courseTitle?: string;
  progress?: number;
  lastAccessed?: string;
  status?: string;
}

export default function MyLearning() {
  const auth = useAuth();
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const userId = auth?.currentUser?._id;
        if (!userId) {
          setError("Please log in to view your enrolled courses");
          setLoading(false);
          return;
        }

        const response = await getUserEnrollments(userId, {
          status: "not_started",
        });

        if (!response || !response.success) {
          const errorMessage =
            response?.message || "Failed to fetch enrollments";
          setError(errorMessage);
          setLoading(false);
          return;
        }

        const enrollments: Enrollment[] = response.data || [];

        if (enrollments.length === 0) {
          setEnrolledCourses([]);
          setStats({ totalEnrolled: 0, inProgress: 0, completed: 0 });
          setLoading(false);
          return;
        }

        const courses = enrollments.map((enrollment) => {
          const course = enrollment.course || ({} as Course);
          const instructor =
            typeof course.instructor === "object" && course.instructor
              ? course.instructor.name || "Instructor"
              : typeof course.instructor === "string"
                ? course.instructor
                : "Instructor";

          const totalLessons =
            course.modules?.reduce(
              (total, module) => total + (module.lessons?.length || 0),
              0,
            ) || 0;

          return {
            id: enrollment._id,
            courseId: course._id || enrollment.courseId,
            title:
              course.title ||
              enrollment.courseTitle ||
              "Course Title Not Available",
            instructor,
            thumbnail:
              getImageUrl(course.thumbnail || course.image) ||
              "https://via.placeholder.com/300x150?text=Course+Image",
            progress: enrollment.progress || 0,
            lastAccessed: enrollment.lastAccessed
              ? new Date(enrollment.lastAccessed).toLocaleDateString()
              : "Never",
            status: enrollment.status || "active",
            totalLessons,
            completedLessons: Math.floor(
              ((enrollment.progress || 0) / 100) *
                (totalLessons > 0 ? totalLessons : 1),
            ),
            duration: course.duration || "N/A",
          };
        });

        setEnrolledCourses(courses);

        setStats({
          totalEnrolled: courses.length,
          inProgress: courses.filter((c) => c.progress > 0 && c.progress < 100)
            .length,
          completed: courses.filter((c) => c.progress === 100).length,
        });
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to load your courses. Please try again later.");
        toast.error("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (auth?.currentUser) {
      fetchEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [auth?.currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My Learning
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full">
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Error Loading Courses
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!auth?.currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Your Learning
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign in to view your enrolled courses and track your learning
              progress.
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16 px-4">
      <SEO
        title="My Learning Dashboard | Eklabya"
        description="Track your enrolled courses, progress, and continue learning with Eklabya."
        keywords="my learning, dashboard, enrolled courses, online learning, eklabya"
      />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue learning from where you left off
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Enrolled Courses
            </h3>
            <p className="mt-2 text-3xl font-bold text-pink-600 dark:text-pink-400">
              {stats.totalEnrolled}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              In Progress
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Completed
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}
            </p>
          </div>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <FaBook className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Browse our courses and start learning today!
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col"
                >
                  <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-pink-600"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {course.instructor}
                    </p>

                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center">
                        <FaClock className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <FaCheckCircle className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                        {course.completedLessons} of {course.totalLessons}{" "}
                        lessons
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                        {Math.round(course.progress)}% Complete
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (course.status === "active") {
                          router.push(`/courses/${course.courseId}`);
                        } else {
                          toast(
                            "Your enrollment is pending approval. We'll notify you once approved.",
                            {
                              icon: "⏳",
                              style: {
                                borderRadius: "10px",
                                background: "#363636",
                                color: "#fff",
                              },
                            },
                          );
                        }
                      }}
                      className={`mt-3 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        course.status === "active"
                          ? "bg-pink-600 hover:bg-pink-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={course.status !== "active"}
                    >
                      {course.status === "active" ? (
                        <>
                          <FaPlay className="-ml-1 mr-2 h-4 w-4" />
                          {course.progress > 0
                            ? "Continue Learning"
                            : "Start Learning"}
                        </>
                      ) : (
                        "Enrollment Pending"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/courses"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 dark:bg-slate-700 dark:text-pink-300 dark:hover:bg-slate-600"
              >
                Browse More Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
