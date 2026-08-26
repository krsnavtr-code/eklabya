"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaShieldAlt,
  FaExclamationTriangle,
  FaFileAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import {
  getTestQuestions,
  submitTestAnswers,
  hasUserTakenTest,
} from "../api/testService";
import SEO from "../components/SEO";
import TestQuestion from "../components/test/TestQuestion";
import TestResults from "../components/test/TestResults";
import TestReview from "../components/test/TestReview";

const QUESTION_TIME_LIMIT = 25;

interface Question {
  _id: string;
  question: string;
  explanation?: string;
  questionType:
    | "true_false"
    | "multiple_choice_single"
    | "multiple_choice_multiple"
    | "short_answer"
    | "essay";
  options?: { text: string }[];
}

const usePreventNavigation = (prevent: boolean) => {
  useEffect(() => {
    if (!prevent) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message =
        "Are you sure you want to leave? Your test progress will be lost.";
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [prevent]);
};

export default function ScholarshipTestPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [agreed, setAgreed] = useState(false);
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const [checkingTestStatus, setCheckingTestStatus] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login?redirect=/scholarship-test");
      return;
    }
    const checkTestStatus = async () => {
      try {
        const hasTaken = await hasUserTakenTest();
        setHasTakenTest(hasTaken);
      } catch (error) {
        console.error("Error checking test status:", error);
      } finally {
        setCheckingTestStatus(false);
      }
    };
    checkTestStatus();
  }, [currentUser, router]);

  const handleSubmit = useCallback(
    async (finalSubmit = false) => {
      try {
        if (!finalSubmit) {
          setShowReview(true);
          return;
        }

        if (!currentUser) {
          toast.error("Please log in to submit the test");
          router.push("/login?redirect=/scholarship-test");
          return;
        }

        setIsLoading(true);
        const questionIds = questions.map((q) => q._id);
        const result = await submitTestAnswers(answers, questionIds);
        setScore(result.score);
        setTestCompleted(true);
        setShowReview(false);
        if (timerRef.current) clearInterval(timerRef.current);
        toast.success("Test submitted successfully!");
      } catch (error: any) {
        console.error("Error submitting test:", error);
        const errorMessage =
          typeof error === "string"
            ? error
            : error?.message || "Failed to submit test";
        toast.error(errorMessage);
        if (
          errorMessage.includes("expired") ||
          errorMessage.includes("missing") ||
          errorMessage.includes("authentication")
        ) {
          router.push(
            `/login?redirect=/scholarship-test&message=${encodeURIComponent(errorMessage)}`,
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [answers, questions, router, currentUser],
  );

  usePreventNavigation(
    testStarted &&
      !testCompleted &&
      !showReview &&
      questions.length > 0 &&
      !isLoading,
  );

  const handleBackToTest = () => setShowReview(false);

  const handleTimeUp = useCallback(() => {
    if (questions.length === 0) return;
    if (currentQuestionIndex >= questions.length - 1) {
      const currentQ = questions[questions.length - 1];
      setAnswers((prev) => {
        if (currentQ && !prev[currentQ._id]) {
          return { ...prev, [currentQ._id]: "unanswered" };
        }
        return prev;
      });
      handleSubmit(true);
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => {
      if (currentQuestion && !prev[currentQuestion._id]) {
        return { ...prev, [currentQuestion._id]: "unanswered" };
      }
      return prev;
    });

    setCurrentQuestionIndex((prev) => prev + 1);
    setTimeLeft(QUESTION_TIME_LIMIT);
  }, [currentQuestionIndex, questions, handleSubmit]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(QUESTION_TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [handleTimeUp]);

  useEffect(() => {
    if (questions.length > 0 && testStarted && !testCompleted) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    currentQuestionIndex,
    testStarted,
    testCompleted,
    questions.length,
    startTimer,
  ]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getTestQuestions();
        setQuestions(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Error fetching test questions:", error);
        toast.error("Failed to load scholarship test. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestionIndex < questions.length - 1) {
      if (answers[currentQuestion._id] !== undefined) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(QUESTION_TIME_LIMIT);
      } else {
        alert("Please select an answer before proceeding.");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setTimeLeft(QUESTION_TIME_LIMIT);
    }
  };

  if (checkingTestStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-5">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="text-gray-600 font-medium text-lg">
            Checking your test status...
          </p>
        </div>
      </div>
    );
  }

  if (hasTakenTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-5">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <FaCheckCircle className="mx-auto text-5xl text-green-500" />
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              Test Already Completed
            </h2>
            <p className="text-gray-500 mt-2">
              You have already taken the scholarship test.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/profile")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !testCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-5">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="text-gray-600 font-medium text-lg">
            Preparing your assessment...
          </p>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <TestResults
        score={score}
        totalQuestions={questions.length}
        onRetry={() => {
          setTestStarted(false);
          setTestCompleted(false);
          setScore(0);
          setAnswers({});
          setCurrentQuestionIndex(0);
          setAgreed(false);
        }}
      />
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-5">
        <SEO
          title="Scholarship Test | Eklabya Centre of Excellence"
          description="Apply for the Eklabya Centre of Excellence Scholarship Test and unlock academic excellence with merit-based rewards, career guidance, and expert mentoring."
          keywords="scholarship test, scholarship evaluation, online test, Eklabya scholarship, student scholarship"
          robots="index, follow"
          og={{
            title: "Scholarship Test | Eklabya Centre of Excellence",
            description:
              "Apply for the Eklabya Centre of Excellence Scholarship Test and unlock academic excellence with merit-based rewards, career guidance, and expert mentoring.",
            type: "article",
          }}
        />
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <FaShieldAlt className="mx-auto text-6xl text-indigo-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-2">
                Eklabya Scholarship Test – Online Scholarship Evaluation for
                Students
              </h1>
              <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-10 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <FaExclamationTriangle className="text-red-500 text-2xl mt-1" />
                <div>
                  <h4 className="font-bold text-red-800 text-lg mb-1">
                    Strict Time Constraint
                  </h4>
                  <p className="text-red-700">
                    You have strictly{" "}
                    <strong>{QUESTION_TIME_LIMIT} seconds</strong> per question.
                    The test will <strong>auto-advance</strong> if time runs
                    out, and you cannot revisit skipped questions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <FaFileAlt className="text-indigo-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  Scholarship Test Policy & Important Warnings – Eklabya
                </h2>
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
                <p>
                  The Eklabya Scholarship Evaluation Test is designed to ensure
                  a fair, transparent, and merit-based assessment process for
                  all candidates.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Time Management",
                      text: "Each question in the Eklabya scholarship exam has a strict time limit. Once the time expires, the system will automatically move to the next question, and unanswered questions cannot be revisited.",
                    },
                    {
                      title: "System Integrity",
                      text: "A stable internet connection is mandatory throughout the test. Refreshing the page, switching browser tabs, minimizing the window, or using the back button may result in automatic disqualification.",
                    },
                    {
                      title: "Anti-Malpractice",
                      text: "Any attempt to use unfair means, external assistance, screen recording tools, or multiple devices can lead to immediate cancellation of the test and disqualification.",
                    },
                    {
                      title: "Final Submission",
                      text: "All submitted responses are final and cannot be edited after submission. By proceeding with the test, candidates agree to comply with all Eklabya scholarship policies, rules, and warnings.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-gray-200"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <label className="flex items-center gap-4 cursor-pointer mb-8 group p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-6 h-6 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-gray-700 font-medium group-hover:text-gray-900">
                  I have read and understood the rules, policies, and warnings
                  stated above.
                </span>
              </label>

              <button
                disabled={!agreed}
                onClick={() => setTestStarted(true)}
                className={`w-full py-4 rounded-full text-lg font-bold tracking-wide transition-all duration-300 shadow-xl ${
                  agreed
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                Start Assessment Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <TestReview
        questions={questions}
        answers={answers}
        onBack={handleBackToTest}
        onSubmit={() => handleSubmit(true)}
      />
    );
  }

  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100,
  );
  const isTimeCritical = timeLeft <= 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        <div className="p-6 md:p-8 pb-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-700">
              Question {currentQuestionIndex + 1}
              <span className="text-gray-400 font-normal ml-1">
                / {questions.length}
              </span>
            </h3>

            <div
              className={`px-4 py-1.5 rounded-full flex items-center gap-2 border font-bold transition-all duration-300 ${
                isTimeCritical
                  ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              <FaClock />
              <span className="tabular-nums">
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          {questions.length > 0 && (
            <TestQuestion
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              selectedAnswer={answers[questions[currentQuestionIndex]._id]}
            />
          )}
        </div>

        <div className="h-px bg-gray-100 mx-8" />

        <div className="p-6 md:p-8 flex justify-between items-center bg-white">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FaChevronLeft className="text-sm" /> Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!answers[questions[currentQuestionIndex]?._id]}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all shadow-md ${
                answers[questions[currentQuestionIndex]?._id]
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next Question <FaChevronRight className="text-sm" />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={
                isLoading || !answers[questions[currentQuestionIndex]?._id]
              }
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all shadow-md ${
                answers[questions[currentQuestionIndex]?._id] && !isLoading
                  ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FaCheckCircle /> Review Answers
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
