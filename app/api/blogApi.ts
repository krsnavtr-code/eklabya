import api from "../utils/api";

export const getBlogPosts = async (params: Record<string, any> = {}) => {
  const { page = 1, limit = 9, category, status = "published" } = params;
  const response = await api.get("/blog/posts", {
    params: {
      page,
      limit,
      ...(category && { category }),
      status,
    },
  });
  return response.data;
};

export const getBlogPostBySlug = async (slug: string) => {
  const response = await api.get(`/blog/posts/${slug}`);
  return response.data;
};

export const getPostsByCategory = async (
  category: string,
  params: Record<string, any> = {},
) => {
  const response = await api.get(`/blog/categories/${category}`, {
    params: { status: "published", ...params },
  });
  return response.data;
};
