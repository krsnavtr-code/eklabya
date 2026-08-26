"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import Link from "next/link";
import api from "../utils/api";
import { loadRazorpay, initRazorpayPayment } from "../utils/razorpay";
import { useAuth } from "../context/AuthContext";

interface PaymentFormProps {
  onClose: () => void;
  initialData?: any;
  courseId?: string;
  courseName?: string;
  price?: number;
}

interface PaymentFormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  course: string;
  coursePrice: string;
  paymentAmount: string;
  terms: boolean;
}

const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+65", name: "Singapore" },
  { code: "+971", name: "UAE" },
  { code: "+86", name: "China" },
];

export default function PaymentForm({
  onClose,
  initialData = {},
  courseId,
  courseName,
  price,
}: PaymentFormProps) {
  const router = useRouter();
  const { currentUser, updateUser } = useAuth();

  const isCompanyRegistration = initialData?.isCompanyRegistration ?? false;
  const companyAmount = initialData?.amount ?? 0;

  const [paymentType, setPaymentType] = useState<"full" | "registration">(
    "full",
  );
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<PaymentFormData>(() => {
    const data = initialData || {};
    return {
      name: data.name || currentUser?.fullname || currentUser?.name || "",
      email: data.email || currentUser?.email || "",
      countryCode: data.countryCode || "+91",
      phone: data.phone
        ? String(data.phone).replace(/^\+91/, "")
        : currentUser?.phone
          ? currentUser.phone.replace(/^\+91/, "")
          : "",
      course: courseName || data.course || "",
      coursePrice: price
        ? String(Number(price) * 1.18)
        : data.amount
          ? String(Number(data.amount) * 1.18)
          : "",
      paymentAmount: price
        ? String(Number(price) * 1.18)
        : data.amount
          ? String(Number(data.amount) * 1.18)
          : "",
      terms: false,
    };
  });

  useEffect(() => {
    loadRazorpay().then((success) => {
      if (!success) toast.error("Failed to load payment gateway.");
      setIsRazorpayLoaded(success);
    });

    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/profile");
        if (response.data?.user) {
          updateUser({ discount: response.data.user.discount || 0 });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUser();
  }, [updateUser]);

  useEffect(() => {
    if (paymentType === "registration") {
      const fee = 2000;
      const gst = Math.round(fee * 0.18);
      setFormData((prev) => ({ ...prev, paymentAmount: String(fee + gst) }));
    } else if (paymentType === "full" && price) {
      const base = Number(price);
      const gst = Math.round(base * 0.18);
      const total = base + gst;
      if (discountApplied && currentUser?.discount) {
        const discount = Math.round(total * (currentUser.discount / 100));
        setFormData((prev) => ({
          ...prev,
          paymentAmount: String(total - discount),
        }));
      } else {
        setFormData((prev) => ({ ...prev, paymentAmount: String(total) }));
      }
    }
  }, [paymentType, price, discountApplied, currentUser?.discount]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as any).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 15) {
      setFormData((prev) => ({ ...prev, phone: value }));
    }
  };

  const initiateRazorpayPayment = async (orderData: any) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Eklabya",
      description: isCompanyRegistration
        ? "JobFair Registration Fee"
        : `Payment for ${formData.course}`,
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          const paymentData = {
            orderId: orderData.id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            name: formData.name,
            email: formData.email,
            phone: formData.countryCode + formData.phone,
            course: isCompanyRegistration
              ? "JobFair Registration"
              : formData.course,
            paymentAmount: isCompanyRegistration
              ? companyAmount
              : parseFloat(formData.paymentAmount),
            address: "Not provided",
            userId: currentUser?._id || localStorage.getItem("userId") || null,
            isCompanyRegistration: isCompanyRegistration || false,
          };

          const verifyResponse = await api.post(
            "/payments/verify",
            paymentData,
          );

          if (verifyResponse.data.success) {
            toast.success("Payment successful!");

            if (isCompanyRegistration) {
              sessionStorage.removeItem("companyRegistration");
              router.push("/");
            } else {
              onClose();
            }

            setFormData({
              name: "",
              email: "",
              countryCode: "+91",
              phone: "",
              course: "",
              coursePrice: "",
              paymentAmount: "",
              terms: false,
            });
          } else {
            throw new Error(
              verifyResponse.data.message || "Payment verification failed",
            );
          }
        } catch (error: any) {
          console.error("Payment verification error:", error);
          toast.error(
            error.response?.data?.message ||
              "Error verifying payment. Please contact support.",
          );
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.countryCode + formData.phone,
      },
      theme: { color: "#4F46E5" },
    };

    const paymentObject = initRazorpayPayment(options);
    if (!paymentObject) {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    paymentObject.on("payment.failed", (response: any) => {
      toast.error(`Payment failed: ${response.error.description}`);
    });

    paymentObject.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = isCompanyRegistration
      ? ["name", "email", "countryCode", "phone", "terms"]
      : [
          "name",
          "email",
          "countryCode",
          "phone",
          "course",
          "paymentAmount",
          "terms",
        ];

    for (const field of requiredFields) {
      if (!(formData as any)[field]) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    if (
      !isCompanyRegistration &&
      (isNaN(Number(formData.paymentAmount)) ||
        Number(formData.paymentAmount) <= 0)
    ) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = isCompanyRegistration
        ? Math.round(companyAmount * 100)
        : Math.round(parseFloat(formData.paymentAmount) * 100);

      const response = await api.post("/payments/create-order", {
        amount,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          course: isCompanyRegistration
            ? "JobFair Registration"
            : formData.course,
          name: formData.name,
          email: formData.email,
          isCompanyRegistration: isCompanyRegistration || false,
        },
      });

      if (response.data.success) {
        await initiateRazorpayPayment(response.data.order);
      } else {
        throw new Error(
          response.data.message || "Failed to create payment order",
        );
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Failed to process payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="z-[99999] fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {initialData?.isJobFair
                ? "Make Payment to book JobFair slot"
                : "Make a Payment"}
            </h2>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700"
              disabled={isSubmitting}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Phone Number
              </label>
              <div className="flex rounded-md shadow-sm">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-l-md border border-r-0 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 h-10 px-2"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  maxLength={15}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border border-l-0 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Full number: {formData.countryCode} {formData.phone}
              </p>
            </div>

            {courseName ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Program Name
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Payment Type
                  </label>
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentType"
                        value="registration"
                        checked={paymentType === "registration"}
                        onChange={(e) =>
                          setPaymentType(
                            e.target.value as "full" | "registration",
                          )
                        }
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Registration Fee (₹2,000 + GST)
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentType"
                        value="full"
                        checked={paymentType === "full"}
                        onChange={(e) =>
                          setPaymentType(
                            e.target.value as "full" | "registration",
                          )
                        }
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Full Payment (₹
                        {price ? Number(price).toLocaleString() : 0} + GST)
                      </span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Program Name
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Amount to Pay (₹)
              </label>
              <input
                type="number"
                name="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              {courseName && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  {paymentType === "registration" ? (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Registration Fee:</span>
                        <span>₹2,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>₹360</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>₹2,360</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>
                          ₹{price ? Number(price).toLocaleString() : 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>
                          ₹
                          {price
                            ? Math.round(Number(price) * 0.18).toLocaleString()
                            : 0}
                        </span>
                      </div>
                      {discountApplied && currentUser?.discount ? (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({currentUser.discount}%):</span>
                          <span>
                            -₹
                            {Math.round(
                              Number(price || 0) *
                                1.18 *
                                (currentUser.discount / 100),
                            ).toLocaleString()}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>
                          ₹
                          {Number(formData.paymentAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="rounded border-gray-300 dark:border-gray-600"
                required
              />
              <label className="text-sm text-gray-900 dark:text-white">
                I accept the payment{" "}
                <Link
                  href="/payment-terms-and-conditions"
                  className="text-blue-600 hover:underline"
                >
                  T&amp;C
                </Link>
              </label>
            </div>

            {paymentType === "full" &&
              currentUser?.discount &&
              currentUser.discount > 0 && (
                <div className="text-center">
                  {!discountApplied ? (
                    <button
                      type="button"
                      onClick={() => setDiscountApplied(true)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Apply Discount ({currentUser.discount}%)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDiscountApplied(false)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Remove Discount
                    </button>
                  )}
                </div>
              )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="py-1 px-3 border border-red-300 rounded-md text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isRazorpayLoaded}
                className="py-1 px-3 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Continue to Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body!,
  );
}
