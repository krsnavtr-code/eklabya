import { Metadata } from "next";
import {
  FaCertificate,
  FaStar,
  FaStarHalfAlt,
  FaGoogle,
  FaFacebookF,
  FaGraduationCap,
  FaShieldAlt,
  FaAward,
  FaUniversity,
  FaChalkboardTeacher,
  FaBriefcase,
  FaLaptopCode,
  FaUserTie,
  FaRupeeSign,
  FaCheckCircle,
  FaArrowRight,
  FaCogs,
  FaCode,
  FaChartLine,
  FaBoxes,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import WhyLearnWithEklabya from "../components/home/WhyLearnWithEklabya";
import HowWillYourTrainingWork from "../components/home/HowWillYourTrainingWork";
import GoogleReviews from "../components/home/GoogleReviews";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import StandaloneLeadForm from "../components/standalone/StandaloneLeadForm";
import StandaloneNavbar from "../components/standalone/StandaloneNavbar";
import StandaloneLeadModal from "../components/standalone/StandaloneLeadModal";

const WHATSAPP_URL =
  "https://wa.me/919891030303?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20SAP%20training%20and%20certification%20courses.";

export const metadata: Metadata = {
  title: "SAP Training & Certification Courses Online in India | Eklabya",
  description:
    "Master SAP with Eklabya's job-oriented online training and certification courses in SAP ABAP, FICO, MM, SD and PP. Live classes, real projects, certification and placement support.",
  keywords:
    "SAP training, SAP certification, SAP courses online, SAP ABAP course, SAP FICO course, SAP MM training, SAP SD course, SAP PP training, SAP online training India, SAP certification course, learn SAP, SAP career, Eklabya SAP courses",
  alternates: {
    canonical: "https://www.eklabya.com/sap-training-certification",
  },
  openGraph: {
    title: "SAP Training & Certification Courses Online in India | Eklabya",
    description:
      "Master SAP with Eklabya's job-oriented online training and certification courses in SAP ABAP, FICO, MM, SD and PP. Live classes, real projects, certification and placement support.",
    url: "https://www.eklabya.com/sap-training-certification",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAP Training & Certification Courses Online in India | Eklabya",
    description:
      "Master SAP with Eklabya's job-oriented online training and certification courses in SAP ABAP, FICO, MM, SD and PP. Live classes, real projects, certification and placement support.",
  },
};

const sapCourses = [
  {
    name: "SAP ABAP Certification Training",
    description:
      "Learn Advanced Business Application Programming — reports, interfaces, forms, enhancements and real-time project work on S/4HANA.",
    href: "/course/sap-abap-certification-training",
    icon: <FaCode />,
    tag: "Technical",
    keyword: "SAP ABAP",
  },
  {
    name: "SAP FICO Financial Accounting",
    description:
      "Master Financial Accounting (FI) and Controlling (CO) — G/L, AP/AR, asset accounting, cost centers and end-to-end configuration.",
    href: "/course/sap-fico-online-training",
    icon: <FaFileInvoiceDollar />,
    tag: "Functional",
    keyword: "SAP FICO",
  },
  {
    name: "SAP MM Materials Management",
    description:
      "Cover procurement, inventory management, purchasing, vendor evaluation and invoice verification with hands-on practice.",
    href: "/course/sap-mm-certificate-training",
    icon: <FaBoxes />,
    tag: "Functional",
    keyword: "SAP MM",
  },
  {
    name: "SAP SD Sales & Distribution",
    description:
      "Learn order-to-cash — sales orders, pricing, delivery, billing, shipping and integration with MM and FICO.",
    href: "/course/sap-sd-certification-training",
    icon: <FaChartLine />,
    tag: "Functional",
    keyword: "SAP SD",
  },
  {
    name: "SAP PP Production Planning",
    description:
      "Master production planning — BOM, work centers, routings, MRP, demand management and shop-floor execution.",
    href: "/course/sap-pp-online-traning",
    icon: <FaCogs />,
    keyword: "SAP PP",
    tag: "Functional",
  },
];

const benefits = [
  {
    icon: <FaChalkboardTeacher />,
    title: "Live Instructor-Led Classes",
    text: "Learn directly from SAP-certified industry trainers with years of implementation and support project experience.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Hands-On SAP Server Access",
    text: "Practice on live SAP systems with real-time scenarios, configuration exercises and end-to-end project work.",
  },
  {
    icon: <FaCertificate />,
    title: "Recognized Certification",
    text: "Earn an ISO-certified, verifiable course completion certificate valued by employers and government sectors alike.",
  },
  {
    icon: <FaBriefcase />,
    title: "Placement Assistance",
    text: "Get resume building, interview preparation and referrals through our hiring partner network across India.",
  },
  {
    icon: <FaUserTie />,
    title: "1:1 Mentorship & Doubt Support",
    text: "Weekly doubt-clearing sessions, mentor guidance and a support forum with responses within 24 hours.",
  },
  {
    icon: <FaRupeeSign />,
    title: "Affordable & Flexible",
    text: "Scholarship options, EMI plans and weekend batches designed for students and working professionals.",
  },
];

const learningPath = [
  {
    step: "01",
    title: "SAP Fundamentals",
    text: "Understand ERP concepts, SAP architecture, navigation, modules and the S/4HANA ecosystem.",
  },
  {
    step: "02",
    title: "Module Deep-Dive",
    text: "Master your chosen module — ABAP, FICO, MM, SD or PP — with configuration and business process training.",
  },
  {
    step: "03",
    title: "Real-Time Projects",
    text: "Work on implementation-style projects, case studies and integration scenarios used in actual SAP projects.",
  },
  {
    step: "04",
    title: "Certification & Interview Prep",
    text: "Clear assessments, earn your certificate, and prepare with mock interviews and resume building.",
  },
  {
    step: "05",
    title: "Placement Support",
    text: "Get referred to hiring partners and apply for SAP consultant, analyst and support roles.",
  },
];

const careerRoles = [
  "SAP Functional Consultant",
  "SAP ABAP Developer",
  "SAP FICO Consultant",
  "SAP MM / SD / PP Analyst",
  "SAP Support Executive",
  "SAP End User / Power User",
  "ERP Business Analyst",
  "SAP Implementation Associate",
];

const techCompanies = [
  {
    name: "TCS",
    logo: "/images/Company%20logos/Tata_Consultancy_Services_old_logo.svg",
  },
  { name: "Infosys", logo: "/images/Company%20logos/Infosys_logo.svg" },
  {
    name: "Wipro",
    logo: "/images/Company%20logos/Wipro_Primary_Logo_Color_RGB.svg",
  },
  { name: "HCL", logo: "/images/Company%20logos/hcltech-1.svg" },
  {
    name: "Mahindra & Mahindra",
    logo: "/images/Company%20logos/mahindra-mahindra-logo.svg",
  },
  { name: "Microsoft", logo: "/images/Company%20logos/Microsoft_logo.svg" },
  { name: "Amazon", logo: "/images/Company%20logos/amazon-icon.svg" },
  { name: "Google", logo: "/images/Company%20logos/Google_2015_logo.svg" },
  {
    name: "Google Cloud",
    logo: "/images/Company%20logos/google_cloud-icon.svg",
  },
  { name: "Meta", logo: "/images/Company%20logos/Meta_Platforms_logo.svg" },
  { name: "Netflix", logo: "/images/Company%20logos/Netflix_icon.svg" },
  { name: "Flipkart", logo: "/images/Company%20logos/flipkart-icon.svg" },
  { name: "Zomato", logo: "/images/Company%20logos/Zomato_Logo.svg" },
];

export default function SapTrainingCertification() {
  const courseListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SAP Training & Certification Courses",
    url: "https://www.eklabya.com/sap-training-certification",
    itemListElement: sapCourses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: course.name,
        description: course.description,
        url: `https://www.eklabya.com${course.href}`,
        provider: {
          "@type": "Organization",
          name: "Eklabya",
          sameAs: "https://www.eklabya.com",
        },
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.eklabya.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "SAP Training & Certification",
        item: "https://www.eklabya.com/sap-training-certification",
      },
    ],
  };

  return (
    <main className="relative text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div id="top" className="flex flex-col relative z-10">
        {/* Standalone navbar — same logo as main site, in-page scroll links only */}
        <StandaloneNavbar
          links={[
            { label: "Courses", href: "#sap-courses" },
            { label: "Why Eklabya", href: "#why-sap" },
            { label: "Learning Path", href: "#learning-path" },
            { label: "Careers", href: "#careers" },
            { label: "Reviews", href: "#reviews" },
            { label: "FAQ", href: "#faq" },
          ]}
          ctaLabel="Enquire Now"
          ctaHref="#enquire"
        />

        <section className="relative bg-slate-900 py-10 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden text-white">
          {/* Subtle Premium Background Glow Effect */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px]"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Content (Spans 7 columns for better text-to-form ratio) */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Trust Badge / Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <FaCertificate /> Job-Oriented SAP Program
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
                Fast-Track Your IT Career with{" "}
                <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  SAP Certification
                </span>
              </h1>

              <p className="text-sm md:text-base text-slate-300 mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Build a high-paying ERP career with Eklabya&apos;s
                industry-focused training. Get live server access, work on
                real-time projects, and secure your future with{" "}
                <strong className="text-white">100% placement support.</strong>
              </p>

              {/* Quick Value Props (Crucial for Google Ads Quality Score & Trust) */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-5 mb-8 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-green-400" /> Live Server
                  Access
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-green-400" /> Real-time
                  Projects
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-green-400" /> Interview Prep
                </div>
              </div>

              {/* Buttons (Compact and Punchy) */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <a
                  href="#sap-courses"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] text-center"
                >
                  Explore Curriculum
                </a>
                <a
                  href={WHATSAPP_URL} // Replace with your variable
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 border border-white/20 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/10 transition-all text-center backdrop-blur-sm"
                >
                  Chat on WhatsApp
                </a>
              </div>
              {/* Ratings row */}
              <div className="mt-8 flex flex-col items-center lg:items-start gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-0.5 text-amber-400 text-base">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfAlt />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    <span className="text-white font-bold">4.9 out of 5</span>{" "}
                    based on 12123 votes
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {[
                    { icon: <FaGoogle className="text-xs" />, label: "4.8/5" },
                    {
                      icon: <FaStar className="text-xs text-amber-400" />,
                      label: "4.8/5",
                    },
                    {
                      icon: <FaGraduationCap className="text-xs" />,
                      label: "4.7/5",
                    },
                    {
                      icon: <FaStar className="text-xs text-amber-400" />,
                      label: "4.9/5",
                    },
                    {
                      icon: <FaFacebookF className="text-xs" />,
                      label: "4.9/5",
                    },
                  ].map((badge, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-white/5 border border-white/15 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      {badge.icon} {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Lead Form (Spans 5 columns) - Designed to Convert */}
            <div className="lg:col-span-5 relative scroll-mt-24" id="enquire">
              {/* FOMO / Urgency Badge */}
              <div className="absolute -top-3 -right-2 md:-right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20 border border-white/20 animate-bounce">
                🔥 Next Batch Starting Soon!
              </div>

              {/* Form Container with Premium Glass/Card look */}
              <div className="bg-white rounded-2xl shadow-2xl p-1 relative z-10 border border-gray-100">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 sm:px-6 py-5 border border-gray-200 dark:border-slate-700">
                  <StandaloneLeadForm
                    heading={
                      <>
                        Book Your{" "}
                        <span className="text-blue-600">Free Demo Class</span>
                      </>
                    }
                    subheading="Unlock exclusive course fees, syllabus, & placement details."
                    courseKeyword="SAP"
                    showMessage={false}
                    noCard
                  />

                  <div className="mt-3 text-center">
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                      🔒 Your data is 100% secure with us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Strip (ratings, CTAs & accreditations) */}
          <div className="relative z-10 max-w-7xl mx-auto mt-4 lg:mt-6 pt-3 border-t border-white/10">
            {/* CTA buttons */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6">
              <StandaloneLeadModal
                triggerLabel="PLACEMENT REPORT"
                triggerClassName="w-full bg-blue-600 text-white px-5 py-3 rounded-lg font-extrabold text-xs sm:text-sm tracking-wide hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
                heading="Get the Latest Placement Report"
                subheading="Fill in your details and we'll share the placement report on call."
                courseKeyword="SAP"
              />
              <StandaloneLeadModal
                triggerLabel="GET BROCHURE"
                triggerClassName="w-full bg-white/5 border border-white/20 text-white px-5 py-3 rounded-lg font-extrabold text-xs sm:text-sm tracking-wide hover:bg-white/10 transition-all cursor-pointer"
                heading="Download Course Brochure"
                subheading="Fill in your details and we'll share the SAP brochure with you."
                courseKeyword="SAP"
              />
              <StandaloneLeadModal
                triggerLabel="INTERVIEW QUESTIONS"
                triggerClassName="w-full bg-white/5 border border-white/20 text-white px-5 py-3 rounded-lg font-extrabold text-xs sm:text-sm tracking-wide hover:bg-white/10 transition-all cursor-pointer"
                heading="Get SAP Interview Questions"
                subheading="Fill in your details and we'll share top SAP interview questions."
                courseKeyword="SAP"
              />
            </div> */}

            {/* Accreditation badges */}
            <div className="flex flex-wrap items-stretch justify-center gap-3 mt-2">
              {[
                {
                  icon: <FaShieldAlt className="text-blue-700 text-xl" />,
                  title: "ISO Certified",
                  sub: "International Organization for Standardization",
                },
                {
                  icon: <FaAward className="text-blue-700 text-xl" />,
                  title: "NSDC",
                  sub: "National Skill Development Corporation",
                },
                {
                  icon: <FaUniversity className="text-blue-700 text-xl" />,
                  title: "MCA",
                  sub: "Ministry of Corporate Affairs",
                },
                {
                  icon: <FaGraduationCap className="text-blue-700 text-xl" />,
                  title: "Skill India",
                  sub: "National Skills Development Mission",
                },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 min-w-[200px] shadow-lg"
                >
                  {badge.icon}
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-slate-900 leading-tight">
                      {badge.title}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {badge.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hiring partners — scrolling logo marquee */}
        <div className="relative overflow-hidden px-2 sm:px-4 lg:px-6 py-2">
          {/* Edge fade */}
          <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-slate-800 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-slate-800 to-transparent z-10 pointer-events-none" />

          <div className="flex w-max items-center gap-3 md:gap-4 px-10 py-2 animate-marquee-logos hover:[animation-play-state:paused]">
            {[...techCompanies, ...techCompanies].map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-5 py-2 rounded-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-gray-700 flex items-center justify-center shadow-2xs hover:border-blue-500 transition-colors h-14"
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-8 w-auto max-w-[130px] object-contain dark:invert"
                  />
                ) : (
                  <span className="text-sm md:text-base font-extrabold text-slate-700 dark:text-slate-300 tracking-wider">
                    {company.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee-logos {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-logos {
            animation: marquee-logos 40s linear infinite;
          }
        `}</style>

        {/* SAP Courses Grid */}
        <section
          id="sap-courses"
          className="w-full px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-5xl mx-auto mb-6">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                Our SAP Certification Programmes
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Choose from technical and functional SAP modules — each designed
                to take you from beginner to job-ready consultant.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sapCourses.map((course) => (
                <div
                  key={course.href}
                  className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-7 flex flex-col hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
                      {course.icon}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                      {course.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {course.description}
                  </p>
                  <StandaloneLeadModal
                    triggerLabel={
                      <>
                        Enquire About This Course
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                      </>
                    }
                    triggerClassName="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold mt-5 group-hover:underline cursor-pointer"
                    heading={<>Enquire — {course.name}</>}
                    subheading="Fill in your details and our counsellor will call you back with course details, fees and batch timings."
                    courseKeyword="SAP"
                    defaultCourseKeyword={course.keyword}
                  />
                </div>
              ))}
              {/* CTA card */}
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-7 flex flex-col justify-center text-white shadow-xl shadow-blue-600/20">
                <h3 className="text-xl font-bold mb-3">
                  Not sure which SAP module fits you?
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed mb-6">
                  Get free career counselling from our experts and pick the
                  module that matches your background and goals.
                </p>
                <StandaloneLeadModal
                  triggerLabel={
                    <>
                      Get Free Counselling <FaArrowRight className="text-xs" />
                    </>
                  }
                  triggerClassName="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-xl font-bold text-sm w-fit hover:bg-blue-50 transition-all cursor-pointer"
                  heading={
                    <>
                      Book Your{" "}
                      <span className="text-blue-600">Free Demo Class</span>
                    </>
                  }
                  subheading="Unlock exclusive course fees, syllabus, & placement details."
                  courseKeyword="SAP"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Eklabya for SAP */}
        <section
          id="why-sap"
          className="w-full px-4 sm:px-6 lg:px-8 py-8 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-5xl mx-auto mb-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Why Learn SAP with Eklabya?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Everything you need to go from learner to SAP consultant — in
                one structured program.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-lg shadow-slate-200/40 dark:shadow-black/40 p-3"
                >
                  <div className="w-8 h-8 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-2">
                    {benefit.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section
          id="learning-path"
          className="w-full px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-5xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Your Path to Becoming an SAP Professional
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                A proven 5-step journey from fundamentals to a certified, placed
                SAP professional.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {learningPath.map((item) => (
                <div
                  key={item.step}
                  className="relative bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-lg shadow-slate-200/40 dark:shadow-black/40 p-6"
                >
                  <div className="text-3xl font-black text-blue-600/50 dark:text-blue-400/50 mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Career Opportunities */}
        <section
          id="careers"
          className="w-full px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-8 md:p-12">
            <div className="text-center max-w-5xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Career Opportunities After SAP Certification
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                SAP professionals are among the highest-paid in the ERP
                industry. Our alumni work at TCS, Infosys, Wipro, HCL,
                Capgemini, IBM and more.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {careerRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-5 py-3.5 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <FaCheckCircle className="text-green-500 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Will Your Training Work */}
        <HowWillYourTrainingWork />

        {/* Google review */}
        <GoogleReviews />

        {/* Testimonials */}
        <div id="reviews" className="scroll-mt-20">
          <Testimonials />
        </div>

        {/* SAP Faq's */}
        
      </div>
    </main>
  );
}
