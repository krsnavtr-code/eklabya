import api from "../utils/api";

export const getFAQs = async (params: Record<string, any> = {}) => {
  const response = await api.get("/faqs", {
    params: {
      status: "active",
      sort: "order",
      order: "asc",
      limit: 50,
      ...params,
      _t: Date.now(),
    },
  });

  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data)) return response.data.data;
  if (response.data && Array.isArray(response.data.docs)) return response.data.docs;
  if (response.data && response.data.success && Array.isArray(response.data.faqs))
    return response.data.faqs;

  return [];
};
