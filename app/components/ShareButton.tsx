"use client";

import { toast } from "react-hot-toast";
import { FaShareAlt } from "react-icons/fa";

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
}

export default function ShareButton({
  title,
  text,
  url,
  className = "",
}: ShareButtonProps) {
  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={
        "flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition " +
        className
      }
    >
      <FaShareAlt className="mr-2" /> Share Article
    </button>
  );
}
