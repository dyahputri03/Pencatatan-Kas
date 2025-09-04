import React from "react";

export const Button = ({ children, ...props }) => (
  <button {...props} className={props.className || "btn btn-primary"}>
    {children || "Button"}
  </button>
);

export const ButtonCreate = ({ onClick, text = "Simpan" }) => (
  <button className="btn btn-success" onClick={onClick}>{text}</button>
);

export const ButtonBack = ({ onClick, text = "Kembali" }) => (
  <button className="btn btn-outline-secondary" onClick={onClick}>{text}</button>
);

export const Input = (p) => <input {...p} className={p.className || "form-control"} />;
export const TextArea = (p) => <textarea {...p} className={p.className || "form-control"} />;
