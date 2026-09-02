"use client";

import { useEffect, useState } from "react";
import {
  FaTrophy,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaSearch,
  FaAward,
  FaMedal,
  FaCrown,
  FaStar,
  FaCheckCircle,
  FaTimes,
  FaBuilding,
  FaUserTie,
  FaCertificate,
  FaArrowRight,
} from "react-icons/fa";
import { getAwards, getFeaturedAward } from "../api/awardApi";
import SEO from "../components/SEO";

interface Award {
  _id: string;
  title: string;
  description?: string;
  awardCategory?: string;
  awardDate?: string;
  organizationName?: string;
  organizationLogo?: string;
  awardImage?: string;
  recipientName?: string;
  recipientRole?: string;
  externalLink?: string;
}

const demoFeaturedAward: Award = {
  _id: "demo-feat-1",
  title:
    "National Education Excellence Award for Best Technical Upskilling 2026",
  description:
    "Honored for groundbreaking curriculum innovation, 98% placement track record, and delivering industry-aligned practical mastery in Artificial Intelligence, SAP, Cloud, and Full Stack Engineering.",
  awardCategory: "excellence",
  awardDate: "2026-03-15",
  organizationName:
    "Federation of Indian Education & Industry Councils (FICCI & WEC)",
  recipientName: "Eklabya Institute of Technology",
  recipientRole: "Academic Excellence Council",
  externalLink: "https://www.eklabya.com",
};

const demoAwards: Award[] = [
  {
    _id: "demo-1",
    title: "EdTech Innovation & Curriculum Leadership Award 2025",
    description:
      "Recognized for interactive virtual cloud labs and live industrial capstone modules that accelerate graduate employability in modern tech careers.",
    awardCategory: "innovation",
    awardDate: "2025-11-20",
    organizationName: "Global Education Innovation Summit",
    recipientName: "Eklabya Learning Systems",
    recipientRole: "Curriculum Design Team",
    externalLink: "https://www.eklabya.com",
  },
  {
    _id: "demo-2",
    title: "Best Enterprise Upskilling & Corporate Training Partner 2025",
    description:
      "Awarded for successfully training over 12,000 corporate professionals across leading multinational firms in SAP, DevOps, and Machine Learning.",
    awardCategory: "partnership",
    awardDate: "2025-08-14",
    organizationName: "National HR & Talent Development Forum",
    recipientName: "Eklabya Corporate Training Division",
    recipientRole: "Enterprise Solutions",
    externalLink: "https://www.eklabya.com",
  },
  {
    _id: "demo-3",
    title: "Top Emerging Tech Academy of the Year 2024",
    description:
      "Conferred for exceptional growth, consistent student satisfaction rating of 4.9/5, and high placement compensation outcomes across top tech enterprises.",
    awardCategory: "achievement",
    awardDate: "2024-12-05",
    organizationName: "Indian Tech & Skill Leadership Council",
    recipientName: "Eklabya",
    recipientRole: "Founding Board",
    externalLink: "https://www.eklabya.com",
  },
  {
    _id: "demo-4",
    title: "Outstanding Leadership in Digital Skills Transformation 2024",
    description:
      "Awarded in recognition of continuous efforts to bridge the talent gap between academic curricula and rapidly evolving corporate engineering requirements.",
    awardCategory: "leadership",
    awardDate: "2024-06-18",
    organizationName: "Asia-Pacific Digital Education Forum",
    recipientName: "Anand & Mentorship Team",
    recipientRole: "Academic Directors",
    externalLink: "https://www.eklabya.com",
  },
  {
    _id: "demo-5",
    title: "Excellence in SAP & Cloud Career Mentorship 2024",
    description:
      "Special citation honoring dedicated one-on-one mentorship, career guidance, and live real-time sandbox lab infrastructure provided to learners.",
    awardCategory: "recognition",
    awardDate: "2024-03-22",
    organizationName: "Enterprise Cloud & Software Consortium",
    recipientName: "Eklabya Mentor Network",
    recipientRole: "Technical Instructors",
    externalLink: "https://www.eklabya.com",
  },
];

const categoryTabs = [
  { id: "", label: "All Honors" },
  { id: "excellence", label: "Excellence" },
  { id: "innovation", label: "Innovation" },
  { id: "leadership", label: "Leadership" },
  { id: "achievement", label: "Achievement" },
  { id: "partnership", label: "Partnership" },
  { id: "recognition", label: "Recognition" },
];

const categoryBadgeStyles: Record<string, string> = {
  excellence:
    "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800",
  innovation:
    "bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800",
  leadership:
    "bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800",
  recognition:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800",
  achievement:
    "bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
  partnership:
    "bg-cyan-100 text-cyan-900 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800",
  other:
    "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
};

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [featuredAward, setFeaturedAward] = useState<Award | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [filters, setFilters] = useState({
    awardCategory: "",
    search: "",
    sort: "-awardDate",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const featuredResponse = await getFeaturedAward();
        const featured = featuredResponse?.data?.award || null;

        const queryParams = {
          awardCategory: filters.awardCategory || undefined,
          search: filters.search,
          sort: filters.sort,
          limit: 50,
        };

        const response = await getAwards(queryParams);
        let allAwards = response?.data?.awards || [];

        if (featured) {
          allAwards = allAwards.filter((a: Award) => a._id !== featured._id);
          setFeaturedAward(featured);
        } else {
          setFeaturedAward(demoFeaturedAward);
        }

        if (allAwards.length > 0) {
          setAwards(allAwards);
        } else {
          // If no server awards, use rich demo fallback
          setAwards(demoAwards);
        }
      } catch (error) {
        console.warn(
          "Could not load awards from server, using demo awards:",
          error,
        );
        setFeaturedAward(demoFeaturedAward);
        setAwards(demoAwards);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Filtered awards based on category & search
  const filteredAwards = awards.filter((award) => {
    if (
      filters.awardCategory &&
      award.awardCategory?.toLowerCase() !== filters.awardCategory.toLowerCase()
    ) {
      return false;
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = award.title?.toLowerCase().includes(q);
      const matchDesc = award.description?.toLowerCase().includes(q);
      const matchOrg = award.organizationName?.toLowerCase().includes(q);
      const matchRecipient = award.recipientName?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchOrg || matchRecipient;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading Honors &amp; Recognition...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      <SEO
        title="Awards & Recognition | Eklabya Learning Achievements"
        description="Discover Eklabya awards and recognition, celebrating excellence, achievements and our commitment to quality education and learner success."
        keywords="Eklabya awards, Eklabya recognition, education awards, learning achievements, excellence in education, student success, Eklabya achievements"
      />
      {/* --- LUXURY HERO HEADER --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-yellow-800 to-slate-950 text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
            <FaCrown className="text-yellow-300 text-xs" />
            <span>Excellence &amp; Industry Honors</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Hall of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
              Awards &amp; Recognition
            </span>
          </h1>

          <p className="max-w-7xl mx-auto text-xs sm:text-sm md:text-base text-amber-100/90 font-medium leading-relaxed">
            Honoring our commitment to educational excellence, curriculum
            innovation, top placement outcomes, and industry skill
            transformation across India.
          </p>

          {/* Quick Metrics Badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-3 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                15+
              </div>
              <div className="text-[11px] sm:text-xs text-amber-100 mt-0.5">
                National Awards
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-3 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                Top 10
              </div>
              <div className="text-[11px] sm:text-xs text-amber-100 mt-0.5">
                EdTech Academy 2025
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-3 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                98%
              </div>
              <div className="text-[11px] sm:text-xs text-amber-100 mt-0.5">
                Placement Success
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-3 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                40k+
              </div>
              <div className="text-[11px] sm:text-xs text-amber-100 mt-0.5">
                Alumni Impact
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20 space-y-6">
        {/* --- SPOTLIGHT FEATURED AWARD CARD --- */}
        {featuredAward && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-3 sm:p-4 md:p-6 shadow-2xl border border-amber-200/80 dark:border-amber-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/15 via-yellow-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              {/* Trophy Emblem */}
              <div className="w-full lg:w-48 h-48 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>
                <FaTrophy className="text-7xl text-yellow-100 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute bottom-2 px-3 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-black tracking-widest uppercase">
                  Featured Honor
                </span>
              </div>

              {/* Award Content */}
              <div className="space-y-3.5 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="bg-amber-500 text-slate-950 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    ★ Premier Recognition
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      categoryBadgeStyles[
                        featuredAward.awardCategory || "excellence"
                      ]
                    }`}
                  >
                    {(
                      featuredAward.awardCategory || "Excellence"
                    ).toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <FaCalendarAlt className="text-amber-500 text-xs" />
                    {formatDate(featuredAward.awardDate)}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {featuredAward.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 leading-relaxed">
                  {featuredAward.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                    <FaBuilding className="text-amber-500 text-sm" />
                    <span>Conferred by: {featuredAward.organizationName}</span>
                  </div>
                  {featuredAward.recipientName && (
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-400">
                      <FaUserTie className="text-slate-400 text-sm" />
                      <span>
                        Recipient:{" "}
                        <strong>{featuredAward.recipientName}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="w-full lg:w-auto shrink-0 flex flex-col gap-2">
                <button
                  onClick={() => setSelectedAward(featuredAward)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <FaCertificate className="text-sm" />
                  <span>View Citation Details</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTROLS: CATEGORY TABS & LIVE SEARCH --- */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categoryTabs.map((tab) => {
                const isActive = filters.awardCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setFilters({ ...filters, awardCategory: tab.id })
                    }
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                        : "bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200/80 dark:border-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] md:min-w-[320px]">
              <FaSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search awards, organizations, citations..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* --- AWARDS GRID --- */}
        {filteredAwards.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-lg">
              <FaTrophy />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching awards found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or select another category
              filter above.
            </p>
            <button
              onClick={() =>
                setFilters({
                  awardCategory: "",
                  search: "",
                  sort: "-awardDate",
                })
              }
              className="mt-2 inline-flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAwards.map((award) => {
              const catKey = award.awardCategory || "other";
              const badgeClass =
                categoryBadgeStyles[catKey] || categoryBadgeStyles.other;

              return (
                <div
                  key={award._id}
                  onClick={() => setSelectedAward(award)}
                  className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-600/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="p-6 space-y-4">
                    {/* Header: Trophy Icon & Category Tag */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/80 group-hover:scale-110 transition-transform">
                          <FaTrophy className="text-sm" />
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${badgeClass}`}
                        >
                          {catKey.toUpperCase()}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FaCalendarAlt className="text-amber-500 text-xs" />
                        {formatShortDate(award.awardDate)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {award.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-800 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {award.description}
                    </p>

                    {/* Organization metadata */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold truncate">
                        <FaBuilding className="text-amber-500 shrink-0 text-xs" />
                        <span className="truncate">
                          {award.organizationName}
                        </span>
                      </div>
                      {award.recipientName && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] truncate">
                          <FaUserTie className="text-slate-400 shrink-0 text-xs" />
                          <span className="truncate">
                            Recipient: {award.recipientName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-gray-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Citation Record
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>View Details</span>
                      <FaArrowRight className="text-[10px]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- TRUST & ACCREDITATION FOOTER BAR --- */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-100">
              <FaStar className="text-yellow-300" /> Academic &amp; Industry
              Standards
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Benchmarked for Excellence in Tech Upskilling
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              Our award-winning programs adhere strictly to global enterprise
              benchmarks, bridging the gap between student aspirations and
              Fortune 500 engineering demands.
            </p>
          </div>
        </div>
      </main>

      {/* --- AWARD CITATION DETAIL MODAL --- */}
      {selectedAward && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedAward(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAward(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shrink-0 border border-amber-300 dark:border-amber-800">
                  <FaTrophy />
                </div>
                <div>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      categoryBadgeStyles[
                        selectedAward.awardCategory || "other"
                      ]
                    }`}
                  >
                    {(
                      selectedAward.awardCategory || "Recognition"
                    ).toUpperCase()}
                  </span>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    {formatDate(selectedAward.awardDate)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {selectedAward.title}
                </h3>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-gray-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400">
                    Awarding Organization:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedAward.organizationName}
                  </p>
                </div>

                {selectedAward.recipientName && (
                  <div>
                    <span className="font-bold text-slate-500 dark:text-slate-400">
                      Recipient / Division:
                    </span>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedAward.recipientName}{" "}
                      {selectedAward.recipientRole && (
                        <span className="text-slate-500">
                          ({selectedAward.recipientRole})
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Official Citation:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-900/30">
                  &ldquo;{selectedAward.description}&rdquo;
                </p>
              </div>

              {/* {selectedAward.externalLink && (
                <div className="pt-2">
                  <a
                    href={selectedAward.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                  >
                    <span>View Official Record / Certificate</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
