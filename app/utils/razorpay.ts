"use client";

let originalFetch: typeof window.fetch;

if (typeof window !== "undefined") {
  originalFetch = window.fetch.bind(window);

  window.fetch = async (
    ...args: Parameters<typeof originalFetch>
  ): Promise<Response> => {
    const response = await originalFetch(...args);

    const originalText = response.text;
    (response as any).text = async () => {
      const text = await originalText.call(response);
      if (
        text &&
        typeof text === "string" &&
        text.includes("x-rtb-fingerprint-id")
      ) {
        return "";
      }
      return text;
    };

    return response;
  };
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      if (originalFetch) window.fetch = originalFetch;
      resolve(true);
    };

    script.onerror = () => {
      if (originalFetch) window.fetch = originalFetch;
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export const initRazorpayPayment = (options: any): any => {
  if (typeof window === "undefined" || !(window as any).Razorpay) {
    console.error("Razorpay not loaded");
    return null;
  }
  return new (window as any).Razorpay(options);
};
