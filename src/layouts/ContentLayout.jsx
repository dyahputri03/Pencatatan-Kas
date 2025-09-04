import React from "react";
export const ContentLayout = ({ title, children }) => (
  <div className="container my-3">
    {title && <h5 className="mb-3">{title}</h5>}
    {children}
  </div>
);
