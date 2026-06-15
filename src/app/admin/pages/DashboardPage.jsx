"use client";
// pages/DashboardPage.jsx
// The overview page: stat cards on top, recent listings + users below.
// Grids collapse on mobile via useWindowSize.

import { C } from "../constants.js";
import { useWindowSize } from "../utils.js";
import StatCard from "../StatCard.jsx";
import TableCard from "../TableCard.jsx";
import Badge from "../Badge.jsx";

// ─── Avatar circle ────────────────────────────────────────────────────────────

function Avatar({ initials, bg, color }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        background: bg,
        color,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage({ stats, recentListings, recentUsers }) {
  const { isMobile, isTablet } = useWindowSize();

  const statCols = isMobile ? "1fr 1fr" : isTablet ? "repeat(3,1fr)" : "repeat(4,1fr)";
  const sectionCols = isMobile ? "1fr" : "1fr 1fr";

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: statCols, gap: 12, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} sub={s.sub} subColor={s.subColor} icon={s.icon} />
        ))}
      </div>

      {/* Recent panels */}
      <div style={{ display: "grid", gridTemplateColumns: sectionCols, gap: 14 }}>
        {/* Recent Listings */}
        <TableCard title="Recent Listings">
          {recentListings.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 18px",
                borderBottom: i < recentListings.length - 1 ? `1px solid ${C.borderSoft}` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={item.initials} bg={item.avatarBg} color={item.avatarColor} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>{item.sub}</div>
                </div>
              </div>
              <Badge type={item.status} />
            </div>
          ))}
        </TableCard>

        {/* Recent Users */}
        <TableCard title="Recent Users">
          {recentUsers.map((user, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 18px",
                borderBottom: i < recentUsers.length - 1 ? `1px solid ${C.borderSoft}` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={user.initials} bg={user.avatarBg} color={user.avatarColor} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>{user.sub}</div>
                </div>
              </div>
              <span style={{ fontSize: 11, color: C.textTertiary }}>{user.joined}</span>
            </div>
          ))}
        </TableCard>
      </div>
    </div>
  );
}