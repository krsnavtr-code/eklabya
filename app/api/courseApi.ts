import api from "../utils/api";

const COURSE_FIELDS = [
  "title",
  "description",
  "shortDescription",
  "category",
  "instructor",
  "price",
  "originalPrice",
  "discount",
  "totalHours",
  "thumbnail",
  "image",
  "rating",
  "enrolledStudents",
  "duration",
  "whatYouWillLearn",
  "requirements",
  "whoIsThisFor",
  "curriculum",
  "reviews",
  "isFeatured",
  "showOnHome",
  "slug",
  "status",
  "metaTitle",
  "metaDescription",
  "tags",
  "prerequisites",
  "skills",
  "certificateIncluded",
  "isPublished",
  "language",
  "level",
  "mentors",
  "faqs",
  "brochureUrl",
  "brochureGeneratedAt",
].join(",");

export const getCourseById = async (id: string) => {
  const response = await api.get(`/courses/${id}`, {
    params: { fields: COURSE_FIELDS },
  });
  return response.data;
};
