import React, { useEffect, useMemo, useState } from "react";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../AdminDashboard.css"; 
const db = getFirestore();

function formatMaybeTimestamp(value) {
  if (!value) return "-";
  if (typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate().toLocaleString();
  }
  if (typeof value === "number") {
    return new Date(value).toLocaleString();
  }
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d)) return d.toLocaleString();
    return value;
  }
  return String(value);
}

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!isAdmin) return; 
    setLoading(true);

    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setBookings(rows);
        setLoading(false);
      },
      (err) => {
        console.error("bookings snapshot error", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [isAdmin]);

  
  const normalize = (b) => {
    const movieTitle = b.movieTitle || b.movie || b.showName || "-";
    const userName = b.userName || b.user || b.customerName || b.name || "";
    const userEmail = b.userEmail || b.email || (b.user && b.user.email) || "";
    const phone = b.phone || b.mobile || b.contact || "";
    const tickets = Array.isArray(b.tickets) ? b.tickets.length : (b.numTickets || b.tickets || 0);
    const status = b.status || b.confirmed ? "Confirmed" : (b.status || "N/A");
    
    const dateTime =
      b.createdAt || b.bookingTime || (b.showDate ? `${b.showDate} ${b.showTime || b.time || ""}` : null);
    const totalAmount = Number(b.totalAmount ?? b.amount ?? b.price ?? 0);

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
      seats: b.seats || b.selectedSeats || [],
    };
  };

  const normalizedBookings = useMemo(() => bookings.map(normalize), [bookings]);

  
  const filtered = useMemo(() => {
    if (!search.trim()) return normalizedBookings;
    const q = search.trim().toLowerCase();
    return normalizedBookings.filter((b) => {
      return (
        (b.movieTitle || "").toLowerCase().includes(q) ||
        (b.userName || "").toLowerCase().includes(q) ||
        (b.userEmail || "").toLowerCase().includes(q) ||
        (b.phone || "").toLowerCase().includes(q) ||
        String(b.id || "").toLowerCase().includes(q)
      );
    });
  }, [normalizedBookings, search]);

  const totalRevenue = normalizedBookings.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);

  if (!user) return <p style={{ padding: 20 }}>Please log in to view this page.</p>;
  if (!isAdmin) return <p style={{ padding: 20 }}>Access Denied. Admins only.</p>;


  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="admin-search">
          <input
            type="text"
            placeholder="Search by movie, user, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search bookings"
          />
          <button onClick={() => setSearch("")} className="btn-clear">
            Clear
          </button>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-table-wrapper">
        {loading ? (
          <p>Loading bookings...</p>
        ) : filtered.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {["Movie", "User", "Email", "Phone", "Date/Time", "Tickets", "Status", "Total", "Actions"].map((th) => (
                  <th key={th}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <React.Fragment key={b.id}>
                  <tr>
                    <td>{b.movieTitle}</td>
                    <td>{b.userName || "-"}</td>
                    <td>{b.userEmail || "-"}</td>
                    <td>{b.phone || "-"}</td>
                    <td>{formatMaybeTimestamp(b.dateTime)}</td>
                    <td>{b.tickets}</td>
                    <td className={b.status === "Confirmed" ? "status-confirmed" : "status-cancelled"}>
                      {b.status}
                    </td>
                    <td className="total-amount">${Number(b.totalAmount).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                        className="btn-details"
                      >
                        {expandedId === b.id ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>

                  {expandedId === b.id && (
                    <tr>
                      <td colSpan={9} className="expanded-row">
                        <div className="expanded-content">
                          <div>
                            <strong>Booking ID</strong>
                            <div>{b.id}</div>
                          </div>
                          <div>
                            <strong>Seats</strong>
                            <div>{b.seats?.length ? b.seats.join(", ") : "N/A"}</div>
                          </div>
                          <div>
                            <strong>Raw time</strong>
                            <div>{JSON.stringify(b.raw.createdAt || b.raw.bookingTime || b.raw.showDate)}</div>
                          </div>
                          <div className="json-preview">
                            <strong>Full booking JSON</strong>
                            <pre>{JSON.stringify(b.raw, null, 2)}</pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
