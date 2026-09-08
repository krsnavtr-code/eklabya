"use client";

import { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import StandaloneLeadForm from "./StandaloneLeadForm";

interface StandaloneLeadModalProps {
  triggerLabel: ReactNode;
  triggerClassName?: string;
  heading?: ReactNode;
  subheading?: ReactNode;
  courseKeyword?: string;
  defaultCourseKeyword?: string;
  showMessage?: boolean;
}

// Button + popup modal wrapper around StandaloneLeadForm for standalone
// landing pages. Keeps the user on the same page — no navigation.
export default function StandaloneLeadModal({
  triggerLabel,
  triggerClassName = "",
  heading = "Request a Free Counselling Call",
  subheading = "Fill in your details and our counsellor will call you back shortly.",
  courseKeyword,
  defaultCourseKeyword,
  showMessage = false,
}: StandaloneLeadModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock page scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-gray-500/70 dark:bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all"
              >
                <FaTimes />
              </button>
              <div className="p-5 sm:p-7">
                <StandaloneLeadForm
                  heading={heading}
                  subheading={subheading}
                  courseKeyword={courseKeyword}
                  defaultCourseKeyword={defaultCourseKeyword}
                  showMessage={showMessage}
                  noCard
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
