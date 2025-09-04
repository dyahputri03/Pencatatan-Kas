export const defaultMoment = () => ({
  format: (fmt) => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    if (fmt === "YYYY-MM-DD") {
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    return d.toISOString();
  },
});
