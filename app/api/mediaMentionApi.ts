import api from "../utils/api";

export const getMediaMentions = async (params: Record<string, any> = {}) => {
  const response = await api.get("/media-mentions", { params });
  return response.data;
};

export const getFeaturedMediaMention = async () => {
  const response = await api.get("/media-mentions/featured");
  return response.data;
};
