export const exportHandler = (link, filename = "export") => {
  if (!link) return;
  const a = document.createElement("a");
  a.href = link;
  a.download = filename;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
