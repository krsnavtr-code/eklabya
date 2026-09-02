"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

export default function SuspendedAccountPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <SEO
        title="Account Suspended | Eklabya"
        description="Your Eklabya account has been suspended. Please contact support for assistance."
        keywords="account suspended, support, eklabya"
      />
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Account Suspended
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your account has been deactivated. Please contact support for
          assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:support@eklabya.com"
            className="inline-flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Support
          </a>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center py-2 px-6 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
