import api from "../utils/api";

export const getAwards = async (params: Record<string, any> = {}) => {
  const response = await api.get("/awards", { params });
  return response.data;
};

export const getFeaturedAward = async () => {
  const response = await api.get("/awards/featured");
  return response.data;
};
