"use client"
import { useState, useEffect } from "react";
import formatCustomCurrency from "../../../tools/formatCurrency";

const C = {
    green: "#0F6E56",
    greenLight: "#E1F5EE",
    greenMid: "#1D9E75",
    greenDark: "#0a5240",
    amber: "#854F0B",
    amberLight: "#FAEEDA",
    red: "#A32D2D",
    redLight: "#FCEBEB",
    blue: "#185FA5",
    blueLight: "#E6F1FB",
    saleGreen: "#3B6D11",
    saleGreenLight: "#EAF3DE",
    bg: "#F5F6F8",
    white: "#FFFFFF",
    border: "#E8EAED",
    borderSoft: "#F0F1F3",
    text: "#1A1A1A",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",
};

function TNPLogo() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill={C.green} />
            <text x="14" y="19" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="serif">N</text>
        </svg>
    );
}

function Badge({ type }) {
    const map = {
        Active: { bg: C.greenLight, color: C.green, label: "Active" },
        Pending: { bg: C.amberLight, color: C.amber, label: "Pending" },
        Inactive: { bg: C.redLight, color: C.red, label: "Inactive" },
        Sold: { bg: C.redLight, color: C.red, label: "Sold" },
        Rent: { bg: C.blueLight, color: C.blue, label: "Rent" },
        Sale: { bg: C.saleGreenLight, color: C.saleGreen, label: "Sale" },
        Unread: { bg: C.amberLight, color: C.amber, label: "Unread" },
        Read: { bg: C.greenLight, color: C.green, label: "Read" },
    };
    const s = map[type] || map.Active;
    return (
        <span style={{
            display: "inline-block", padding: "2px 10px", borderRadius: 99,
            fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, letterSpacing: "0.01em",
        }}>{s.label}</span>
    );
}

function StatCard({ label, value, sub, subColor, icon }) {
    return (
        <div style={{
            background: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6,
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: C.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 16, opacity: 0.4 }}>{icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: subColor || C.greenMid, fontWeight: 500 }}>{sub}</div>
        </div>
    );
}

function TableCard({ title, action, children }) {
    return (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", borderBottom: `1px solid ${C.borderSoft}`,
            }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{title}</h3>
                {action}
            </div>
            {children}
        </div>
    );
}

function SearchInput({ placeholder, value, onChange }) {
    return (
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                padding: "6px 12px", fontSize: 12, border: `1px solid ${C.border}`, borderRadius: 8,
                background: C.bg, color: C.text, outline: "none", width: 180, fontFamily: "inherit",
            }}
        />
    );
}

function ActionBtn({ children, variant, onClick }) {
    const variants = {
        default: { bg: "transparent", color: C.textSecondary, border: C.border },
        danger: { bg: "transparent", color: C.red, border: "#F09595" },
        approve: { bg: "transparent", color: C.green, border: "#5DCAA5" },
    };
    const v = variants[variant] || variants.default;
    const [hovered, setHovered] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{
                padding: "4px 10px", fontSize: 11, fontWeight: 500,
                border: `1px solid ${v.border}`, borderRadius: 7, cursor: "pointer",
                background: hovered ? (variant === "danger" ? C.redLight : variant === "approve" ? C.greenLight : C.bg) : v.bg,
                color: v.color, marginRight: 4, fontFamily: "inherit", transition: "all 0.15s",
            }}
        >{children}</button>
    );
}

function TH({ children }) {
    return (
        <th style={{
            padding: "9px 14px", textAlign: "left", fontSize: 11, fontWeight: 600,
            color: C.textSecondary, borderBottom: `1px solid ${C.borderSoft}`,
            background: C.bg, textTransform: "uppercase", letterSpacing: "0.05em",
        }}>{children}</th>
    );
}

function TD({ children, style }) {
    return (
        <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.borderSoft}`, color: C.text, fontSize: 13, verticalAlign: "middle", ...style }}>
            {children}
        </td>
    );
}

function DashboardPage({ stats, recentListings, recentUsers }) {
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                {stats.map((s, i) => (
                    <StatCard key={i} label={s.label} value={s.value} sub={s.sub} subColor={s.subColor} icon={s.icon} />
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <TableCard title="Recent Listings">
                    {recentListings.map((item, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 18px", borderBottom: i < recentListings.length - 1 ? `1px solid ${C.borderSoft}` : "none",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 11, fontWeight: 700,
                                    background: item.avatarBg, color: item.avatarColor, flexShrink: 0,
                                }}>{item.initials}</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{item.title}</div>
                                    <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>{item.sub}</div>
                                </div>
                            </div>
                            <Badge type={item.status} />
                        </div>
                    ))}
                </TableCard>
                <TableCard title="Recent Users">
                    {recentUsers.map((user, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 18px", borderBottom: i < recentUsers.length - 1 ? `1px solid ${C.borderSoft}` : "none",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 11, fontWeight: 700,
                                    background: user.avatarBg, color: user.avatarColor, flexShrink: 0,
                                }}>{user.initials}</div>
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

function PropertiesPage({ properties, setProperties }) {
    const [search, setSearch] = useState("");

    const filtered = properties.filter(p =>
        [p.title, p.type, p.price, p.location, p.status].join(" ").toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm("Delete this property?")) setProperties(d => d.filter(p => p.id !== id));
    };

    const handleApprove = (id) => {
        setProperties(d => d.map(p => p.id === id ? { ...p, status: "Active" } : p));
    };

    return (
        <TableCard title="All Listings" action={<SearchInput placeholder="Search properties…" value={search} onChange={setSearch} />}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr><TH>Title</TH><TH>Type</TH><TH>Price</TH><TH>Location</TH><TH>Status</TH><TH>Actions</TH></tr>
                </thead>
                <tbody>
                    {filtered.map(p => (
                        <tr key={p.id}
                            onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background = C.bg)}
                            onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background = "")}
                        >
                            <TD><span style={{ fontWeight: 600 }}>{p.title}</span></TD>
                            <TD><Badge type={p.type} /></TD>
                            <TD style={{ color: C.green, fontWeight: 600 }}>{formatCustomCurrency("NGN", p.price)}</TD>
                            <TD style={{ color: C.textSecondary }}>{p.location}</TD>
                            <TD><Badge type={p.status} /></TD>
                            <TD>
                                {p.status === "Pending" && <ActionBtn variant="approve" onClick={() => handleApprove(p.id)}>Approve</ActionBtn>}
                                <ActionBtn variant="danger" onClick={() => handleDelete(p.id)}>Delete</ActionBtn>
                            </TD>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}

function UsersPage({ users, setUsers }) {
    const [search, setSearch] = useState("");

    const filtered = users.filter(u =>
        [u.name, u.email, u.status, u.joined].join(" ").toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm("Delete this user?")) setUsers(d => d.filter(u => u.id !== id));
    };

    return (
        <TableCard title="All Users" action={<SearchInput placeholder="Search users…" value={search} onChange={setSearch} />}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr><TH>Name</TH><TH>Email</TH><TH>Listings</TH><TH>Joined</TH><TH>Status</TH><TH>Actions</TH></tr>
                </thead>
                <tbody>
                    {filtered.map(u => (
                        <tr key={u.userid}
                            onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background = C.bg)}
                            onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background = "")}
                        >
                            <TD><span style={{ fontWeight: 600 }}>{u.name}</span></TD>
                            <TD style={{ color: C.textSecondary }}>{u.email}</TD>
                            <TD>
                                <span style={{
                                    display: "inline-block", padding: "2px 10px", borderRadius: 99,
                                    background: u.listings > 0 ? C.greenLight : C.borderSoft,
                                    color: u.listings > 0 ? C.green : C.textSecondary,
                                    fontSize: 11, fontWeight: 600,
                                }}>{u.listings}</span>
                            </TD>
                            <TD style={{ color: C.textSecondary }}>{u.joined}</TD>
                            <TD><Badge type={u.status} /></TD>
                            <TD><ActionBtn variant="danger" onClick={() => handleDelete(u.id)}>Delete</ActionBtn></TD>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}

function InquiriesPage({ inquiries }) {
    return (
        <TableCard title="All Messages">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr><TH>From</TH><TH>Property</TH><TH>Message</TH><TH>Date</TH><TH>Status</TH></tr>
                </thead>
                <tbody>
                    {inquiries.map(inq => (
                        <tr key={inq.id}
                            onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background = C.bg)}
                            onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background = "")}
                        >
                            <TD><span style={{ fontWeight: 600 }}>{inq.from}</span></TD>
                            <TD style={{ color: C.textSecondary }}>{inq.property}</TD>
                            <TD style={{ color: C.textSecondary, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inq.message}</TD>
                            <TD style={{ color: C.textTertiary }}>{inq.date}</TD>
                            <TD><Badge type={inq.status} /></TD>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}

function SettingsPage() {
    const [siteName, setSiteName] = useState("TheNigerianProperties");
    const [email, setEmail] = useState("info@thenigeriaproperties.com");
    const [autoApprove, setAutoApprove] = useState("no");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const fieldStyle = {
        padding: "8px 12px", fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 8,
        background: C.white, color: C.text, outline: "none", width: "100%", maxWidth: 360,
        fontFamily: "inherit", transition: "border-color 0.15s",
    };

    const labelStyle = { fontSize: 12, color: C.textSecondary, display: "block", marginBottom: 6, fontWeight: 500 };

    return (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }}>
            <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>Site configuration & preferences</p>
            <div style={{ display: "grid", gap: 18, maxWidth: 400 }}>
                <div>
                    <label style={labelStyle}>Site Name</label>
                    <input style={fieldStyle} value={siteName} onChange={e => setSiteName(e.target.value)}
                        onFocus={e => e.target.style.borderColor = C.green}
                        onBlur={e => e.target.style.borderColor = C.border}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Contact Email</label>
                    <input style={fieldStyle} value={email} onChange={e => setEmail(e.target.value)}
                        onFocus={e => e.target.style.borderColor = C.green}
                        onBlur={e => e.target.style.borderColor = C.border}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Auto-approve Listings</label>
                    <select style={{ ...fieldStyle, maxWidth: 240, cursor: "pointer" }} value={autoApprove} onChange={e => setAutoApprove(e.target.value)}>
                        <option value="no">No — manual review</option>
                        <option value="yes">Yes — auto approve</option>
                    </select>
                </div>
                <div>
                    <button onClick={handleSave} style={{
                        padding: "9px 24px", fontSize: 13, fontWeight: 600,
                        background: saved ? C.greenMid : C.green, color: C.white,
                        border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s",
                    }}>{saved ? "✓ Saved!" : "Save Changes"}</button>
                </div>
            </div>
        </div>
    );
}

function NavItem({ item, active, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", cursor: "pointer", fontSize: 13,
                color: active ? C.green : hovered ? C.text : C.textSecondary,
                borderLeft: `2px solid ${active ? C.green : "transparent"}`,
                background: active ? C.greenLight : hovered ? C.bg : "transparent",
                fontWeight: active ? 600 : 400, transition: "all 0.15s",
            }}
        >
            <span style={{ fontSize: 15, width: 18, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
            {item.label}
        </div>
    );
}

const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "▪", section: "Main" },
    { id: "properties", label: "Properties", icon: "⌂", section: null },
    { id: "users", label: "Users", icon: "☺", section: null },
    { id: "inquiries", label: "Inquiries", icon: "✉", section: null },
    { id: "settings", label: "Settings", icon: "⚙", section: "System" },
];

export default function TNPAdminPanel() {
    const [notMounted, setNotmounted] = useState(true)
    function getsub(users = []) {
        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);

        const day = startOfWeek.getDay();
        const diff = day === 0 ? 6 : day - 1;

        startOfWeek.setDate(startOfWeek.getDate() - diff);

        const newUsersThisWeek = users.filter(user => {
            if (!user.createdAt) return false;

            const createdAt = new Date(user.createdAt);

            return !isNaN(createdAt) && createdAt >= startOfWeek;
        });

        return `+${newUsersThisWeek.length} users this week`;
    }

    const formatUserJoinDate = (createdAt) => {
        if (!createdAt) return "Unknown";
        const date = new Date(createdAt);
        if (Number.isNaN(date.getTime())) return "Unknown";
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    };

    function getsubListings(listings = []) {
        if (!Array.isArray(listings)) listings = [];

        const now = new Date();
        const startOfWeek = new Date(now);

        startOfWeek.setHours(0, 0, 0, 0);

        const day = startOfWeek.getDay();
        const diff = day === 0 ? 6 : day - 1;

        startOfWeek.setDate(startOfWeek.getDate() - diff);

        const newListingsThisWeek = listings.filter(listing => {
            if (!listing.createdAt) return false;

            const createdAt = new Date(listing.createdAt);

            return !isNaN(createdAt) && createdAt >= startOfWeek;
        });

        return `+${newListingsThisWeek.length} listings this week`;
    }
    const [users, setUsers] = useState([])
    const [userListings, setUserListings] = useState([])
    const usersThisWeek = getsub(users);
    const listingsThisWeek = getsubListings(userListings);

    const [stats, setStats] = useState([
        { label: "Total Listings", value: 0, sub: listingsThisWeek, subColor: C.greenMid, icon: "🏠" },
        { label: "Pending Approval", value: 0, sub: "Needs review", subColor: C.amber, icon: "⏳" },
        { label: "Total Users", value: 0, sub: usersThisWeek, subColor: C.greenMid, icon: "👤" },
    ])

    const [properties, setProperties] = useState([
        { id: "", title: "", type: "", price: "", location: "", status: "" },
    ])

    const [recentListings, setRecentListings] = useState([
        { initials: "", title: "", sub: "", status: "", avatarBg: C.greenLight, avatarColor: C.green },
    ])

    const [recentUsers, setRecentUsers] = useState([
        { initials: "AO", name: "Adaeze Obi", sub: "3 listings", avatarBg: "#E9E5FB", avatarColor: "#4C35B5", joined: "Today" },
    ])

    useEffect(() => {
        setNotmounted(false)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchUsers = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/all_users`, {
                    credentials: "include"
                })
                const data = await fetchUsers.json()
                setUsers(data.users)
                console.log(data.users[0])
                setStats(prev => prev.map(s =>
                    s.label === "Total Users" ? { ...s, value: data.users.length } : s
                ))
                setRecentUsers(data.users.slice(0, 5).map(u => {
                    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim()

                    return {
                        initials: fullName.slice(0, 2).toUpperCase().replace(/[^A-Z0-9]/g, ""),
                        name: fullName || u.email,
                        sub: u.role || "user",
                        avatarBg: u.avatarBg || "#E9E5FB",
                        avatarColor: u.avatarColor || "#4C35B5",
                        joined: `Joined ${formatUserJoinDate(u.createdAt)}`
                    }
                }))
            } catch (err) {
                console.error("Failed to fetch users", err)
            }
        }
        const fetchListing = async () => {
            try {
                const fetchUsers = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/all_listings`, {
                    credentials: "include"
                })
                const data = await fetchUsers.json()
                const { listings } = data
                console.log(listings[0])
                setUserListings(listings)
                setProperties(listings.map(l => ({
                    id: l._id,
                    title: l.title,
                    type: l.type,
                    price: l.price,
                    location: l.location,
                    status: l.status
                })))
                setStats(prev => prev.map(s =>
                    s.label === "Total Listings" ? { ...s, value: listings.length } : s
                ))

                if (listings.length > 0) {
                    setStats(prev => prev.map(s =>
                        s.label === "Pending Approval" ? { ...s, value: listings.filter(l => l.status === "pending" || l.status === "declined").length } : s
                    ))
                    setRecentListings(listings.slice(0, 5).map(l => ({
                        initials: l.title.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, ""),
                        title: l.title.length > 20 ? l.title.slice(0, 17) + "..." : l.title,
                        sub: `For ${l.listingType} • ${formatCustomCurrency("NGN", l.price, { listingType: l.listingType })}/yr`,
                        status: l.status,
                        avatarBg: l.avatarBg || C.greenLight,
                        avatarColor: l.avatarColor || C.green
                    })))

                }

            } catch (err) {
                console.error(err)
            }
        }
        fetchListing()
        fetchData()
    }, [])

    const [activePage, setActivePage] = useState("dashboard");

    const pages = {
        dashboard: <DashboardPage stats={stats} recentListings={recentListings} recentUsers={recentUsers} />,
        properties: <PropertiesPage properties={properties} setProperties={setProperties} />,
        users: <UsersPage users={users} setUsers={setUsers} />,
        settings: <SettingsPage />,
    };

    const pageTitles = {
        dashboard: "Dashboard",
        properties: "Properties",
        users: "Users",
        settings: "Settings",
    };

    if (notMounted) return <>Loading...</>

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: C.bg, minHeight: "100vh" }}>
            <nav style={{
                background: C.white, borderBottom: `1px solid ${C.border}`,
                padding: "0 24px", height: 56,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 100,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <TNPLogo />
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>THE NIGERIA PROPERTIES</div>
                        <div style={{ fontSize: 10, color: C.textSecondary, letterSpacing: "0.05em" }}>ADMIN PANEL</div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: C.greenLight, color: C.green,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700,
                    }}>A</div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Admin</div>
                        <div style={{ fontSize: 11, color: C.textSecondary }}>Super Admin</div>
                    </div>
                </div>
            </nav>

            <div style={{ display: "flex" }}>
                <aside style={{
                    width: 220, background: C.white, borderRight: `1px solid ${C.border}`,
                    minHeight: "calc(100vh - 56px)", padding: "16px 0",
                    position: "sticky", top: 56, height: "calc(100vh - 56px)", overflowY: "auto", flexShrink: 0,
                }}>
                    {NAV.map((item) => (
                        <div key={item.id}>
                            {item.section && (
                                <div style={{
                                    fontSize: 10, color: C.textTertiary, padding: "14px 20px 6px",
                                    textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
                                }}>{item.section}</div>
                            )}
                            <NavItem item={item} active={activePage === item.id} onClick={() => setActivePage(item.id)} />
                        </div>
                    ))}
                    <div style={{
                        margin: "24px 12px 0", padding: "14px", borderRadius: 10,
                        background: C.greenLight, border: `1px solid #B8E8D8`,
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 4 }}>TNP Admin v1.0</div>
                        <div style={{ fontSize: 11, color: C.greenMid }}>All systems operational</div>
                    </div>
                </aside>

                <main style={{ flex: 1, padding: "24px", minWidth: 0 }}>
                    <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, color: C.textSecondary }}>Admin</span>
                        <span style={{ fontSize: 12, color: C.textTertiary }}>/</span>
                        <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{pageTitles[activePage]}</span>
                    </div>
                    <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>{pageTitles[activePage]}</h1>
                        {activePage === "properties" && (
                            <button style={{
                                padding: "8px 18px", fontSize: 13, fontWeight: 600,
                                background: C.green, color: C.white,
                                border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                            }}>+ Add Property</button>
                        )}
                    </div>
                    {pages[activePage]}
                </main>
            </div>
        </div>
    );
}