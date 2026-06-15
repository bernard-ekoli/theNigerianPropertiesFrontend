"use client";
// pages/PropertiesPage.jsx
// Full listings table with search, approve, and delete.
// Table scrolls horizontally on small screens (min-width on the table element).

import { useState } from "react";
import {useRouter} from "next/navigation"
import { C } from "../constants.js";
import { formatCustomCurrency } from "../utils.js";
import TableCard, { TH, TD } from "../TableCard.jsx";
import Badge from "../Badge.jsx";
import ActionBtn from "../ActionBtn.jsx";
import SearchInput from "../SearchInput.jsx";

export default function PropertiesPage({ properties, setProperties }) {
  const [search, setSearch] = useState("");
  const router = useRouter()

  const filtered = properties.filter((p) =>
    [p.title, p.type, p.price, p.location, p.status]
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
    );

  const handleDelete = async (id) => {
    if (window.confirm("Delete this property?")) {
      try {
        const res = await fetch(
      `/api/admin/delete_listing?id=${id}`,
      {
        method:"DELETE",
        credentials: "include",
      }
      );
        console.log(res);

        setProperties((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("An Error Occurred:", err);
      }
    }
  };

  const handleApprove = (id) =>{

  }
  const viewListing = (id) => {
    console.log("This is the listing: ",id)
    router.push("/properties/"+id)
  }
  const highlightRow = (e) =>
  [...e.currentTarget.cells].forEach((c) => (c.style.background = C.bg));
  const resetRow = (e) =>
  [...e.currentTarget.cells].forEach((c) => (c.style.background = ""));

  return (
    <TableCard
      title="All Listings"
      action={
        <SearchInput
          placeholder="Search properties…"
          value={search}
          onChange={setSearch}
          />
        }
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
          <thead>
            <tr>
              <TH>Title</TH>
              <TH>Type</TH>
              <TH>Price</TH>
              <TH>Location</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} onMouseEnter={highlightRow} onMouseLeave={resetRow}>
                <TD>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                </TD>
                <TD>
                  <Badge type={p.type} />
                </TD>
                <TD style={{ color: C.green, fontWeight: 600 }}>
                  {formatCustomCurrency("NGN", p.price)}
                </TD>
                <TD style={{ color: C.textSecondary }}>{p.location}</TD>
                <TD>
                  <Badge type={p.status} />
                </TD>
                <TD>
                  {p.status === "Pending" && (
                    <ActionBtn variant="approve" onClick={() => handleApprove(p.id)}>
                      Approve
                    </ActionBtn>
                    )}
                  <ActionBtn variant="danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </ActionBtn>
                  <ActionBtn variant="default" onClick={() => viewListing(p.id)}>
                    View
                  </ActionBtn>
                </TD>
              </tr>
              ))}
          </tbody>
        </table>
      </TableCard>
      );
}