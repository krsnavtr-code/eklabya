"use client";

import Link from "next/link";
import SEO from "../components/SEO";

export default function InactiveAccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Account Inactive | Eklabya"
        description="Your Eklabya account is currently inactive. Contact support for assistance."
        keywords="account inactive, support, eklabya"
      />
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Account Inactive
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Your account is currently inactive. Please contact support for
            assistance.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
