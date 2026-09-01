"use client";

import React, { useState } from "react";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Is Eklabya's certification recognized by employers?",
      answer:
        "Yeah, it is. Eklabya has got ISO certification, along with partnerships with NSDC and NIELIT. So what you get at the end of the course is a real, verifiable certificate that counts in both the industry and government sectors, not just some generic 'completion certificate'.",
    },
    {
      question: "Do Eklabya courses actually help with job placement?",
      answer:
        "They do. Eklabya has got a dedicated placement support team that can help you out with resume building, interview prep, and actually get you in front of their hiring partner network. We've had alumni from Eklabya get hired by companies like TCS, Infosys, Wipro, HCL, Capgemini, IBM, Microsoft and even Amazon.",
    },
    {
      question: "Are the courses live or self-paced?",
      answer:
        "Both, actually. The way it works is that most courses combine live, instructor-led sessions with self-paced recorded lectures, so you can learn in your own time without missing out on the structured guidance.",
    },
    {
      question: "What if I have no prior experience in tech or business?",
      answer:
        "Don't worry about that. Most of Eklabya's courses are designed to take you from being clueless to job-ready, with a structured, project-based approach. You don't need to have any prior experience, just a commitment to the process.",
    },
    {
      question:
        "How is the Eklabya Scholarship Exam different from a regular discount?",
      answer:
        "The Scholarship Exam is a genuine, merit-based, digitally proctored assessment. The thing is, the awards are based purely on how you do in the exam, not your financial situation, so students who really know their stuff get some real help towards paying for certification.",
    },
    {
      question: "Can I get help if I'm stuck on a topic?",
      answer:
        "Yes. Every course comes with live doubt-clearing sessions, not to mention forum support that guarantees a response within 24 hours, so you're never stuck for long.",
    },
    {
      question: "Are courses available in languages other than English?",
      answer:
        "Yes, Eklabya courses are available in all the multiple languages including Hindi and more, which makes high quality technical and professional education more accessible to a wider range of folks across India.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 py-4">
      <div className="relative max-w-4xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-5 sm:p-7 md:p-8 space-y-6 overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-50/80 dark:bg-blue-950/60 backdrop-blur-md border border-blue-200/80 dark:border-blue-800/80 px-3.5 py-1 rounded-full text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <FaQuestionCircle className="text-xs" /> Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-400 leading-relaxed font-normal">
            Find answers to common questions about Eklabya courses and
            certifications.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-blue-500/40 shadow-md shadow-blue-500/5"
                    : "bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
                } overflow-hidden`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </span>

                  {/* Rotating Chevron Icon */}
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100/80 dark:bg-gray-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                        : "rotate-0"
                    }`}
                  >
                    <FaChevronDown className="text-xs" />
                  </div>
                </button>

                {/* Smooth Collapsible Answer Section */}
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
