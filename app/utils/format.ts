export const formatPrice = (
  price: number | string | undefined | null,
): string => {
  if (price === undefined || price === null) return "";
  if (Number(price) === 0 || price === "0") return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price));
};

export const formatDuration = (minutes: number | undefined): string | null => {
  if (!minutes) return null;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const result = [];
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (mins > 0) result.push(`${mins} min${mins > 1 ? "s" : ""}`);

  return result.join(" ");
};
