"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaSun,
  FaMoon,
  FaSearch,
  FaUser,
  FaTimes,
  FaBars,
  FaSignInAlt,
  FaChevronDown,
  FaChevronRight,
  FaPhoneAlt,
  FaEnvelope,
  FaCreditCard,
} from "react-icons/fa";
import { debounce } from "lodash";
import api from "../utils/api";
import CourseMenu from "./CourseMenu";
import { useAuth } from "../context/AuthContext";

// TypeScript interfaces
interface NavLink {
  to?: string;
  label: string;
  children?: { to: string; label: string }[];
}

interface Course {
  _id: string;
  slug?: string;
  title: string;
  category?: {
    name: string;
  };
}

interface SearchResults {
  courses: Course[];
  categories: any[];
}

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const logoImg =
    "http://eklabya.com/api/upload/file/eKlabya-fit-logo-8874.png";

  // --- State ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    courses: [],
    categories: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);

  const [theme, setTheme] = useState("light");

  // --- Refs ---
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  const mobilePaymentDropdownRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Initialize theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // Apply theme class immediately
    const element = document.documentElement;
    if (savedTheme === "dark") {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInsideProfileMenu =
        (profileMenuRef.current &&
          profileMenuRef.current.contains(event.target as Node)) ||
        (mobileProfileMenuRef.current &&
          mobileProfileMenuRef.current.contains(event.target as Node));

      const isInsidePaymentDropdown =
        (paymentDropdownRef.current &&
          paymentDropdownRef.current.contains(event.target as Node)) ||
        (mobilePaymentDropdownRef.current &&
          mobilePaymentDropdownRef.current.contains(event.target as Node));

      if (!isInsideProfileMenu) {
        setIsProfileMenuOpen(false);
      }

      if (!isInsidePaymentDropdown) {
        setShowPaymentDropdown(false);
      }

      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setIsDesktopSearchOpen(false);
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Search Logic ---
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults({ courses: [], categories: [] });
        return;
      }
      setIsSearching(true);
      try {
        const response = await api.get("/courses", {
          params: { search: query, limit: 5 },
        });

        // Handle different response structures
        let courses = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          courses = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          courses = response.data;
        } else if (Array.isArray(response)) {
          courses = response;
        }

        setSearchResults({
          courses: courses,
          categories: [],
        });
      } catch (error) {
        console.error("Search error", error);
        setSearchResults({ courses: [], categories: [] });
      } finally {
        setIsSearching(false);
      }
    }, 400),
    [],
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);
    handleSearch(query);
  };

  const navigateToCourse = (course: Course) => {
    const courseId = course.slug || course._id;
    if (courseId) {
      router.push(`/course/${courseId}`);
      setShowResults(false);
      setSearchQuery("");
      setIsMobileSearchOpen(false);
      setIsDesktopSearchOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setIsMobileSearchOpen(false);
      setIsDesktopSearchOpen(false);
    }
  };

  const navLinks = [
    { to: "/courses", label: "All Course" },
    { to: "/categories", label: "Categories" },
    { to: "/free-courses", label: "Free Course" },
    // { to: "/testimonials", label: "Testimonials" },
    // { to: "/scholarship", label: "Scholarship" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
    {
      label: "Achievements",
      children: [
        { to: "/awards-recognition", label: "Awards & Recognitions" },
        { to: "/news-events", label: "News & Events" },
        { to: "/success-stories", label: "Success Stories" },
        // { to: "/media-mentions", label: "Media Mentions" },
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full sticky top-0 z-50 text-black dark:text-white">
      {/* ==================================================================
          PART 1: TOP BAR (Utilities)
          Hidden on mobile, visible on desktop. Dark background.
      ================================================================== */}
      <div className="bg-white text-blue-700 dark:bg-gray-900 dark:text-orange-500 font-bold text-xs py-1 px-4 border-b border-blue-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left Side: Contact / Info */}
          <div className="hidden md:inline-flex items-center gap-4">
            {/* <a
              href="tel:+919891030303"
              className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
            >
              <FaPhoneAlt size={10} /> Call
            </a>
            <a
              href="mailto:info@eklabya.com"
              className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
            >
              <FaEnvelope size={10} /> Mail
            </a> */}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-4">
            {/* <a
              href="mailto:info@eklabya.com"
              className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
            >
              <FaEnvelope size={10} />
            </a>
            <a
              href="tel:+919891030303"
              className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
            >
              <FaPhoneAlt size={10} />
            </a> */}
          </div>

          {/* Right Side: Actions (Theme, Pay, Agent, Auth) */}
          <div className="hidden md:inline-flex items-center gap-2">
            {/* UG & PG Programmes Button For CollegeVihar */}
            <a
              href="https://collegevihar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-orange-600 text-xs uppercase tracking-wide whitespace-nowrap hover:text-blue-900 dark:hover:text-orange-300 hover:scale-105 transition-all duration-200"
            >
              UG, PG Programmes
            </a>

            <div className="h-3 w-px bg-blue-300 dark:bg-orange-600 mx-1"></div>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const newTheme = theme === "dark" ? "light" : "dark";
                setTheme(newTheme);

                const element = document.documentElement;
                if (newTheme === "dark") {
                  element.classList.add("dark");
                } else {
                  element.classList.remove("dark");
                }
                localStorage.setItem("theme", newTheme);
              }}
              className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
            >
              {theme === "dark" ? <FaSun size={12} /> : <FaMoon size={12} />}
              <span>{theme === "dark" ? "" : ""}</span>
            </button>

            <div className="h-3 w-px bg-blue-300 dark:bg-orange-600 mx-1"></div>

            {/* Agent Register */}
            <a
              href="https://genlead.in/agent/register"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
            >
              Agent Register
            </a>

            <div className="h-3 w-px bg-blue-300 dark:bg-orange-600 mx-1"></div>

            {/* SMART Board */}
            {/* <Link
              href="/smart-board"
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              SMART Board
            </Link> */}
           

            {/* Payment Dropdown (Small Version) */}
            <div className="relative" ref={paymentDropdownRef}>
              <button
                onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
              >
                <FaCreditCard size={12} /> Make Payment{" "}
                <FaChevronDown size={8} />
              </button>
              {showPaymentDropdown && (
                <div className="absolute right-0 top-6 w-80 bg-white text-gray-800 rounded shadow-xl border border-gray-100 z-50">
                  <button className="text-left px-3 py-2 bg-blue-200 rounded m-4 text-lg hover:bg-blue-50 flex items-center justify-between">
                    <span>
                      Pay Using{" "}
                      <span className="text-orange-600">RazorPay</span>
                    </span>
                  </button>

                  <div className="bg-white border-t border-gray-200 px-6 py-2 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      Pay Using Bank Transfer
                    </h2>

                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between border-y py-2">
                        <span className="font-medium">Bank Name</span>
                        <strong>Yes Bank</strong>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Account Number</span>
                        <strong>020861900007608</strong>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">IFSC Code</span>
                        <strong>YESB0000208</strong>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Branch</span>
                        <strong>Okhla Phase II , Delhi</strong>
                      </div>
                    </div>

                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-xl p-2">
                      <p className="text-sm text-yellow-700">
                        After payment, please share your transaction ID or
                        payment screenshot for verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-3 w-px bg-blue-300 dark:bg-orange-600 mx-1"></div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 hover:text-blue-900 dark:hover:text-orange-300 font-semibold"
                >
                  <FaUser size={10} />
                  {currentUser?.name?.split(" ")[0] ||
                    currentUser?.fullname?.split(" ")[0] ||
                    "My Account"}
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 text-sm text-gray-700 dark:text-gray-200 z-50 animate-fade-in-down">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-blue-300/50">
                      <p className="font-semibold">
                        {currentUser?.name || currentUser?.fullname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser?.email}
                      </p>
                    </div>
                    <Link
                      href="/my-learning"
                      className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-blue-300"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      My Learning
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-blue-300"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                        router.push("/");
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
              >
                <FaSignInAlt size={10} />
                Login
              </Link>
            )}
          </div>

          {/* mobile Right Side: Actions (Theme, Pay, Agent, Auth) */}
          <div className="md:hidden flex items-center gap-1">
            {/* UG & PG Programmes Button For CollegeVihar */}
            <a
              href="https://collegevihar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-orange-600 text-[10px] uppercase tracking-wide whitespace-nowrap hover:text-blue-900 dark:hover:text-orange-300 hover:scale-105 transition-all duration-200"
            >
              UG, PG Programmes
            </a>

            <div className="h-3 w-px bg-blue-300 dark:bg-orange-600"></div>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const newTheme = theme === "dark" ? "light" : "dark";
                setTheme(newTheme);

                const element = document.documentElement;
                if (newTheme === "dark") {
                  element.classList.add("dark");
                } else {
                  element.classList.remove("dark");
                }
                localStorage.setItem("theme", newTheme);
              }}
              className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
            >
              {theme === "dark" ? <FaSun size={12} /> : <FaMoon size={12} />}
              <span>{theme === "dark" ? "" : ""}</span>
            </button>

            {/* <div className="h-3 w-px bg-blue-300 dark:bg-orange-600"></div> */}

            {/* Agent Register */}
            {/* <a
              href="https://genlead.in/agent/register"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
            >
              Agent Register
            </a> */}

            <div className="h-3 w-px bg-blue-300 dark:bg-orange-600"></div>

            {/* Payment Dropdown (Small Version) */}
            <div className="relative" ref={mobilePaymentDropdownRef}>
              <button
                onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-orange-300 transition-colors"
              >
                Pay <FaChevronDown size={8} />
              </button>
              {showPaymentDropdown && (
                <div className="absolute right-[-20px] top-6 w-64 bg-white text-gray-800 rounded shadow-xl border border-gray-100 z-50">
                  <button className="text-left px-3 py-2 bg-blue-200 rounded m-4 text-lg hover:bg-blue-50 flex items-center justify-between">
                    <span>
                      Pay Using{" "}
                      <span className="text-orange-600">RazorPay</span>
                    </span>
                  </button>

                  <div className="bg-white border-t border-gray-200 px-6 py-2 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-800 mb-2">
                      Pay Using Bank & UPI
                    </h2>

                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between border-y py-2">
                        <span className="font-medium">Bank Name</span>
                        <strong>IndusInd Bank</strong>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Account Number</span>
                        <strong>201037792463</strong>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">IFSC Code</span>
                        <strong>INDB0000588</strong>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Branch</span>
                        <strong>Noida Sector 62</strong>
                      </div>
                    </div>

                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-xl p-2">
                      <p className="text-sm text-yellow-700">
                        After payment, please share your transaction ID or
                        payment screenshot for verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-3 w-px bg-blue-300 dark:bg-orange-600 mx-1"></div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative" ref={mobileProfileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 hover:text-blue-900 dark:hover:text-orange-300 font-semibold"
                >
                  <FaUser size={10} />
                  {currentUser?.name?.split(" ")[0] ||
                    currentUser?.fullname?.split(" ")[0] ||
                    ""}
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 text-sm text-gray-700 dark:text-gray-200 z-50 animate-fade-in-down">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-blue-300/50">
                      <p className="font-semibold">
                        {currentUser?.name || currentUser?.fullname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser?.email}
                      </p>
                    </div>
                    <Link
                      href="/my-learning"
                      className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-blue-300"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      My Learning
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-blue-300"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                        router.push("/");
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
              >
                <FaSignInAlt size={10} />{" "}
                <span className="">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================
          PART 2: BOTTOM BAR (Main Navigation)
          White background, bigger height, contains Logo, Links, Search.
      ================================================================== */}
      <div
        className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"
        ref={desktopSearchRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 md:h-12 gap-2">
            {/* 1. Logo */}
            <div className="flex-shrink-0 flex items-center gap-1">
              {/* Mobile Toggle (Left of logo on mobile) */}
              <button
                className="md:hidden mr-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={22} />
                ) : (
                  <FaBars size={22} />
                )}
              </button>
              <Link
                href="/"
                className="text-lg font-bold text-blue-600 dark:text-blue-400"
              >
                <img
                  src={logoImg}
                  alt="eklabya – Your Online Learning Partner"
                  className="h-10 rounded"
                />
              </Link>
            </div>

            {/* 2. Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <div className="relative group">
                <CourseMenu />
              </div>
              {navLinks.map((link) => {
                if (link.children) {
                  return (
                    <div key={link.label} className="relative group py-2">
                      <button className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center gap-1">
                        {link.label}
                        <FaChevronDown
                          size={10}
                          className="transition-transform duration-200 group-hover:rotate-180"
                        />
                      </button>
                      <div className="absolute top-full left-0 pt-1 w-48 z-50 hidden group-hover:block">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 flex flex-col">
                          {link.children.map((child) => (
                            <Link
                              key={child.to}
                              href={child.to}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                const isActive = pathname === link.to;
                return (
                  <Link
                    key={link.to!}
                    href={link.to!}
                    className={`text-sm font-semibold transition-all duration-300 relative ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-100 transition-transform duration-300"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* 3. Search Icon & Mobile Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop Search Toggle */}
              <button
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsDesktopSearchOpen(!isDesktopSearchOpen)}
                aria-label="Toggle search"
              >
                {isDesktopSearchOpen ? (
                  <FaTimes size={18} />
                ) : (
                  <FaSearch size={18} />
                )}
              </button>

              {/* Mobile Search Icon */}
              <button
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                aria-label="Toggle search"
              >
                {isMobileSearchOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaSearch size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Search Bar (Expandable) */}
        {isDesktopSearchOpen && (
          <div className="hidden lg:flex absolute left-0 right-0 top-full justify-center px-4 z-50">
            <div className="w-full max-w-3xl mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
              <div className="p-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    Find what you need
                  </h3>
                  <button
                    onClick={() => setIsDesktopSearchOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close search"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="What do you want to learn?"
                    value={searchQuery}
                    onChange={onSearchChange}
                    onFocus={() => setShowResults(true)}
                    className="w-full pl-12 pr-4 py-1.5 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-base transition-all"
                    autoFocus
                  />
                  <FaSearch
                    className="absolute left-4 top-2.5 text-gray-400"
                    size={18}
                  />
                </form>

                {showResults && searchQuery && (
                  <div className="mt-4 max-h-72 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : searchResults.courses.length > 0 ? (
                      <div className="space-y-1">
                        <div className="px-1 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Top Results
                        </div>
                        {searchResults.courses.map((course: any) => (
                          <button
                            key={course._id}
                            onClick={() => navigateToCourse(course)}
                            className="w-full text-left px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center gap-3 group transition-colors"
                          >
                            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                              <FaSearch size={12} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600">
                                {course.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {course.category?.name || "General"}
                              </p>
                            </div>
                          </button>
                        ))}
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                          <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            onClick={() => setIsDesktopSearchOpen(false)}
                            className="block w-full text-center py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                          >
                            View all results
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-gray-500">
                        <p>No courses found for &quot;{searchQuery}&quot;</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search Bar (Expandable) */}
        {isMobileSearchOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full z-40 px-4">
            <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mt-2">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
              <div className="p-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    Find what you need
                  </h3>
                  <button
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close search"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="w-full pl-10 pr-4 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    autoFocus
                  />
                  <FaSearch className="absolute left-3.5 top-2.5 text-gray-400" />
                </form>

                {showResults && searchQuery && (
                  <div className="mt-3 max-h-64 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : searchResults.courses.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.courses.map((course: any) => (
                          <button
                            key={course._id}
                            onClick={() => navigateToCourse(course)}
                            className="w-full text-left px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900"
                          >
                            {course.title}
                          </button>
                        ))}
                        <Link
                          href={`/search?q=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setIsMobileSearchOpen(false)}
                          className="block w-full text-center py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors mt-2"
                        >
                          View all results
                        </Link>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        <p>No courses found for &quot;{searchQuery}&quot;</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================
          MOBILE MENU OVERLAY
          Combines Top Bar and Bottom Bar items for mobile users
      ================================================================== */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 w-[85%] max-w-[350px] bg-white dark:bg-gray-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-1 pb-5 px-3">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold">
              <span style={{ color: "#1E90FF" }}>e</span>
              <span style={{ color: "#F47C26" }}>KLABYA</span>
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-gray-500"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* User Info (Mobile) */}
          {isAuthenticated ? (
            <div className="mb-3 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-3">
              <div>
                <p className="font-bold text-sm">{currentUser?.fullname}</p>
                <p className="text-xs">{currentUser?.email}</p>
              </div>
            </div>
          ) : (
            <div className="mb-6 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="text-center py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-center py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Small Screen Payment option */}
          <div className="mb-1" ref={mobilePaymentDropdownRef}>
            <button
              onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FaCreditCard size={14} /> Make Payment
              </span>
              <FaChevronDown
                size={10}
                className={`transition-transform ${showPaymentDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showPaymentDropdown && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button className="w-full text-left px-2 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Pay Using <span className="text-orange-600">RazorPay</span>
                  </span>
                  <FaChevronRight size={12} className="text-gray-400" />
                </button>

                <div className="px-2 py-3">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
                    Pay Using Bank Transfer
                  </h3>

                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">
                        Bank Name
                      </span>
                      <span className="font-medium">Yes Bank</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">
                        Account Number
                      </span>
                      <span className="font-medium">020861900007608</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">
                        IFSC Code
                      </span>
                      <span className="font-medium">YESB0000208</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">
                        Branch
                      </span>
                      <span className="font-medium">Okhla Phase II , Delhi</span>
                    </div>
                  </div>

                  <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      After payment, please share your transaction ID or payment
                      screenshot for verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 mb-6">
            <Link
              href="/"
              className="block py-2 font-medium bg-gray-200 dark:bg-gray-800 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="">
              <CourseMenu
                isMobile={true}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="space-y-1">
                  <div className="px-2 py-2 font-medium rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    {link.label}
                  </div>
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      href={child.to}
                      className="flex items-center font-medium rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.to!}
                  href={link.to!}
                  className={`flex items-center font-medium rounded-lg bg-gray-200 dark:bg-gray-800 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}

            <a
              href="https://genlead.in/agent/register"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center font-medium rounded-lg bg-gray-200 dark:bg-gray-800 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Agent Register
            </a>

            {isAuthenticated && (
              <>
                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                <Link
                  href="/my-learning"
                  className="block px-3 py-2 bg-gray-200 dark:bg-gray-800 font-medium hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Learning
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 bg-gray-200 dark:bg-gray-800 font-medium hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}
          </div>

          {/* Mobile Footer Actions (From Top Bar) */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-3">
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                  router.push("/");
                }}
                className="flex items-center gap-3 text-red-600 font-medium text-sm w-full"
              >
                <FaSignInAlt className="rotate-180" /> Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
