"use client";
// ActionBtn.jsx
// Small action button used in table rows.
// Variants: "default" | "danger" | "approve"

import { useState } from "react";
import { C } from "./constants.js";

const VARIANTS = {
  default: { color: C.textSecondary, border: C.border,  hoverBg: C.bg         },
  danger:  { color: C.red,           border: "#F09595", hoverBg: C.redLight   },
  approve: { color: C.green,         border: "#5DCAA5", hoverBg: C.greenLight },
};

export default function ActionBtn({ children, variant = "default", onClick }) {
  const [hovered, setHovered] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.default;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 500,
        border: `1px solid ${v.border}`,
        borderRadius: 7,
        cursor: "pointer",
        background: hovered ? v.hoverBg : "transparent",
        color: v.color,
        marginRight: 4,
        fontFamily: "inherit",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}