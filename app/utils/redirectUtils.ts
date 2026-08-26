import api from "./api";

export const checkRedirect = async (path: string) => {
  try {
    const response = await api.get("/redirects/check", {
      params: { path },
    });
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Redirect check failed:", error);
    return null;
  }
};
