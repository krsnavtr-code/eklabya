import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secretKey =
      request.headers.get("x-secret-key") ||
      request.headers.get("x-api-key") ||
      request.headers.get("secret-key") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      searchParams.get("secret_key") ||
      searchParams.get("secretKey") ||
      searchParams.get("apiKey") ||
      searchParams.get("key") ||
      searchParams.get("token");

    const allowedKeys = [
      process.env.CONTACT_SECRET_KEY,
      process.env.SECRET_KEY,
      process.env.CONTACT_API_KEY,
      "eklabya_contact_secret_key_2026",
      "firstvite_data_importing_in_origanation_id_1_FV",
    ].filter(Boolean);

    if (!secretKey || !allowedKeys.includes(secretKey.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Invalid or missing secret key",
        },
        { status: 401 },
      );
    }

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://www.eklabya.com/api").replace(/\/$/, "");

    // Pass the query params to the backend API
    const response = await axios.get(`${apiBase}/contact-data`, {
      params: Object.fromEntries(searchParams.entries()),
      headers: {
        "x-secret-key": secretKey,
      },
      timeout: 30000,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch contact data";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}
