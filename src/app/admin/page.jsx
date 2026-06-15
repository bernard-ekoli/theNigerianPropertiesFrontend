"use client";
// TNPAdminPanel.jsx
// Root component — imports everything else.
// Responsive: sidebar collapses to a hamburger overlay on mobile (< 768px).
// The `mounted` pattern prevents SSR hydration mismatch from window-dependent code.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { C } from "./constants.js";
import {
  formatCustomCurrency,
  formatUserJoinDate,
  getSubUsers,
  getSubListings,
  useWindowSize,
} from "./utils.js";
import NavItem        from "./NavItem.jsx";
import DashboardPage  from "./pages/DashboardPage.jsx";
import PropertiesPage from "./pages/PropertiesPage.jsx";
import UsersPage      from "./pages/UsersPage.jsx";
import SettingsPage   from "./pages/SettingsPage.jsx";

// ─── Nav config ───────────────────────────────────────────────────────────────
// Add { id: "inquiries", label: "Inquiries", icon: "✉", section: null }
// to show the InquiriesPage once you wire up the API.

const NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: "▪", section: "Main"   },
  { id: "properties", label: "Properties", icon: "⌂", section: null     },
  { id: "users",      label: "Users",      icon: "☺", section: null     },
  { id: "settings",   label: "Settings",   icon: "⚙", section: "System" },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────

function TNPLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill={C.green} />
      <text
        x="14" y="19"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="700"
        fontFamily="serif"
      >
        N
      </text>
    </svg>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function TNPAdminPanel() {
  const router = useRouter();
  const { isMobile } = useWindowSize();

  // mounted gates fetch effects — prevents SSR mismatch
  const [mounted, setMounted]           = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [activePage, setActivePage]     = useState("dashboard");

  // Data state
  const [users, setUsers]               = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Listings",   value: 0, sub: "+0 this week", subColor: C.greenMid, icon: "🏠" },
    { label: "Pending Approval", value: 0, sub: "Needs review", subColor: C.amber,    icon: "⏳" },
    { label: "Total Users",      value: 0, sub: "+0 this week", subColor: C.greenMid, icon: "👤" },
  ]);
  const [properties,     setProperties]     = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [recentUsers,    setRecentUsers]    = useState([]);

  // ── Mount guard ────────────────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    async function fetchUsers() {
      try {
        const res = await fetch(
          `/api/admin/all_users`,
          { credentials: "include" }
        );
        if (!res.ok) return router.push("/dashboard");
        const { users: data } = await res.json();

        setUsers(data);
        setStats((prev) =>
          prev.map((s) =>
            s.label === "Total Users"
              ? { ...s, value: data.length, sub: getSubUsers(data) }
              : s
          )
        );
        setRecentUsers(
          data.slice(0, 5).map((u) => {
            const name = `${u.firstName || ""} ${u.lastName || ""}`.trim();
            return {
              initials:    name.slice(0, 2).toUpperCase().replace(/[^A-Z0-9]/g, ""),
              name:        name || u.email,
              sub:         u.role || "user",
              avatarBg:    u.avatarBg    || "#E9E5FB",
              avatarColor: u.avatarColor || "#4C35B5",
              joined:      `Joined ${formatUserJoinDate(u.createdAt)}`,
            };
          })
        );
      } catch (err) {
        console.error("fetchUsers:", err);
        router.push("/dashboard");
      }
    }

    async function fetchListings() {
      try {
        const res = await fetch(
          `/api/admin/all_listings`,
          { credentials: "include" }
        );
        if (!res.ok) return router.push("/dashboard");
        const { listings } = await res.json();

        setProperties(
          listings.map((l) => ({
            id: l._id, title: l.title, type: l.type,
            price: l.price, location: l.location, status: l.status,
          }))
        );
        setStats((prev) =>
          prev.map((s) => {
            if (s.label === "Total Listings")
              return { ...s, value: listings.length, sub: getSubListings(listings) };
            if (s.label === "Pending Approval")
              return {
                ...s,
                value: listings.filter(
                  (l) => l.status === "pending" || l.status === "declined"
                ).length,
              };
            return s;
          })
        );
        setRecentListings(
          listings.slice(0, 5).map((l) => ({
            initials:    l.title.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, ""),
            title:       l.title.length > 20 ? l.title.slice(0, 17) + "…" : l.title,
            sub:         `For ${l.listingType} • ${formatCustomCurrency("NGN", l.price)}/yr`,
            status:      l.status,
            avatarBg:    l.avatarBg    || C.greenLight,
            avatarColor: l.avatarColor || C.green,
          }))
        );
      } catch (err) {
        console.error("fetchListings:", err);
      }
    }

    fetchUsers();
    fetchListings();
  }, [mounted]);

  // ── Page map ───────────────────────────────────────────────────────────────
  const pages = {
    dashboard:  <DashboardPage  stats={stats} recentListings={recentListings} recentUsers={recentUsers} />,
    properties: <PropertiesPage properties={properties} setProperties={setProperties} />,
    users:      <UsersPage      users={users} setUsers={setUsers} />,
    settings:   <SettingsPage />,
  };

  const pageTitles = {
    dashboard: "Dashboard", properties: "Properties",
    users: "Users", inquiries: "Inquiries", settings: "Settings",
  };

  const goTo = (id) => { setActivePage(id); setSidebarOpen(false); };

  // Don't render until client-side (prevents window/hydration issues)
  if (!mounted) return null;

  const showSidebar = !isMobile || sidebarOpen;

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.bg, minHeight: "100vh" }}>

      {/* ── Top nav ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          padding: "0 16px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 20,
                color: C.text,
                padding: "4px 6px",
                lineHeight: 1,
              }}
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          )}
          <TNPLogo />
          <div>
            <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
              THE NIGERIA PROPERTIES
            </div>
            <div style={{ fontSize: 10, color: C.textSecondary, letterSpacing: "0.05em" }}>
              ADMIN PANEL
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: C.greenLight, color: C.green,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
            }}
          >
            A
          </div>
          {!isMobile && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Admin</div>
              <div style={{ fontSize: 11, color: C.textSecondary }}>Super Admin</div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex" }}>

        {/* Dim overlay when mobile sidebar is open */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed", inset: 0, top: 56,
              background: "rgba(0,0,0,0.35)", zIndex: 49,
            }}
          />
        )}

        {/* ── Sidebar ────────────────────────────────────────────────────────── */}
        {showSidebar && (
          <aside
            style={{
              width: 220,
              background: C.white,
              borderRight: `1px solid ${C.border}`,
              padding: "16px 0",
              overflowY: "auto",
              // Mobile: fixed overlay / Desktop: sticky column
              ...(isMobile
                ? { position: "fixed", top: 56, left: 0, bottom: 0, zIndex: 50 }
                : { position: "sticky", top: 56, height: "calc(100vh - 56px)", flexShrink: 0 }
              ),
            }}
          >
            {NAV.map((item) => (
              <div key={item.id}>
                {item.section && (
                  <div
                    style={{
                      fontSize: 10, color: C.textTertiary,
                      padding: "14px 20px 6px",
                      textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
                    }}
                  >
                    {item.section}
                  </div>
                )}
                <NavItem
                  item={item}
                  active={activePage === item.id}
                  onClick={() => goTo(item.id)}
                />
              </div>
            ))}

            <div
              style={{
                margin: "24px 12px 0", padding: 14, borderRadius: 10,
                background: C.greenLight, border: `1px solid #B8E8D8`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 4 }}>
                TNP Admin v1.0
              </div>
              <div style={{ fontSize: 11, color: C.greenMid }}>All systems operational</div>
            </div>
          </aside>
        )}

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main style={{ flex: 1, padding: isMobile ? "16px 12px" : "24px", minWidth: 0 }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: C.textSecondary }}>Admin</span>
            <span style={{ fontSize: 12, color: C.textTertiary }}>/</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>
              {pageTitles[activePage]}
            </span>
          </div>

          {/* Page header */}
          <div
            style={{
              marginBottom: 20, display: "flex",
              alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 8,
            }}
          >
            <h1 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: C.text, margin: 0 }}>
              {pageTitles[activePage]}
            </h1>
            {activePage === "properties" && (
              <button
                style={{
                  padding: "8px 18px", fontSize: 13, fontWeight: 600,
                  background: C.green, color: C.white,
                  border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                + Add Property
              </button>
            )}
          </div>

          {/* Active page */}
          {pages[activePage]}
        </main>
      </div>
    </div>
  );
}