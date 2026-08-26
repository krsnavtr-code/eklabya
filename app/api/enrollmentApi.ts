import api from "../utils/api";

export const getUserEnrollments = async (
  userId: string,
  options: { status?: string; limit?: number; page?: number } = {},
) => {
  const { status = "active", limit = 100, page = 1 } = options;

  const response = await api.get("/enrollments/my-enrollments", {
    params: { status, limit, page },
  });

  return response.data;
};

export const enrollInCourse = async (courseId: string) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please log in again.",
        shouldLogout: true,
      };
    }

    const response = await api.post(
      "/enrollments",
      { courseId, status: "pending" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-client-ip": localStorage.getItem("clientIp") || "",
          "x-user-agent": navigator.userAgent,
        },
      },
    );

    return {
      success: true,
      data: response.data,
      message: response.data?.message || "Enrollment request submitted.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to enroll in the course.",
      shouldLogout: error?.status === 401,
    };
  }
};
