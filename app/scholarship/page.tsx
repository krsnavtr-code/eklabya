"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaPercentage,
  FaClock,
  FaBookOpen,
  FaCheckCircle,
  FaBrain,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBan,
  FaDesktop,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import ContactFormModal from "../components/common/ContactFormModal";
import SEO from "../components/SEO";

const testHighlights = [
  {
    icon: <FaBookOpen className="text-blue-500" />,
    title: "Syllabus",
    desc: "General Knowledge & Course Basics",
  },
  {
    icon: <FaClock className="text-blue-500" />,
    title: "Duration",
    desc: "45 Minutes",
  },
  {
    icon: <FaBrain className="text-blue-500" />,
    title: "Format",
    desc: "Multiple Choice Questions (MCQs)",
  },
  {
    icon: <FaPercentage className="text-blue-500" />,
    title: "Max Benefit",
    desc: "Up to 70% Tuition Fee Waiver",
  },
];

const feeSlabs = [
  {
    tier: "Tier 1",
    off: "70%",
    label: "Top 10% Scorers",
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    tier: "Tier 2",
    off: "50%",
    label: "Next 20% Performers",
    color: "text-slate-700 bg-slate-50 border-slate-200",
  },
  {
    tier: "Tier 3",
    off: "25%",
    label: "Next 30% Participants",
    color: "text-slate-700 bg-slate-50 border-slate-200",
  },
];

const guidelines = [
  {
    icon: <FaBan className="text-red-500" />,
    title: "No Negative Marking",
    text: "Feel free to attempt all questions. There is no penalty for wrong answers.",
  },
  {
    icon: <FaDesktop className="text-blue-500" />,
    title: "Single Attempt",
    text: "You can only take the scholarship test once. Make sure you are fully prepared.",
  },
  {
    icon: <FaClock className="text-amber-500" />,
    title: "Time Bound",
    text: "The test will auto-submit when the time is up. Keep an eye on the timer.",
  },
  {
    icon: <FaExclamationTriangle className="text-orange-500" />,
    title: "Anti-Cheating",
    text: "Tab switching or minimizing the browser will auto-submit your test immediately.",
  },
];

const faqs = [
  {
    q: "Is there any registration fee for the scholarship test?",
    a: "No, the scholarship test is absolutely free of cost for all students.",
  },
  {
    q: "When will I get the results of the test?",
    a: "The results are generated instantly. You will see your score and the unlocked discount percentage immediately after submission.",
  },
  {
    q: "Is this scholarship valid for all courses?",
    a: "Yes, the scholarship discount can be applied to any of our premium certification courses.",
  },
  {
    q: "What happens if my internet disconnects during the test?",
    a: "If you disconnect briefly, you may be able to resume from where you left off. However, we highly recommend ensuring a stable connection as time will continue running.",
  },
  {
    q: "Can I retake the test if I score low?",
    a: "No, to maintain fairness, we only allow one attempt per student. Please ensure you are ready before starting.",
  },
];

export default function ScholarshipPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <SEO
        title="Scholarship Test | Up to 70% Fee Waiver"
        description="Take our scholarship test comprising GK and course-related questions to get up to 70% off on your tuition fees."
      />

      {/* ================= COMPACT HERO SECTION ================= */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-10 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <FaPercentage /> Mega Scholarship Test
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Qualify the Test & Get Up To{" "}
                <span className="text-blue-600 dark:text-blue-500">
                  70% OFF
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                Your knowledge can fund your education. Take our simple online
                evaluation test consisting of General Knowledge and basic
                course-related topics to instantly unlock your fee waiver.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => router.push("/scholarship-test")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Start Test Now <FaArrowRight />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3.5 rounded-lg font-bold text-sm transition-colors text-center"
                >
                  Have Questions?
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" /> Test Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testHighlights.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="bg-white dark:bg-slate-700 p-2 rounded-md shadow-sm border border-slate-100 dark:border-slate-600 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                        {item.title}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPACT DETAILS SECTION ================= */}
      <section className="py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  What to Study? (Syllabus)
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                  The test is designed to evaluate your basic aptitude and
                  foundational knowledge. You don't need advanced technical
                  skills to pass.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <FaBrain className="text-amber-500" /> General Knowledge
                    </h3>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                      <li>Basic Aptitude & Logic</li>
                      <li>Current Affairs (Tech)</li>
                      <li>General Awareness</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <FaBookOpen className="text-blue-500" /> Course Related
                    </h3>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                      <li>Basic Computer Fundamentals</li>
                      <li>Internet & Digital Basics</li>
                      <li>Logical Reasoning</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Simple 3-Step Process
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between items-start sm:items-center text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                      1
                    </span>{" "}
                    Fill basic details
                  </div>
                  <FaArrowRight className="hidden sm:block text-slate-300" />
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      2
                    </span>{" "}
                    Give the Online Test
                  </div>
                  <FaArrowRight className="hidden sm:block text-slate-300" />
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      3
                    </span>{" "}
                    Get Instant Discount
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Fee Waiver Slabs
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Discounts are strictly based on your test score rankings.
              </p>

              <div className="space-y-3">
                {feeSlabs.map((slab, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${slab.color} flex justify-between items-center`}
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-0.5 opacity-70">
                        {slab.tier}
                      </div>
                      <div className="text-sm font-semibold">{slab.label}</div>
                    </div>
                    <div className="text-2xl font-black">{slab.off}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= IMPORTANT GUIDELINES (NEW SECTION) ================= */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Important Guidelines
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Please read these rules carefully before starting the test.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guidelines.map((rule, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-600">
                  {rule.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {rule.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rule.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQs SECTION (NEW SECTION) ================= */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Everything you need to know about the scholarship test.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  {openFaq === index ? (
                    <FaChevronUp className="text-slate-400 shrink-0" />
                  ) : (
                    <FaChevronDown className="text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 pt-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
