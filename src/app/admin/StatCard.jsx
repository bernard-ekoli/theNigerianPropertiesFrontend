"use client";
// StatCard.jsx
// The metric cards on the dashboard (Total Listings, Pending, etc.).
// Props: label, value, sub, subColor, icon

import { C } from "./constants.js";

export default function StatCard({ label, value, sub, subColor, icon }) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 11,
            color: C.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 16, opacity: 0.4 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: subColor || C.greenMid, fontWeight: 500 }}>{sub}</div>
    </div>
  );
}