"use client";
// pages/SettingsPage.jsx
// Site configuration form.
// Bugs fixed from original: select was bound to undefined (values.manual),
// siteName and values states were declared but never used — all cleaned up.

import { useState } from "react";
import { C } from "../constants.js";

export default function SettingsPage() {
  const [email, setEmail]           = useState("info@thenigerianproperties.com");
  const [autoApprove, setAutoApprove] = useState("no");
  const [saved, setSaved]           = useState(false);

  const handleSave = () => {
    // Wire this up to your actual save API when ready
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = {
    padding: "8px 12px",
    fontSize: 13,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    background: C.white,
    color: C.text,
    outline: "none",
    width: "100%",
    maxWidth: 360,
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    fontSize: 12,
    color: C.textSecondary,
    display: "block",
    marginBottom: 6,
    fontWeight: 500,
  };

  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "20px 24px",
      }}
    >
      <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>
        Site configuration &amp; preferences
      </p>

      <div style={{ display: "grid", gap: 18, maxWidth: 400 }}>
        <div>
          <label style={labelStyle}>Contact Email</label>
          <input
            style={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = C.green)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          />
        </div>

        <div>
          <label style={labelStyle}>Auto-approve Listings</label>
          <select
            style={{ ...field, maxWidth: 240, cursor: "pointer" }}
            value={autoApprove}
            onChange={(e) => setAutoApprove(e.target.value)}
          >
            <option value="no">No — manual review</option>
            <option value="yes">Yes — auto approve</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: "9px 24px",
            fontSize: 13,
            fontWeight: 600,
            background: saved ? C.greenMid : C.green,
            color: C.white,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background 0.2s",
            width: "fit-content",
          }}
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}