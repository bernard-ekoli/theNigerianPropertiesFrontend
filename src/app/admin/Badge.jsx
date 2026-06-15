"use client";
// Badge.jsx
// Small coloured pill used to show status across every table.
// Add new types to the MAP object as needed.

import { C } from "./constants.js";

const MAP = {
  Active:   { bg: C.greenLight,     color: C.green,     label: "Active"   },
  Pending:  { bg: C.amberLight,     color: C.amber,     label: "Pending"  },
  Inactive: { bg: C.redLight,       color: C.red,       label: "Inactive" },
  Sold:     { bg: C.redLight,       color: C.red,       label: "Sold"     },
  Rent:     { bg: C.blueLight,      color: C.blue,      label: "Rent"     },
  Sale:     { bg: C.saleGreenLight, color: C.saleGreen, label: "Sale"     },
  Unread:   { bg: C.amberLight,     color: C.amber,     label: "Unread"   },
  Read:     { bg: C.greenLight,     color: C.green,     label: "Read"     },
};

export default function Badge({ type }) {
  const s = MAP[type] || MAP.Active;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}