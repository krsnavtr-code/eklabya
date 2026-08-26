import api from "../utils/api";

export const getTestQuestions = async () => {
  const response = await api.get("/test-questions/questions");
  return response.data;
};

export const hasUserTakenTest = async () => {
  const response = await api.get("/test-questions/has-taken-test");
  return response.data?.hasTakenTest ?? false;
};

export const getUserTestResults = async () => {
  try {
    const response = await api.get("/test-questions/results");
    const results = response.data?.results;
    return results && results.length > 0 ? results[0] : null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

export const submitTestAnswers = async (
  answers: Record<string, any>,
  questionIds: string[],
) => {
  const response = await api.post("/test-questions/submit", {
    answers,
    questionIds,
  });
  return response.data;
};
