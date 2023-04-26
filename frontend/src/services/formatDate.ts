export const formatDate = (date: string | null, hours = true) => {
  if (date == null) return "-";
  let newDate = new Date(date).toLocaleString(undefined, {
    hour12: false,
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: hours ? undefined : "Europe/London",
  });
  if (hours) return newDate;
  return newDate.substring(0, 8);
};
