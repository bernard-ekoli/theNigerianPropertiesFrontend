"use client";
// TableCard.jsx
// The white card that wraps every table view.
// Also exports TH and TD so you don't need a separate file for two tiny components.
//
// Usage:
//   import TableCard, { TH, TD } from "../TableCard";

import { C } from "./constants.js";

// ─── Table primitives ─────────────────────────────────────────────────────────

export function TH({ children }) {
  return (
    <th
      style={{
        padding: "9px 14px",
        textAlign: "left",
        fontSize: 11,
        fontWeight: 600,
        color: C.textSecondary,
        borderBottom: `1px solid ${C.borderSoft}`,
        background: C.bg,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

export function TD({ children, style }) {
  return (
    <td
      style={{
        padding: "10px 14px",
        borderBottom: `1px solid ${C.borderSoft}`,
        color: C.text,
        fontSize: 13,
        verticalAlign: "middle",
        ...style,
      }}
    >
      {children}
    </td>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

export default function TableCard({ title, action, children }) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: `1px solid ${C.borderSoft}`,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{title}</h3>
        {action}
      </div>

      {/* Scrollable table area — handles overflow on small screens */}
      <div style={{ overflowX: "auto" }}>{children}</div>
    </div>
  );
}