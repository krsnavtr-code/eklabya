"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import SEO from "../components/SEO";

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message =
    searchParams?.get("message") || "Your message has been sent successfully!";

  return (
    <>
      <SEO
        title="Thank You | Eklabya - Registration Successful"
        description="Thank you for registering with Eklabya! Your registration was successful. Check your email for further instructions."
        keywords="thank you, registration successful, Eklabya, online learning, course enrollment"
        robots="noindex, nofollow"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <FaCheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Thank You!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We&apos;ll get back to you soon.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
