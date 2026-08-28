import api from "../utils/api";

export const submitContactForm = async (data: Record<string, any>) => {
  const response = await api.post("/contacts", data);
  return response.data;
};

export const getSecretContactData = async (
  secretKey = "eklabya_contact_secret_key_2026",
  options: Record<string, any> = {},
) => {
  const response = await api.get("/contact-data", {
    params: options,
    headers: {
      "x-secret-key": secretKey,
    },
  });
  return response.data;
};
