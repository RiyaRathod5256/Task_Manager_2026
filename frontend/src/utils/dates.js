export function formatDisplayDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate + (isoDate.length === 10 ? "T12:00:00" : ""));
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
