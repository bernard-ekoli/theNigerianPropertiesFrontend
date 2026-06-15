"use client";
// NavItem.jsx
// A single clickable row in the sidebar navigation.
// Props: item { id, label, icon }, active (bool), onClick

import { useState } from "react";
import { C } from "./constants.js";

export default function NavItem({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 20px",
        cursor: "pointer",
        fontSize: 13,
        color: active ? C.green : hovered ? C.text : C.textSecondary,
        borderLeft: `2px solid ${active ? C.green : "transparent"}`,
        background: active ? C.greenLight : hovered ? C.bg : "transparent",
        fontWeight: active ? 600 : 400,
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 15, width: 18, textAlign: "center", flexShrink: 0 }}>
        {item.icon}
      </span>
      {item.label}
    </div>
  );
}