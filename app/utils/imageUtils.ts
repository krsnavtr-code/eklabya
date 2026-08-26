export const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return "";

  if (path.startsWith("data:")) return path;

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:4002");

  const baseUrl = apiUrl.replace(/\/api$/, "");

  if (path.startsWith("http")) {
    if (path.includes("eklabya.com")) return path;
    if (typeof window !== "undefined" && path.includes(window.location.hostname))
      return path;
    return `${baseUrl}/api/proxy-image?url=${encodeURIComponent(path)}`;
  }

  let cleanPath = path.replace(/^\/+|^uploads\/+/g, "");
  cleanPath = cleanPath.replace(/\/+/g, "/");

  return `${baseUrl}/uploads/${cleanPath}`;
};
