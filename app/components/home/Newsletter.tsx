"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import ContactFormModal from "../common/ContactFormModal";

const Newsletter = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-12 text-center overflow-hidden border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-black/40"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Your Dream Career Is Just One Step Away
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Join our next cohort and get personalized career coaching,
              portfolio reviews, and direct referrals to hiring partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-700 hover:scale-102 transition-all shadow-md shadow-blue-600/20 active:scale-98"
              >
                Apply for Admission
              </button>
              <a
                href="https://wa.me/919891030303?text=Hi%2C%20I%20would%20like%20to%20talk%20to%20an%20expert%20about%20career%20guidance%20and%20course%20recommendations."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-gray-700 transition-all active:scale-98 text-center shadow-xs"
              >
                Talk to an Expert
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Newsletter;
