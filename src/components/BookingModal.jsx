
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { saveBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

export default function BookingModal({ movie, isOpen, onClose }) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmation, setConfirmation] = useState(null); 
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [isOpen, onClose]);

  
  useEffect(() => {
    if (confirmation?.success) {
      const timer = setTimeout(() => {
        onClose();
        setConfirmation(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [confirmation, onClose]);

  if (!isOpen || !movie) return null;

  const decrement = () => setTickets((t) => Math.max(1, t - 1));
  const increment = () => setTickets((t) => Math.min(5, t + 1));

  const handleBook = async () => {
    if (!date || !time) {
      setConfirmation({ error: "Please select both date and time!" });
      return;
    }
    if (!user) {
      setConfirmation({ error: "You must be logged in to book tickets!" });
      return;
    }

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
      setConfirmation({
        success: `🎉 You booked ${tickets} tickets for "${movie.title}" on ${date} at ${time}`,
      });
    } catch (err) {
      console.error("Booking error:", err);
      setConfirmation({ error: "Something went wrong while booking." });
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
    padding: "10px",
  };

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const boxStyle = {
    background: prefersDark ? "#1f2937" : "#fff",
    color: prefersDark ? "#f8fafc" : "#111827",
    borderRadius: 16,
    padding: 24,
    width: "min(420px, 100%)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
    position: "relative",
    animation: "fadeIn 0.3s ease",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 15,
    marginTop: 4,
  };

  const buttonPrimary = {
    flex: 1,
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  };

  const buttonSecondary = {
    flex: 1,
    padding: "10px 16px",
    background: prefersDark ? "#374151" : "#f3f4f6",
    color: prefersDark ? "#f9fafb" : "#111827",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  };

  const popupStyle = {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    textAlign: "center",
    background: confirmation?.error ? "#fee2e2" : "#dcfce7",
    color: confirmation?.error ? "#b91c1c" : "#166534",
    border: `1px solid ${confirmation?.error ? "#fecaca" : "#bbf7d0"}`,
    fontWeight: 500,
  };

  return ReactDOM.createPortal(
    <div id="booking-modal-overlay" style={overlayStyle} onMouseDown={onClose}>
      <div
        style={boxStyle}
        onMouseDown={(e) => e.stopPropagation()}
        ref={ref}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            right: 14,
            top: 14,
            background: "transparent",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            color: prefersDark ? "#f9fafb" : "#374151",
          }}
        >
          ×
        </button>

        <h2 style={{ margin: 0, marginBottom: 8, fontSize: 24, fontWeight: "700", textAlign: "center" }}>
          🎬 Book Tickets
        </h2>
        <p style={{ marginTop: 0, marginBottom: 20, textAlign: "center", fontWeight: 500, fontSize: 16 }}>
          {movie.title}
        </p>

        {!confirmation ? (
          <div style={{ display: "grid", gap: 16 }}>
            <label>
              <div style={{ fontSize: 14, marginBottom: 4 }}>Select Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={inputStyle}
              />
            </label>

            <label>
              <div style={{ fontSize: 14, marginBottom: 4 }}>Select Time</div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={inputStyle}
              />
            </label>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <button onClick={decrement} style={{ ...buttonSecondary, maxWidth: 50 }}>-</button>
              <div style={{ fontSize: 16, fontWeight: "600" }}>{tickets}</div>
              <button onClick={increment} style={{ ...buttonSecondary, maxWidth: 50 }}>+</button>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button
                onClick={handleBook}
                style={buttonPrimary}
                onMouseOver={(e) => (e.target.style.background = "#1e40af")}
                onMouseOut={(e) => (e.target.style.background = "#2563eb")}
              >
                Confirm
              </button>
              <button onClick={onClose} style={buttonSecondary}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={popupStyle}>{confirmation.success || confirmation.error}</div>
        )}
      </div>
    </div>,
    document.body
  );
}

