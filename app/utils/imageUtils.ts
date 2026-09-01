export const getImageUrl = (path: string | undefined | null): string => {
  if (!path || typeof path !== "string") return "";

  const trimmed = path.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("data:")) return trimmed;

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:4002");

  const baseUrl = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//")
  ) {
    if (trimmed.includes("eklabya.com") || trimmed.includes("theeklavya.com"))
      return trimmed;
    if (
      typeof window !== "undefined" &&
      trimmed.includes(window.location.hostname)
    )
      return trimmed;
    return trimmed;
  }

  // Normalize duplicate uploads prefixes if present (e.g. "/uploads/uploads/...")
  let cleanPath = trimmed.replace(/^(\/?uploads\/+)+/i, "");
  cleanPath = cleanPath.replace(/^\/+/, "");

  // If the path originally started with another static directory (e.g., candidate_profile, images, pdfs)
  if (
    trimmed.startsWith("/candidate_profile/") ||
    trimmed.startsWith("candidate_profile/") ||
    trimmed.startsWith("/images/") ||
    trimmed.startsWith("images/") ||
    trimmed.startsWith("/pdfs/") ||
    trimmed.startsWith("pdfs/")
  ) {
    const formatted = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${baseUrl}${formatted}`;
  }

  return `${baseUrl}/uploads/${cleanPath}`;
};
