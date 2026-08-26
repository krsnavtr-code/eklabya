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
import JsonLd from "./components/JsonLd";

export default function Home() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "The Eklavya",
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/courses?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "The Eklavya",
      url: baseUrl,
      logo: `${baseUrl}/images/eklabya-logo-fit-E.jpeg`,
      sameAs: [baseUrl],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
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
    </>
  );
}
