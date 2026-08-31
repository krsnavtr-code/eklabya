"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaHome } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-white">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-pulse">
          404
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Page Not Found
        </h2>
        <p className="text-white/70 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Looks like you wandered into uncharted territory. The page you&apos;re
          looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <FaArrowLeft />
            Go Back
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <FaHome />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
