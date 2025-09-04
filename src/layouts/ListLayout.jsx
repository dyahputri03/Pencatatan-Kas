import React from "react";
export const ListLayout = ({ title, header, children }) => (
  <div className="container my-3">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h5 className="m-0">{title}</h5>
      <div>{header}</div>
    </div>
    {children}
  </div>
);
