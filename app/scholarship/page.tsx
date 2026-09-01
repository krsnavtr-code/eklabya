"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaAward,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaRocket,
} from "react-icons/fa";
import ContactFormModal from "../components/common/ContactFormModal";
import SEO from "../components/SEO";

const perks = [
  {
    icon: (
      <FaGraduationCap className="text-xl text-blue-600 dark:text-blue-400" />
    ),
    title: "Up to 50% Tuition Relief",
    description:
      "Earn substantial financial backing tailored directly to your assessment score.",
  },
  {
    icon: (
      <FaAward className="text-xl text-emerald-600 dark:text-emerald-400" />
    ),
    title: "Industry-Trusted Credentials",
    description:
      "Graduate with verified certifications recognized by leading tech employers.",
  },
  {
    icon: <FaUsers className="text-xl text-purple-600 dark:text-purple-400" />,
    title: "Direct Placement Support",
    description:
      "Receive priority resume reviews, mock interviews, and hiring partner introductions.",
  },
];

const criteria = [
  "Open to all undergraduate or postgraduate students across streams (Tech & Non-Tech).",
  "Ideal for final-year scholars and early professionals (0-2 years experience).",
  "High drive and commitment to master modern digital and technical skills.",
  "Basic system accessibility with a stable web connection.",
];

const roadmap = [
  {
    no: "01",
    title: "Quick Sign-Up",
    text: "Submit your basic profile details in less than two minutes.",
  },
  {
    no: "02",
    title: "Take Skill Assessment",
    text: "Complete our quick, transparent online evaluation test.",
  },
  {
    no: "03",
    title: "Unlock Waiver",
    text: "Get your exact scholarship percentage calculated instantly.",
  },
  {
    no: "04",
    title: "Begin Learning",
    text: "Claim your grant, pick your program, and launch your path.",
  },
];

export default function ScholarshipPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900 transition-colors duration-300">
      <SEO
        title="Scholarship 2026 | Eklabya - Merit-Based Fee Waivers"
        description="Apply for Eklabya's merit scholarship and get up to 50% tuition relief. Take a quick skill assessment and unlock your fee waiver today."
        keywords="scholarship, merit scholarship, fee waiver, tuition relief, Eklabya scholarship"
        robots="index, follow"
      />

      <section className="relative overflow-hidden pt-12 pb-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-3.5 py-1 rounded-full text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              <FaRocket className="text-xs" />
              Scholarship Initiative 2026
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Fuel Your Ambition With Our{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Merit Scholarship
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-300 leading-relaxed font-normal max-w-xl mx-auto">
              Money shouldn&apos;t dictate your potential. Take our evaluation
              test to secure up to a 50% tuition reduction on professional
              career tracks.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Apply for Scholarship</span>
                <FaArrowRight className="text-xs" />
              </button>
              <button
                onClick={() => router.push("/scholarship-test")}
                className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all active:scale-98"
              >
                Take Scholarship Test
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-slate-50/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Apply For Our Grant?
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-400">
              Designed specifically to bridge talent with premium mentorship
              without financial strain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {perks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800/90 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-11 h-11 bg-slate-50 dark:bg-gray-700/60 rounded-xl flex items-center justify-center border border-slate-100 dark:border-gray-700">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-800 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-white dark:bg-gray-800/90 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6"
            >
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900">
                  Eligibility
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
                  Who Is Eligible To Participate?
                </h2>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-400 mt-1">
                  We look for dedication over background. Review our simplified
                  baseline criteria below:
                </p>
              </div>

              <ul className="space-y-3">
                {criteria.map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0 text-sm" />
                    <span className="leading-snug">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between space-y-4"
            >
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                Fee Waiver Slabs
              </h3>
              <div className="space-y-3">
                {[
                  {
                    off: "50% OFF",
                    label: "Top 10% test scorers",
                    tier: "Tier 1",
                  },
                  {
                    off: "30% OFF",
                    label: "Next 20% high performers",
                    tier: "Tier 2",
                  },
                  {
                    off: "15% OFF",
                    label: "Next 30% participants",
                    tier: "Tier 3",
                  },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-2xl sm:text-3xl font-black">
                        {tier.off}
                      </div>
                      <div className="text-[11px] text-blue-100">
                        {tier.label}
                      </div>
                    </div>
                    <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg font-bold">
                      {tier.tier}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-slate-50/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Process Flow in 4 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-400">
              A hassle-free journey from application to admission.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmap.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800/90 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs relative overflow-hidden space-y-2"
              >
                <span className="text-3xl font-black text-blue-500/20 dark:text-blue-400/20 absolute top-3 right-4 select-none">
                  {s.no}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-800 dark:text-slate-400 leading-relaxed">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-10 text-center text-white shadow-xl relative overflow-hidden space-y-4"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              Ready to Accelerate Your Professional Journey?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
              Secure your test slot today and unlock quality education with
              optimized fee concessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
              <button
                onClick={() => router.push("/scholarship-test")}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-md active:scale-98"
              >
                Apply for Scholarship
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-white/20 transition-all active:scale-98"
              >
                Connect With Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
