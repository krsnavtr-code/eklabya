"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaExternalLinkAlt,
  FaSearch,
  FaNewspaper,
  FaBullhorn,
  FaUsers,
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
  FaGraduationCap,
  FaLaptopCode,
  FaAward,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { submitContactForm } from "../api/contactApi";
import SEO from "../components/SEO";

interface NewsOrEvent {
  id: string;
  type: "event" | "workshop" | "webinar" | "news" | "hackathon";
  category: "upcoming" | "past" | "news";
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  mode?: "Online / Virtual" | "Hybrid" | "In-Person";
  speaker?: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
  publisher?: string;
  publisherLogo?: string;
  image?: string;
  tag: string;
  featured?: boolean;
  externalLink?: string;
  registrationOpen?: boolean;
  attendeesCount?: number;
}

const defaultEvents: NewsOrEvent[] = [
  {
    id: "event-1",
    type: "webinar",
    category: "upcoming",
    title: "AI in Enterprise: Building Next-Gen Generative AI Applications",
    description:
      "Join senior AI architects from top tech firms to discover how enterprises deploy generative AI systems, RAG pipelines, and LLM fine-tuning in production environments.",
    date: "2026-09-15",
    time: "06:00 PM - 07:30 PM IST",
    location: "Live Interactive Session",
    mode: "Online / Virtual",
    speaker: {
      name: "Dr. Rohit Saxena",
      role: "Chief AI Architect",
      company: "Cognitive Labs",
    },
    tag: "Artificial Intelligence",
    featured: true,
    registrationOpen: true,
    attendeesCount: 420,
  },
  {
    id: "event-2",
    type: "workshop",
    category: "upcoming",
    title: "Mastering Cloud Architecture & DevOps CI/CD on AWS",
    description:
      "A hands-on, live 2-day workshop designed for software engineers. Learn containerization with Docker, Kubernetes orchestration, and multi-region deployment automation.",
    date: "2026-09-22",
    time: "11:00 AM - 03:00 PM IST",
    location: "Online Workshop + Lab Access",
    mode: "Online / Virtual",
    speaker: {
      name: "Sneha Kapoor",
      role: "Principal Cloud Consultant",
      company: "Amazon Web Services Partner",
    },
    tag: "Cloud & DevOps",
    featured: false,
    registrationOpen: true,
    attendeesCount: 280,
  },
  {
    id: "event-3",
    type: "hackathon",
    category: "upcoming",
    title: "Eklabya National Innovation Hackathon 2026",
    description:
      "Compete with over 3,000 developers, data scientists, and designers across India. Solve real-world industry challenges and win cash prizes worth INR 2,50,000 + placement interviews.",
    date: "2026-10-05",
    time: "48-Hour Virtual Hackathon",
    location: "Virtual & Eklabya Tech Hub",
    mode: "Hybrid",
    tag: "Hackathon",
    featured: true,
    registrationOpen: true,
    attendeesCount: 1540,
  },
  {
    id: "event-4",
    type: "news",
    category: "news",
    title:
      "Eklabya Partners with NSDC & NIELIT to Fast-Track Industry Certifications",
    description:
      "In a major leap for skill development, Eklabya has joined forces with government skill bodies to offer verifiable credentials that bridge the tech industry employability gap.",
    date: "2026-08-10",
    publisher: "Education Technology Today",
    tag: "Partnership & Growth",
    externalLink: "https://www.eklabya.com",
    featured: false,
  },
  {
    id: "event-5",
    type: "news",
    category: "news",
    title:
      "Over 98% Placement Rate Recorded for Summer 2026 Graduating Cohorts",
    description:
      "Eklabya alumni secure high-impact roles across leading Fortune 500 tech companies and hyper-growth unicorns in full-stack, data analytics, and cloud engineering.",
    date: "2026-07-28",
    publisher: "Tech Digest India",
    tag: "Placements",
    externalLink: "https://www.eklabya.com",
    featured: false,
  },
  {
    id: "event-6",
    type: "event",
    category: "past",
    title: "Future of Web3 & Full Stack Development Summit 2026",
    description:
      "A comprehensive global summit featuring 12 keynote speakers exploring reactive frontends, microservices, and decentralized database architectures.",
    date: "2026-06-18",
    time: "Full Day Summit",
    location: "Virtual Auditorium",
    mode: "Online / Virtual",
    tag: "Tech Summit",
    featured: false,
    attendeesCount: 2100,
  },
  {
    id: "event-7",
    type: "workshop",
    category: "past",
    title: "Data Science & Big Data Pipeline Bootcamp with Apache Spark",
    description:
      "A 3-day deep dive into scalable data processing, feature engineering, and deploying machine learning models into live streaming clusters.",
    date: "2026-05-12",
    time: "Recorded Masterclass Available",
    location: "Eklabya On-Demand Lab",
    mode: "Online / Virtual",
    tag: "Data Science",
    featured: false,
    attendeesCount: 650,
  },
];

const categoryTabs = [
  { id: "all", label: "All Happenings" },
  { id: "upcoming", label: "Upcoming Events & Webinars" },
  { id: "news", label: "News & Press Releases" },
  { id: "workshops", label: "Workshops & Masterclasses" },
  { id: "past", label: "Past Events & Recordings" },
];

export default function NewsAndEventsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<NewsOrEvent[]>(defaultEvents);
  const [loading, setLoading] = useState(false);

  // RSVP Modal State
  const [selectedEvent, setSelectedEvent] = useState<NewsOrEvent | null>(null);
  const [rsvpData, setRsvpData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
  });
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Fetch real media mentions from backend if available
  useEffect(() => {
    const fetchMediaMentions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/media-mentions", {
          params: { limit: 20 },
        });

        const mentions =
          response?.data?.data?.mentions || response?.data?.mentions || [];

        if (Array.isArray(mentions) && mentions.length > 0) {
          const formattedNews: NewsOrEvent[] = mentions.map((m: any) => ({
            id: m._id || m.slug,
            type: "news",
            category: "news",
            title: m.title,
            description: m.shortDescription || m.description || "",
            date: m.publishedDate || new Date().toISOString(),
            publisher: m.publisherName || "Press Release",
            publisherLogo: m.publisherLogo,
            externalLink: m.externalLink || m.mediaUpload || "",
            tag:
              m.newsType === "press_release"
                ? "Press Release"
                : "Media Mention",
            featured: Boolean(m.isFeatured),
          }));

          // Merge without duplicate titles
          setItems((prev) => {
            const existingTitles = new Set(
              formattedNews.map((n) => n.title.toLowerCase()),
            );
            const nonDuplicateDefaults = defaultEvents.filter(
              (d) => !existingTitles.has(d.title.toLowerCase()),
            );
            return [...formattedNews, ...nonDuplicateDefaults];
          });
        }
      } catch (err) {
        // Fallback gracefully to default curated events
        console.warn(
          "Could not fetch media mentions, using default events:",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMediaMentions();
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    // Tab filter
    if (activeTab === "upcoming" && item.category !== "upcoming") return false;
    if (activeTab === "news" && item.category !== "news") return false;
    if (activeTab === "workshops" && item.type !== "workshop") return false;
    if (activeTab === "past" && item.category !== "past") return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTag = item.tag.toLowerCase().includes(q);
      const matchSpeaker = item.speaker?.name.toLowerCase().includes(q);
      const matchPublisher = item.publisher?.toLowerCase().includes(q);
      return (
        matchTitle || matchDesc || matchTag || matchSpeaker || matchPublisher
      );
    }

    return true;
  });

  const featuredItem =
    items.find((item) => item.featured && item.category === "upcoming") ||
    items[0];

  const handleOpenRSVP = (event: NewsOrEvent) => {
    setSelectedEvent(event);
    setRsvpSuccess(false);
    setRsvpData({ name: "", email: "", phone: "", organization: "" });
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.name || !rsvpData.email || !rsvpData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmittingRsvp(true);
    try {
      const submissionData = {
        name: rsvpData.name,
        email: rsvpData.email,
        phone: rsvpData.phone,
        message: `RSVP Registration for Event: ${selectedEvent?.title} | Organization: ${rsvpData.organization || "N/A"}`,
        courseTitle: selectedEvent?.title || "Event Registration",
        subject: `Event RSVP - ${selectedEvent?.title}`,
      };

      const res = await submitContactForm(submissionData);
      if (res.success) {
        setRsvpSuccess(true);
        toast.success(
          "RSVP Successful! You will receive confirmation details via Email & SMS.",
        );
      } else {
        toast.error(res.message || "Failed to submit RSVP. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit RSVP. Please try again.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "webinar":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800";
      case "workshop":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800";
      case "hackathon":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800";
      case "news":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <SEO
        title="News & Events | Eklabya"
        description="Stay updated with the latest news, webinars, workshops, and events from Eklabya."
        keywords="news, events, webinars, workshops, eklabya, announcements"
      />
      {/* --- HERO HEADER --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 text-white py-6 md:py-8 px-3 sm:px-4 lg:px-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Eklabya Live Pulse
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            News &amp; Events
          </h1>

          <p className="max-w-7xl mx-auto text-sm sm:text-base md:text-lg text-blue-100/90 font-medium leading-relaxed">
            Stay ahead with live webinars, expert masterclasses, hackathons, and
            the latest official press announcements from Eklabya.
          </p>

          {/* Quick Metrics */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                50+
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                Live Webinars Held
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                25k+
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                Community Attendees
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                100+
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                Industry Mentors
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                98%
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                Satisfaction Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-12">
        {/* --- SPOTLIGHT FEATURED BANNER --- */}
        {featuredItem && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="bg-rose-500 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
                    Featured Spotlight
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getTypeBadgeClass(featuredItem.type)}`}
                  >
                    {featuredItem.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <FaCalendarAlt className="text-blue-500" />{" "}
                    {formatDate(featuredItem.date)}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {featuredItem.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 leading-relaxed">
                  {featuredItem.description}
                </p>

                {featuredItem.speaker && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {featuredItem.speaker.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {featuredItem.speaker.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {featuredItem.speaker.role} •{" "}
                        {featuredItem.speaker.company}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                {featuredItem.registrationOpen ? (
                  <button
                    onClick={() => handleOpenRSVP(featuredItem)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Reserve Free Seat</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                ) : featuredItem.externalLink ? (
                  <a
                    href={featuredItem.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
                  >
                    <span>Read Full Article</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                ) : null}

                <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <FaUsers className="text-emerald-500" />
                  <span>
                    {featuredItem.attendeesCount || 350}+ registered already
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTROLS: TABS & SEARCH BAR --- */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categoryTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "bg-white dark:bg-gray-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200/80 dark:border-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] md:min-w-[300px]">
              <FaSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, speakers, news..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* --- GRID OF NEWS & EVENTS --- */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-lg">
              <FaSearch />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching events or articles found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or select another category filter
              above.
            </p>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="mt-2 inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isPast = item.category === "past";
              const isNews = item.type === "news";

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Row: Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${getTypeBadgeClass(item.type)}`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-500 text-xs" />
                        {formatDate(item.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-800 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata Section */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {item.time && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <FaClock className="text-slate-400 shrink-0 text-xs" />
                          <span className="truncate">{item.time}</span>
                        </div>
                      )}

                      {item.mode && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          {item.mode.includes("Online") ? (
                            <FaVideo className="text-purple-500 shrink-0 text-xs" />
                          ) : (
                            <FaMapMarkerAlt className="text-rose-500 shrink-0 text-xs" />
                          )}
                          <span className="truncate">
                            {item.location || item.mode}
                          </span>
                        </div>
                      )}

                      {item.speaker && (
                        <div className="flex items-center gap-2 pt-1 text-slate-700 dark:text-slate-300 font-medium">
                          <FaGraduationCap className="text-blue-500 shrink-0" />
                          <span className="truncate">
                            {item.speaker.name} ({item.speaker.company})
                          </span>
                        </div>
                      )}

                      {item.publisher && (
                        <div className="flex items-center gap-2 pt-1 text-slate-700 dark:text-slate-300 font-medium">
                          <FaNewspaper className="text-emerald-500 shrink-0" />
                          <span className="truncate">
                            Published in: {item.publisher}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-6 py-4 bg-slate-50/80 dark:bg-gray-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      #{item.tag}
                    </span>

                    {item.registrationOpen ? (
                      <button
                        onClick={() => handleOpenRSVP(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-all"
                      >
                        <span>Register Free</span>
                        <FaArrowRight className="text-[10px]" />
                      </button>
                    ) : item.externalLink ? (
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                      >
                        <span>Read Coverage</span>
                        <FaExternalLinkAlt className="text-[10px]" />
                      </a>
                    ) : isPast ? (
                      <button
                        onClick={() => handleOpenRSVP(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-300 hover:text-blue-600 transition-colors"
                      >
                        <span>Request Access</span>
                        <FaArrowRight className="text-[10px]" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- NEWSLETTER & COMMUNITY SECTION --- */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-blue-100">
              <FaBullhorn /> Event Broadcast
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Never Miss a Masterclass or Press Announcement
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Join over 40,000+ engineers, students, and professionals getting
              weekly invitations to live tech sessions, career roadmaps, and
              industry updates.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(
                  "Subscribed successfully! Watch your inbox for upcoming invites.",
                );
              }}
              className="flex flex-col sm:flex-row gap-2.5 pt-3"
            >
              <input
                type="email"
                required
                placeholder="Enter your professional email"
                className="w-full sm:w-80 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                Join Event Alerts
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* --- RSVP & REGISTRATION MODAL --- */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>

            {rsvpSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl border border-emerald-300 dark:border-emerald-800">
                  <FaCheckCircle />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Registration Confirmed!
                </h3>
                <p className="text-xs text-slate-800 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                  You are registered for <strong>{selectedEvent.title}</strong>.
                  A calendar invite with direct meeting link will arrive in your
                  email shortly.
                </p>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-1 mb-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${getTypeBadgeClass(selectedEvent.type)}`}
                    >
                      {selectedEvent.type}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {formatDate(selectedEvent.date)}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fill out the form below to secure your live session access.
                  </p>
                </div>

                <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpData.name}
                      onChange={(e) =>
                        setRsvpData({ ...rsvpData, name: e.target.value })
                      }
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={rsvpData.email}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, email: e.target.value })
                        }
                        placeholder="you@email.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone / WhatsApp{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={rsvpData.phone}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, phone: e.target.value })
                        }
                        placeholder="+91 9876543210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      College / Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={rsvpData.organization}
                      onChange={(e) =>
                        setRsvpData({
                          ...rsvpData,
                          organization: e.target.value,
                        })
                      }
                      placeholder="e.g. ABC University / XYZ Corp"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    By submitting, you agree to receive session reminders via
                    WhatsApp/Email.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-70 transition-all"
                  >
                    {isSubmittingRsvp
                      ? "Submitting Registration..."
                      : "Confirm Free Registration"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
