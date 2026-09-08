"use client";

import { useState } from "react";
import { FaCommentDots, FaTimes, FaWhatsapp, FaPhone } from "react-icons/fa";

interface StandaloneFloatingContactProps {
  whatsappUrl: string;
  phoneNumber: string; // e.g. "+919891030303"
}

// Floating "Talk" button for standalone landing pages. Expands to show
// WhatsApp and Call options. External links only — no main-site navigation.
export default function StandaloneFloatingContact({
  whatsappUrl,
  phoneNumber,
}: StandaloneFloatingContactProps) {
  const [isOpen, setIsOpen] = useState(false);

  const optionClass =
    "flex items-center gap-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-full pl-4 pr-2 py-2 shadow-xl hover:scale-105 transition-all";

  return (
    <div
      className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3"
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Options */}
      <div
        className={`flex flex-col items-end gap-2.5 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={optionClass}
        >
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            Chat on WhatsApp
          </span>
          <span className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
            <FaWhatsapp className="text-lg" />
          </span>
        </a>
        <a href={`tel:${phoneNumber}`} className={optionClass}>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            Call Now
          </span>
          <span className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
            <FaPhone className="text-sm" />
          </span>
        </a>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close contact options" : "Contact us"}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 ${
          isOpen
            ? "bg-slate-700 dark:bg-slate-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaCommentDots className="text-2xl" />
        )}
      </button>
    </div>
  );
}
