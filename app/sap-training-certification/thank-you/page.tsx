import { Metadata } from "next";
import Link from "next/link";
import {
  FaCheckCircle,
  FaWhatsapp,
  FaPhone,
  FaArrowLeft,
  FaClock,
} from "react-icons/fa";

const WHATSAPP_URL =
  "https://wa.me/919891030303?text=Hi%2C%20I%20just%20submitted%20the%20SAP%20enquiry%20form%20and%20would%20like%20to%20know%20more.";

export const metadata: Metadata = {
  title: "Thank You | SAP Training & Certification - Eklabya",
  description:
    "Thank you for your enquiry. Our SAP counsellor will contact you shortly.",
  robots: { index: false, follow: false },
};

export default function SapThankYou() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Success icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
            <FaCheckCircle className="text-4xl text-green-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            Thank You! Enquiry{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Submitted
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Our SAP career counsellor will call you back shortly with course
            details, fees and upcoming batch timings.
          </p>

          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <FaClock /> Expected callback within 2–4 working hours
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-green-500 transition-all shadow-lg shadow-green-600/20"
            >
              <FaWhatsapp className="text-base" /> Chat on WhatsApp Now
            </a>
            <a
              href="tel:+919891030303"
              className="w-full inline-flex items-center justify-center gap-2 bg-white/5 border border-white/20 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
            >
              <FaPhone className="text-sm" /> Call +91 98910 30303
            </a>
            <Link
              href="/sap-training-certification"
              className="inline-flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-semibold hover:text-blue-400 transition-colors mt-2"
            >
              <FaArrowLeft className="text-xs" /> Back to SAP Training page
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
