"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaImage, FaArrowRight } from "react-icons/fa";
import api from "../utils/api";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  courseCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesWithCount = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/categories", {
          params: { limit: 100 },
        });

        let categoriesData: Category[] = [];
        if (response?.data?.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          categoriesData = response as Category[];
        }

        const validCategories = categoriesData
          .filter((cat) => cat && cat._id && cat.name)
          .map((category) => ({
            ...category,
            courseCount: category.courseCount || 0,
          }));

        setCategories(validCategories);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithCount();
  }, []);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002";
    return `${baseUrl.replace("/api", "")}${imagePath}`;
  };

  const renderCategoryImage = (category: Category) => {
    const imageUrl = category.image ? getImageUrl(category.image) : null;

    return (
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        {!imageUrl && <FaImage className="text-gray-400 text-2xl" />}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Categories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore our wide range of course categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/courses/${
                category.slug ||
                category.name.toLowerCase().replace(/\s+/g, "-")
              }`}
              className="group block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {renderCategoryImage(category)}
                  <FaArrowRight className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {category.courseCount || 0} courses
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}