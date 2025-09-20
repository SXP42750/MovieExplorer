import React, { useEffect, useMemo, useState } from "react";
import { getBookings } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import "../AdminDashboard.css";

function formatMaybeTimestamp(value) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date)) return String(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const normalizeSearch = (str) =>
  (str || "").toString().toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const token = user?.token || user?.accessToken || null;

  const [bookingsRaw, setBookingsRaw] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    
    setLoading(true);

    const fetchBookings = async () => {
      try {
        const data = await getBookings(token);
        console.log("RAW response from GET /api/bookings:", data);

        
        let serverBookings = [];
        let serverTotal = 0;

        if (Array.isArray(data)) {
          serverBookings = data;
        } else if (data && typeof data === "object") {
          serverBookings = data.bookings ?? [];
          serverTotal = data.totalRevenue ?? data.total_revenue ?? 0;
        } else {
          console.warn("Unexpected response shape for bookings:", data);
        }

        // Defensive mapping: ensure id and createdAt exist
        const bs = serverBookings.map((b) => ({
          ...b,
          id: b._id ?? b.id ?? String(Math.random()).slice(2),
          createdAt: b.createdAt ?? b.date ?? b.bookingTime ?? null,
        }));

        console.log("Normalized bookings to set in state (first 5):", bs.slice(0, 5));
        setBookingsRaw(bs);
        setTotalRevenue(Number(serverTotal || 0));
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookingsRaw([]);
        setTotalRevenue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAdmin, token]);

  const normalizedBookings = useMemo(() => {
    return bookingsRaw.map((b) => {
      const movieTitle = b.movieTitle || b.movie || b.showName || "-";
      const userName = b.userName || b.user || b.customerName || b.name || "";
      const userEmail = b.userEmail || b.email || (b.user && b.user.email) || "";
      const phone = b.phone || b.mobile || b.contact || "-";
      const tickets = Number(b.tickets) || (Array.isArray(b.seats) ? b.seats.length : 0);
      const status = b.status || (b.confirmed ? "Confirmed" : "N/A");

      const dateTime = b.createdAt ?? b.date ?? b.bookingTime ?? null;

      const totalAmount = Number(b.totalAmount ?? b.amount ?? 0);
      const seats = b.seats || b.selectedSeats || [];

      const searchKey = [
        normalizeSearch(movieTitle),
        normalizeSearch(userName),
        normalizeSearch(userEmail),
        normalizeSearch(phone),
        normalizeSearch(b.id),
      ]
        .filter(Boolean)
        .join("|");

      return {
        id: b.id,
        raw: b,
        movieTitle,
        userName,
        userEmail,
        phone,
        tickets,
        status,
        dateTime,
        totalAmount,
        seats,
        searchKey,
      };
    });
  }, [bookingsRaw]);

  const filtered = useMemo(() => {
    let filteredData = normalizedBookings;
    if (search.trim()) {
      const q = normalizeSearch(search.trim());
      filteredData = normalizedBookings.filter((b) => b.searchKey.includes(q));
    }
    
    return filteredData.sort((a, b) => {
      const tA = new Date(a.dateTime).getTime() || 0;
      const tB = new Date(b.dateTime).getTime() || 0;
      return tB - tA;
    });
  }, [normalizedBookings, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageBookings = filtered.slice(startIndex, endIndex);

  
  useEffect(() => {
    console.log("filtered length:", filtered.length);
  }, [filtered]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Copied!");
      setTimeout(() => setCopyMessage(""), 1500);
    } catch (e) {
      console.error("copy failed", e);
      setCopyMessage("Copy failed");
      setTimeout(() => setCopyMessage(""), 1500);
    }
  };

  const getPageRange = (current, total, maxButtons = 7) => {
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };

  if (!user) return <p style={{ padding: 20 }}>Please log in to view this page.</p>;
  

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Total Revenue: ${Number(totalRevenue || 0).toFixed(2)}</p>
        </div>

        <div className="admin-search">
          <input
            type="text"
            placeholder="Search by movie, user, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search bookings"
          />
          <button onClick={() => setSearch("")} className="btn-clear">Clear</button>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="admin-table-wrapper">
        {loading ? (
          <p>Loading bookings...</p>
        ) : filtered.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  {["Movie", "User", "Email", "Phone", "Date/Time", "Tickets", "Status", "Total", "Actions"].map(
                    (th) => (<th key={th}>{th}</th>)
                  )}
                </tr>
              </thead>
              <tbody>
                {pageBookings.map((b) => (
                  <React.Fragment key={b.id}>
                    <tr>
                      <td>{b.movieTitle}</td>
                      <td>{b.userName || "-"}</td>
                      <td>{b.userEmail || "-"}</td>
                      <td>{b.phone || "-"}</td>
                      <td>{formatMaybeTimestamp(b.dateTime)}</td>
                      <td>{b.tickets}</td>
                      <td className={b.status === "Confirmed" ? "status-confirmed" : "status-cancelled"}>{b.status}</td>
                      <td className="total-amount">${Number(b.totalAmount).toFixed(2)}</td>
                      <td>
                        <button onClick={() => setExpandedId(expandedId === b.id ? null : b.id)} className="btn-details">
                          {expandedId === b.id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>

                    {expandedId === b.id && (
                      <tr>
                        <td colSpan={9} className="expanded-row">
                          <div className="expanded-content">
                            <div className="expanded-item">
                              <strong>Booking ID</strong>
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <span>{b.id}</span>
                                <button onClick={() => copyToClipboard(b.id)} className="btn-small">Copy</button>
                              </div>
                            </div>
                            <div className="expanded-item"><strong>Movie</strong><div>{b.movieTitle || "-"}</div></div>
                            <div className="expanded-item">
                              <strong>Tickets</strong>
                              <div>
                                {typeof b.tickets === "number"
                                  ? `${b.tickets} ticket${b.tickets !== 1 ? "s" : ""}`
                                  : (Array.isArray(b.seats) && b.seats.length)
                                  ? `${b.seats.length} ticket${b.seats.length !== 1 ? "s" : ""} (${b.seats.join(", ")})`
                                  : "N/A"}
                              </div>
                            </div>
                          </div>

                          {copyMessage && <div className="copy-message">{copyMessage}</div>}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div className="pagination-bar" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>

              {getPageRange(page, totalPages, 7).map((pNum) => (
                <button key={pNum} onClick={() => setPage(pNum)} aria-current={pNum === page ? "page" : undefined}
                  style={{ padding: "6px 8px", background: pNum === page ? "#333" : undefined, color: pNum === page ? "#fff" : undefined, borderRadius: 4 }}>
                  {pNum}
                </button>
              ))}

              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>

              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <div>Showing {Math.min(filtered.length, startIndex + 1)}–{Math.min(filtered.length, endIndex)} of {filtered.length}</div>
                <label>
                  Per page:
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} style={{ marginLeft: 6 }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
