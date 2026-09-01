import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCourseBySlug, getSiteBase } from "../../lib/server-api";
import { getImageUrl } from "../../utils/imageUtils";
import CourseDetailClient from "../_components/CourseDetailClient";

const FALLBACK_SITE_URL = "https://www.theeklavya.com";

function getCourseImageUrl(courseImage: string | undefined, siteBase: string) {
  return getImageUrl(courseImage) || `${siteBase}${courseImage}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const siteBase = getSiteBase() || FALLBACK_SITE_URL;
  const courseImage = course.imageUrl || "/images/eklabya-logo-fit-E.jpeg";
  const courseImageUrl = getCourseImageUrl(courseImage, siteBase);

  const title = course.metaTitle
    ? `${course.metaTitle} | Eklabya`
    : `${course.title} | Eklabya`;
  const description =
    course.metaDescription ||
    course.shortDescription ||
    "Learn valuable skills with our comprehensive course.";
  const canonical = `${siteBase}/course/${course.slug || slug}`;

  return {
    title,
    description,
    keywords: course.metaKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: courseImageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [courseImageUrl],
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const siteBase = getSiteBase() || FALLBACK_SITE_URL;
  const courseImage = course.imageUrl || "/images/eklabya-logo-fit-E.jpeg";
  const courseImageUrl = getCourseImageUrl(courseImage, siteBase);
  const canonical = `${siteBase}/course/${course.slug || slug}`;
  const seoDescription =
    course.metaDescription ||
    course.shortDescription ||
    "Learn valuable skills with our comprehensive course.";

  const schemas: Record<string, any>[] = [];

  schemas.push({
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description:
      course.description || course.shortDescription || seoDescription,
    provider: {
      "@type": "Organization",
      name: "The Eklavya",
      sameAs: siteBase,
    },
    url: canonical,
    image: courseImageUrl,
    ...(course.price !== undefined && {
      offers: {
        "@type": "Offer",
        price: course.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: canonical,
      },
    }),
    ...(course.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: course.rating,
        reviewCount: course.reviews?.length || course.enrolledStudents || 0,
      },
    }),
    ...(course.duration && {
      timeRequired:
        typeof course.duration === "number"
          ? `PT${course.duration}H`
          : course.duration,
    }),
    ...(course.level && { educationalLevel: course.level }),
  });

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteBase,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: `${siteBase}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.title,
        item: canonical,
      },
    ],
  });

  if (course.faqs && course.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: course.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`course-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <CourseDetailClient course={course} />
    </>
  );
}
