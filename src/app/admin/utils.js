"use client";
// utils.js
// Pure helpers + the useWindowSize responsive hook.
// formatCustomCurrency is inlined here so you don't need the tools/ import.

import { useState, useEffect } from "react";

// ─── Currency ────────────────────────────────────────────────────────────────

export function formatCustomCurrency(currency = "NGN", amount, _options = {}) {
  if (amount === null || amount === undefined || amount === "") return "Price on request";
  const num =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.-]/g, ""))
      : Number(amount);
  if (isNaN(num)) return "—";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `₦${num.toLocaleString()}`;
  }
}

// ─── Dates ───────────────────────────────────────────────────────────────────

export function formatUserJoinDate(createdAt) {
  if (!createdAt) return "Unknown";
  const d = new Date(createdAt);
  return isNaN(d.getTime())
    ? "Unknown"
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// ─── "This week" helpers ─────────────────────────────────────────────────────

function startOfThisWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const day = now.getDay();
  now.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); // Monday start
  return now;
}

function countThisWeek(items = []) {
  const start = startOfThisWeek();
  return items.filter((i) => {
    if (!i.createdAt) return false;
    const d = new Date(i.createdAt);
    return !isNaN(d) && d >= start;
  }).length;
}

export function getSubUsers(users = []) {
  return `+${countThisWeek(users)} this week`;
}

export function getSubListings(listings = []) {
  return `+${countThisWeek(listings)} this week`;
}

// ─── Responsive hook ─────────────────────────────────────────────────────────

export function useWindowSize() {
  const [width, setWidth] = useState(1200); // safe SSR default

  useEffect(() => {
    setWidth(window.innerWidth);
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return {
    width,
    isMobile: width < 768,
    isTablet: width < 1024,
  };
}