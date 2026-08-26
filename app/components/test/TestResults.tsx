"use client";

import { useRouter } from "next/navigation";
import { FaHome, FaTrophy, FaTimesCircle } from "react-icons/fa";

interface TestResultsProps {
  score: number;
  totalQuestions: number;
  onRetry?: () => void;
}

export default function TestResults({
  score,
  totalQuestions,
  onRetry,
}: TestResultsProps) {
  const router = useRouter();
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const isPassing = percentage >= 70;

  const themeColor = isPassing
    ? "text-green-600 bg-green-50 border-green-200"
    : "text-red-600 bg-red-50 border-red-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all">
        <div className="px-8 py-12 sm:px-12 text-center flex flex-col items-center">
          <div
            className={`mb-8 p-5 rounded-full ${
              isPassing ? "bg-green-100" : "bg-red-100"
            } shadow-sm`}
          >
            {isPassing ? (
              <FaTrophy className="text-5xl" style={{ color: "#16a34a" }} />
            ) : (
              <FaTimesCircle
                className="text-5xl"
                style={{ color: "#dc2626" }}
              />
            )}
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {isPassing ? "Congratulations!" : "Keep Practicing"}
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            {isPassing
              ? "You have successfully passed the scholarship evaluation. Excellent work!"
              : "You didn't meet the passing criteria this time. Don't give up, review the material and try again."}
          </p>

          <div
            className={`w-full max-w-xl py-8 rounded-2xl border ${themeColor} mb-10 shadow-sm`}
          >
            <div className="text-sm font-bold uppercase tracking-wider opacity-70 mb-2">
              Your Final Score
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span
                className={`text-6xl font-black ${
                  isPassing ? "text-green-600" : "text-red-600"
                }`}
              >
                {score}
              </span>
              <span className="text-gray-400 font-semibold text-3xl">
                / {totalQuestions}
              </span>
            </div>
            <div className="mt-4">
              <span
                className={`inline-block px-4 py-2 rounded-full text-base font-bold shadow-sm ${
                  isPassing
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {percentage}% Score
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
            <button
              onClick={() => router.push("/")}
              className="flex-1 flex items-center justify-center gap-3 py-4 px-6 border-2 border-gray-200 shadow-sm text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <FaHome className="text-lg" />
              Back to Home
            </button>
            {!isPassing && onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 border-2 border-blue-200 shadow-sm text-base font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md transition-all"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
