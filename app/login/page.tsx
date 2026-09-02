"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import { forgotPassword, verifyAdminOTP } from "../api/userApi";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setUserFromTokens, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const redirect = searchParams?.get("redirect") || "/";
  const error = searchParams?.get("error");
  const messageParam = searchParams?.get("message");

  useEffect(() => {
    if (error === "not_approved") {
      setMessage(
        "Your account is pending admin approval. Please contact support.",
      );
    } else if (error === "account_suspended") {
      setMessage("Your account has been deactivated. Please contact support.");
    }
  }, [error]);

  useEffect(() => {
    if (messageParam) setMessage(messageParam);
  }, [messageParam]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email address";
      }
    }
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);
      if (result?.requiresOTP) {
        setShowOTP(true);
        setAdminEmail(result.email);
        toast.success("OTP sent to your email for admin verification");
        return;
      }
      if (result?.success && result?.user) {
        const redirectTo =
          result.user.role === "admin" ? "/admin/dashboard" : redirect;
        toast.success("Login successful!");
        router.replace(redirectTo);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsVerifyingOTP(true);
    try {
      const response = await verifyAdminOTP(adminEmail, otp);
      if (response.success) {
        setUserFromTokens(response.token, response.refreshToken, response.user);
        toast.success("Admin login verified successfully!");
        router.replace("/admin/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error?.message || "OTP verification failed. Please try again.",
      );
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setIsSendingReset(true);
    try {
      const response = await forgotPassword(forgotEmail.trim().toLowerCase());
      toast.success(
        response.message || "Password reset email sent successfully!",
      );
      setShowForgotPassword(false);
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to send reset email. Please try again.",
      );
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <>
      <SEO
        title="Eklabya Login | Access Your Learning Dashboard"
        description="Log in to your Eklabya account to access courses, learning resources and your personalized dashboard to continue your learning journey."
        keywords="Eklabya login, Eklabya student login, student dashboard, online learning login, access courses, Eklabya courses, learning dashboard, online courses"
        robots="noindex, nofollow"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-blue-500 p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-orange-500 to-blue-500 text-white flex flex-col justify-center p-8 relative">
            <Link href="/" className="text-white absolute top-4 left-8">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 1.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 9.414V17a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1V9.414l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold mb-4">Welcome to Eklabya</h1>
            <p className="text-sm opacity-90">
              To make high-quality education accessible online, helping learners
              gain practical, job-ready skills in trending domains.
            </p>
          </div>
          <div className="p-8 flex flex-col justify-center">
            {message && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  error
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {message}
              </div>
            )}
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
              Login to your account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showOTP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Admin Login Verification
            </h3>
            <p className="text-gray-600 mb-4">
              Enter the OTP sent to your email for admin verification.
            </p>
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                  }}
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-2xl tracking-widest"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOTP(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOTP || otp.length !== 6}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Reset Password
            </h3>
            <p className="text-gray-600 mb-4">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {isSendingReset ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-blue-500 p-4 text-white">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
