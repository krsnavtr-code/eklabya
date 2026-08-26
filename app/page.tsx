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
import Newsletter from "./components/home/Newsletter";
import FAQ from "./components/home/FAQ";
import ContactSection from "./components/home/ContactSection";

export const metadata: Metadata = {
  title: "Eklabya - Online Learning Platform",
  description: "Eklabya - Online Learning Platform",
  alternates: {
    canonical: "https://www.theeklavya.com",
  },
};

export default function Home() {
  // 1. WebSite Schema (Search Action ke sath)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Eklavya",
    url: "https://www.theeklavya.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.theeklavya.com/courses?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // 2. Organization Schema (Social links aur Logo ke sath)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Eklavya",
    url: "https://www.theeklavya.com",
    logo: "https://www.theeklavya.com/images/eklabya-logo-fit-E.jpeg",
    sameAs: [
      "https://x.com/eklabyaofficial",
      "https://www.linkedin.com/company/eklabya-centre-of-excellence/",
      "https://www.facebook.com/profile.php?id=61589473389916",
      "https://www.instagram.com/eklabya_official",
    ],
  };

  return (
    <main>
      {/* Search Engine Bots ke liye direct HTML mein inject hoga */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="flex flex-col min-h-screen">
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
        <StudentPlacements />

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
