import api from "../utils/api";

export const submitContactForm = async (data: Record<string, any>) => {
  const response = await api.post("/contacts", data);
  return response.data;
};
