"use client";

import { useEffect, useState } from "react";
import { FaTrophy, FaCalendarAlt, FaExternalLinkAlt, FaSearch } from "react-icons/fa";
import { getAwards, getFeaturedAward } from "../api/awardApi";

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

const categoryMap: Record<string, string> = {
  excellence: "Excellence Award",
  innovation: "Innovation Award",
  leadership: "Leadership Award",
  recognition: "Recognition",
  achievement: "Achievement",
  partnership: "Partnership",
  other: "Other",
};

const categoryColorMap: Record<string, string> = {
  excellence: "bg-amber-100 text-amber-800",
  innovation: "bg-purple-100 text-purple-800",
  leadership: "bg-blue-100 text-blue-800",
  recognition: "bg-green-100 text-green-800",
  achievement: "bg-orange-100 text-orange-800",
  partnership: "bg-cyan-100 text-cyan-800",
  other: "bg-gray-100 text-gray-800",
};

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [featuredAward, setFeaturedAward] = useState<Award | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    awardCategory: "",
    search: "",
    sort: "-displayOrder -awardDate",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const featuredResponse = await getFeaturedAward();
        const featured = featuredResponse.data?.award || null;
        setFeaturedAward(featured);

        const queryParams = {
          awardCategory: filters.awardCategory || undefined,
          search: filters.search,
          sort: filters.sort,
          limit: 50,
        };

        const response = await getAwards(queryParams);
        let allAwards = response.data?.awards || [];
        if (featured) {
          allAwards = allAwards.filter((a: Award) => a._id !== featured._id);
        }
        setAwards(allAwards);
      } catch (error) {
        console.error("Error fetching awards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleCardClick = (award: Award) => {
    if (award.externalLink) {
      window.open(award.externalLink, "_blank", "noopener,noreferrer");
    } else if (award.awardImage) {
      window.open(award.awardImage, "_blank", "noopener,noreferrer");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Awards & Recognition
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8">
            Celebrating our achievements and excellence in education
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8 opacity-80">
            <div className="text-sm text-amber-200 italic">
              Recognized by: Education Excellence Awards • Innovation Summit •
              Leadership Forum • Achievement Council
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Award */}
        {featuredAward && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-2">🏆</span> Featured Award
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                {featuredAward.organizationLogo ? (
                  <img
                    src={featuredAward.organizationLogo}
                    alt={featuredAward.organizationName}
                    className="h-32 object-contain"
                  />
                ) : (
                  <div className="text-white text-6xl font-bold opacity-50">
                    {featuredAward.organizationName?.charAt(0) || "A"}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      categoryColorMap[featuredAward.awardCategory || ""] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {categoryMap[featuredAward.awardCategory || ""] ||
                      featuredAward.awardCategory}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {formatDate(featuredAward.awardDate)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {featuredAward.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {featuredAward.description}
                </p>
                {featuredAward.recipientName && (
                  <p className="text-gray-700 dark:text-gray-200 mb-4">
                    <span className="font-medium">Recipient:</span>{" "}
                    {featuredAward.recipientName}
                    {featuredAward.recipientRole && (
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        ({featuredAward.recipientRole})
                      </span>
                    )}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {featuredAward.organizationName}
                  </span>
                  <button
                    onClick={() => handleCardClick(featuredAward)}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    <FaExternalLinkAlt /> View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword or organization..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
              />
            </div>
            <select
              value={filters.awardCategory}
              onChange={(e) =>
                setFilters({ ...filters, awardCategory: e.target.value })
              }
              className="w-full md:w-48 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
            >
              <option value="">Filter by category</option>
              <option value="excellence">Excellence Award</option>
              <option value="innovation">Innovation Award</option>
              <option value="leadership">Leadership Award</option>
              <option value="recognition">Recognition</option>
              <option value="achievement">Achievement</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value })
              }
              className="w-full md:w-48 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
            >
              <option value="-displayOrder -awardDate">Display Order</option>
              <option value="-awardDate">Newest First</option>
              <option value="awardDate">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Awards Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            All Awards
          </h2>

          {awards.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No awards found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map((award) => (
                <div
                  key={award._id}
                  onClick={() => handleCardClick(award)}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  {award.awardImage ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={award.awardImage}
                        alt={award.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      <FaTrophy className="text-6xl text-amber-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          categoryColorMap[award.awardCategory || ""] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {categoryMap[award.awardCategory || ""] ||
                          award.awardCategory}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatShortDate(award.awardDate)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {award.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {award.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                        {award.organizationName}
                      </span>
                      {award.externalLink && (
                        <FaExternalLinkAlt className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
