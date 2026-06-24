"use client";
// pages/UsersPage.jsx
// Full users table with search and delete.

import { useState } from "react";
import { C } from "../constants.js";
import TableCard, { TH, TD } from "../TableCard.jsx";
import Badge from "../Badge.jsx";
import ActionBtn from "../ActionBtn.jsx";
import SearchInput from "../SearchInput.jsx";

export default function UsersPage({ users, setUsers }) {
  const [search, setSearch] = useState("");
  console.log("users", users)
  const filtered = users.filter((u) =>
    [u.name, u.email, u.status, u.joined]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?"))
      setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const highlightRow = (e) =>
    [...e.currentTarget.cells].forEach((c) => (c.style.background = C.bg));
  const resetRow = (e) =>
    [...e.currentTarget.cells].forEach((c) => (c.style.background = ""));

  return (
    <TableCard
      title="All Users"
      action={
        <SearchInput
          placeholder="Search users…"
          value={search}
          onChange={setSearch}
        />
      }
    >
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
        <thead>
          <tr>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Listings</TH>
            <TH>Joined</TH>
            <TH>Status</TH>
            <TH>Actions</TH>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u._id} onMouseEnter={highlightRow} onMouseLeave={resetRow}>
              <TD>
                <span style={{ fontWeight: 600 }}>{u.firstName}</span>
              </TD>
              <TD style={{ color: C.textSecondary }}>{u.email}</TD>
              <TD>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 99,
                    background: u.listings > 0 ? C.greenLight : C.borderSoft,
                    color: u.listings > 0 ? C.green : C.textSecondary,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {u.listingsCount} Listings
                </span>
              </TD>
              <TD style={{ color: C.textSecondary }}>{u.joined}</TD>
              <TD>
                <Badge type={u.status} />
              </TD>
              <TD>
                <ActionBtn variant="danger" onClick={() => handleDelete(u._id)}>
                  Delete
                </ActionBtn>
                <ActionBtn variant="approve" onClick={() => fetchUsersListing(u._id)}>
                  Make Admin
                </ActionBtn>
              </TD>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}