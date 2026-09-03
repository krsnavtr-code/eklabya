import { Metadata } from "next";
import Banner from "./components/home/Banner";
import PopularCourses from "./components/home/PopularCourses";
import Categories from "./components/home/Categories";
import Assessment from "./components/home/Assessment";
import ScholarshipProgram from "./components/home/ScholarshipProgram";
import WhyLearnWithEklabya from "./components/home/WhyLearnWithEklabya";
import HowWillYourTrainingWork from "./components/home/HowWillYourTrainingWork";
import Stats from "./components/home/Stats";
import StudentPlacements from "./components/home/StudentPlacements";
import Content from "./components/home/Content";
import Testimonials from "./components/home/Testimonials";
import GoogleReviews from "./components/home/GoogleReviews";
import Newsletter from "./components/home/Newsletter";
import FAQ from "./components/home/FAQ";
import ContactSection from "./components/home/ContactSection";

export const metadata: Metadata = {
  title: "Eklabya | Job-Ready Online Certification Courses in India",
  description:
    "Learn job-ready skills with Eklabya's online certification courses in Data Science, AI, SAP, Web Development and Digital Marketing with expert mentorship.",
  keywords:
    "online certification courses, professional certification courses, job oriented courses, online courses in India, skill development courses, career oriented courses, technical courses online, Data Science course, Artificial Intelligence course, Machine Learning course, SAP courses, SAP ABAP course, SAP FICO course, Digital Marketing course, Web Development course, Power BI course, Python course, IT certification courses, online professional courses, Eklabya courses",
  alternates: {
    canonical: "https://www.eklabya.com",
  },
  openGraph: {
    title: "Eklabya | Job-Ready Online Certification Courses in India",
    description:
      "Learn job-ready skills with Eklabya's online certification courses in Data Science, AI, SAP, Web Development and Digital Marketing with expert mentorship.",
    url: "https://www.eklabya.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eklabya | Job-Ready Online Certification Courses in India",
    description:
      "Learn job-ready skills with Eklabya's online certification courses in Data Science, AI, SAP, Web Development and Digital Marketing with expert mentorship.",
  },
};

export default function Home() {
  // 1. WebSite Schema (Search Action ke sath)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Eklavya",
    url: "https://www.eklabya.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.eklabya.com/courses?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // 2. Organization Schema (Social links aur Logo ke sath)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Eklavya",
    url: "https://www.eklabya.com",
    logo: "https://www.eklabya.com/images/eklabya-logo-fit-E.jpeg",
    sameAs: [
      "https://x.com/eklabyaofficial",
      "https://www.linkedin.com/company/eklabya-centre-of-excellence/",
      "https://www.facebook.com/profile.php?id=61589473389916",
      "https://www.instagram.com/eklabya_official",
    ],
  };

  return (
    <main className="relative text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      {/* Search Engine Bots ke liye direct HTML mein inject hoga */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Ambient background light orbs for iPhone-like glass refraction */}
      <div className="fixed top-20 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/15 dark:bg-blue-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-500/15 dark:bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-40 left-1/4 w-[550px] h-[550px] rounded-full bg-rose-500/10 dark:bg-amber-500/10 blur-[130px] pointer-events-none -z-10" />

      <div className="flex flex-col relative z-10">
        {/* Hero Banner */}
        <Banner />

        {/* Popular Courses */}
        <PopularCourses />

        {/* Categories Section */}
        <Categories />

        {/* Assessment / Scholarship Program */}
        <Assessment />

        {/* Scholarship Program */}
        <ScholarshipProgram />

        {/* Why Learn With Eklabya */}
        <WhyLearnWithEklabya />

        {/* How Will Your Training Work */}
        <HowWillYourTrainingWork />

        {/* Stats */}
        <Stats />

        {/* Student Placements */}
        {/* <StudentPlacements /> */}

        {/* Google review */}
        <GoogleReviews />

        {/* Content */}
        <Content />

        {/* Testimonials */}
        <Testimonials />

        {/* Newsletter */}
        <Newsletter />

        {/* FAQ */}
        <FAQ />

        {/* Contact Section */}
        <ContactSection />
      </div>
    </main>
  );
}
