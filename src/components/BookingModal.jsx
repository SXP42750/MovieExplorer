import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { saveBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

export default function BookingModal({ movie, isOpen, onClose }) {
  const { user } = useAuth(); 
  const [tickets, setTickets] = useState(1); 
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); }; //when escape the modal closes
    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden"; 
    return () => {  
      document.removeEventListener("keydown", onKey); 
      document.body.style.overflow = original; 
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const decrement = () => setTickets((t) => Math.max(1, t - 1));
  const increment = () => setTickets((t) => Math.min(5, t + 1));

  const handleBook = async () => {
    if (!date || !time) { alert("Please select both date and time!"); return; }
    if (!user) { alert("You must be logged in to book tickets!"); return; }

    const bookingData = {
      movieTitle: movie.title,
      movieId: movie.id,
      tickets,
      date,
      time,
      user: user.displayName || user.email,
      userEmail: user.email,
      status: "Confirmed",
      totalAmount: tickets * 20, 
      createdAt: new Date().toISOString(), 
    };

    try {
      await saveBooking(bookingData);
      alert(`You booked ${tickets} tickets for "${movie.title}" on ${date} at ${time}`);
      onClose();
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong while booking.");
    }
  };

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.6)",
    zIndex: 100000,
  };

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const boxStyle = {
  background: prefersDark ? "#111827" : "#fff",
  color: prefersDark ? "#f8fafc" : "#111827",
  borderRadius: 10,
  padding: 20,
  width: "min(720px, 94%)",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  position: "relative",
};


  return ReactDOM.createPortal(
    <div id="booking-modal-overlay" style={overlayStyle} onMouseDown={onClose}>
      <div style={boxStyle} onMouseDown={(e) => e.stopPropagation()} ref={ref} role="dialog" aria-modal="true"> 
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", right: 12, top: 10, background: "transparent", border: "none", fontSize: 20, cursor: "pointer" }}
        >
          ×
        </button>

        <h2 style={{ margin: 0, marginBottom: 8, fontSize: 22 }}>Book Tickets</h2>
        <p style={{ marginTop: 0, marginBottom: 12, fontWeight: 500 }}>{movie.title}</p>

        <div style={{ display: "grid", gap: 12 }}>
          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Select Date</div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </label>

          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Select Time</div>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={decrement} style={{ padding: "6px 10px" }}>-</button>
            <div style={{ minWidth: 32, textAlign: "center" }}>{tickets}</div>
            <button onClick={increment} style={{ padding: "6px 10px" }}>+</button>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button onClick={handleBook} style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Confirm</button>
            <button onClick={onClose} style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #ccc" }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
