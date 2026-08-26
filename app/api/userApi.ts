import api from "../utils/api";

export const updateProfile = async (profileData: {
  phone?: string;
  address?: string;
}) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyAdminOTP = async (email: string, otp: string) => {
  const response = await api.post("/auth/verify-admin-otp", { email, otp });
  return response.data;
};

export const resetPassword = async (
  token: string,
  email: string,
  password: string,
) => {
  const response = await api.post("/auth/reset-password", {
    token,
    email,
    password,
  });
  return response.data;
};
