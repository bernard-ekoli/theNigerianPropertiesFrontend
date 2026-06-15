"use client";
// SearchInput.jsx
// Simple search input used in table card headers.
// Props: placeholder, value, onChange(string)

import { C } from "./constants.js";

export default function SearchInput({ placeholder, value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: "6px 12px",
        fontSize: 12,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        background: C.bg,
        color: C.text,
        outline: "none",
        width: 180,
        fontFamily: "inherit",
      }}
    />
  );
}