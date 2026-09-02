"use client";

import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaSearch,
  FaFileAlt,
} from "react-icons/fa";
import {
  getMediaMentions,
  getFeaturedMediaMention,
} from "../api/mediaMentionApi";
import SEO from "../components/SEO";

interface Mention {
  _id: string;
  title: string;
  shortDescription?: string;
  newsType?: string;
  publishedDate?: string;
  publisherName?: string;
  publisherLogo?: string;
  mediaUpload?: string;
  externalLink?: string;
}

const typeMap: Record<string, string> = {
  print: "Print Media",
  digital: "Digital Article",
  video: "Video",
  press_release: "Press Release",
};

const typeColorMap: Record<string, string> = {
  print: "bg-blue-100 text-blue-800",
  digital: "bg-green-100 text-green-800",
  video: "bg-purple-100 text-purple-800",
  press_release: "bg-orange-100 text-orange-800",
};

export default function MediaMentionsPage() {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [featuredMention, setFeaturedMention] = useState<Mention | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    newsType: "",
    search: "",
    sort: "-publishedDate",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const featuredResponse = await getFeaturedMediaMention();
        const featured = featuredResponse.data?.mention || null;
        setFeaturedMention(featured);

        const queryParams = {
          newsType: filters.newsType || undefined,
          search: filters.search,
          sort: filters.sort,
          limit: 50,
        };

        const response = await getMediaMentions(queryParams);
        let allMentions = response.data?.mentions || [];
        if (featured) {
          allMentions = allMentions.filter(
            (m: Mention) => m._id !== featured._id,
          );
        }
        setMentions(allMentions);
      } catch (error) {
        console.error("Error fetching media mentions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleCardClick = (mention: Mention) => {
    if (mention.externalLink) {
      window.open(mention.externalLink, "_blank", "noopener,noreferrer");
    } else if (mention.mediaUpload) {
      window.open(mention.mediaUpload, "_blank", "noopener,noreferrer");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title="Media Mentions | Eklabya"
        description="Explore media coverage, press releases, and news mentions about Eklabya."
        keywords="media mentions, press, news, eklabya, coverage"
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">In the News</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            See what leading publications are saying about our certification
            programs
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8 opacity-80">
            <div className="text-sm text-blue-200 italic">
              Featured in: Times of India • TechCrunch • Digital Learning
              Magazine • Forbes India
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Mention */}
        {featuredMention && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-2">⭐</span> Featured Story
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                {featuredMention.publisherLogo ? (
                  <img
                    src={featuredMention.publisherLogo}
                    alt={featuredMention.publisherName}
                    className="h-32 object-contain"
                  />
                ) : (
                  <div className="text-white text-6xl font-bold opacity-50">
                    {featuredMention.publisherName?.charAt(0) || "N"}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      typeColorMap[featuredMention.newsType || ""] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {typeMap[featuredMention.newsType || ""] ||
                      featuredMention.newsType}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {formatDate(featuredMention.publishedDate)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {featuredMention.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {featuredMention.shortDescription}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {featuredMention.publisherName}
                  </span>
                  <button
                    onClick={() => handleCardClick(featuredMention)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    <FaExternalLinkAlt /> Read Full Article
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
                placeholder="Search by keyword or publication..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
              />
            </div>
            <select
              value={filters.newsType}
              onChange={(e) =>
                setFilters({ ...filters, newsType: e.target.value })
              }
              className="w-full md:w-48 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
            >
              <option value="">Filter by type</option>
              <option value="print">Print Media</option>
              <option value="digital">Digital Article</option>
              <option value="video">Video</option>
              <option value="press_release">Press Release</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="w-full md:w-48 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white bg-gray-50 text-black"
            >
              <option value="-publishedDate">Newest First</option>
              <option value="publishedDate">Oldest First</option>
            </select>
          </div>
        </div>

        {/* News Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            All Media Mentions
            <span className="text-gray-500 dark:text-gray-400 text-lg font-normal ml-2">
              ({mentions.length})
            </span>
          </h2>

          {mentions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No media mentions found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentions.map((mention) => (
                <div
                  key={mention._id}
                  onClick={() => handleCardClick(mention)}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center p-4">
                    {mention.publisherLogo ? (
                      <img
                        src={mention.publisherLogo}
                        alt={mention.publisherName}
                        className="h-20 object-contain"
                      />
                    ) : mention.mediaUpload ? (
                      <img
                        src={mention.mediaUpload}
                        alt={mention.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaFileAlt className="text-4xl text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          typeColorMap[mention.newsType || ""] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {typeMap[mention.newsType || ""] || mention.newsType}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(mention.publishedDate)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 h-12">
                      {mention.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 h-10">
                      {mention.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                        {mention.publisherName}
                      </span>
                      <span className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
                        <FaExternalLinkAlt className="mr-1" />
                        {mention.newsType === "print"
                          ? "View Clipping"
                          : "Read More"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Media Kit & PR Contact */}
        <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Media Kit</h3>
              <p className="text-gray-300 mb-6">
                Download our official media kit including company logo,
                founder&apos;s bio, brand guidelines, and high-resolution images
                for press use.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition">
                <FaFileAlt /> Download Media Kit
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">PR Contact</h3>
              <p className="text-gray-300 mb-4">
                For media inquiries, press releases, or interview requests,
                please reach out to our PR team.
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <span className="font-semibold">Email:</span>{" "}
                  press@eklabya.com
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Phone:</span> +91 98910 30303
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
