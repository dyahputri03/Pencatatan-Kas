export const formatIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export const formatISODate = (s) => {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString("id-ID");
};

export const parseNumber = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  return Number(String(val).replace(/[^0-9.-]/g, "")) || 0;
};
