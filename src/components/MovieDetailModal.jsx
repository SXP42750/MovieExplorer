import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getMovieDetails } from "../api/tmdb";

export default function MovieDetailModal({ movieId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = document.body.getAttribute("data-theme") || "light";
  const isDark = theme === "dark";

  // Fetch movie details
  useEffect(() => {
    if (!movieId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(movieId);

        setDetails({
          ...data,
          trailer: data.videos?.results?.find((v) => v.type === "Trailer"),
          cast: data.credits?.cast?.slice(0, 6) || [],
        });
      } catch (err) {
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  
  useEffect(() => {
    if (!details?.trailer) return;

   
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("yt-trailer", {
        events: {
          onStateChange: (event) => {
           
            if (event.data === 0) onClose();
          },
        },
      });
    };

    return () => {
      if (window.YT && window.YT.get) {
        const player = window.YT.get("yt-trailer");
        if (player) player.destroy();
      }
    };
  }, [details?.trailer, onClose]);

  if (!movieId) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    padding: "20px",
  };

  const modalStyle = {
    background: isDark
      ? "linear-gradient(135deg, #1f1f1f, #121212)"
      : "linear-gradient(135deg, #fff, #f5f5f5)",
    borderRadius: "16px",
    maxWidth: "800px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
    color: isDark ? "#f5f5f5" : "#111",
    transition: "all 0.3s ease",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const closeBtnStyle = {
    position: "absolute",
    top: "10px",
    right: "14px",
    fontSize: "24px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: isDark ? "#eee" : "#333",
  };

  if (loading) {
    return ReactDOM.createPortal(
      <div style={overlayStyle} onClick={onClose}>
        <div
          style={{
            ...modalStyle,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            padding: "40px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          Loading movie details...
        </div>
      </div>,
      document.body
    );
  }

  if (!details) return null;

  const poster = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : null;
  const subTextColor = isDark ? "#bbb" : "#555";

  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close">
          ×
        </button>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {poster && (
            <img
              src={poster}
              alt={details.title}
              style={{
                width: "250px",
                borderTopLeftRadius: "16px",
                borderBottomLeftRadius: "16px",
                objectFit: "cover",
              }}
            />
          )}

          <div style={{ flex: 1, padding: "20px" }}>
            <h2 style={{ margin: "0 0 10px" }}>{details.title}</h2>
            <p style={{ margin: "6px 0", fontSize: "14px", color: subTextColor }}>
              {details.release_date || "Unknown Release Date"}
              {details.runtime ? ` • ${details.runtime} min` : ""}
            </p>
            <p
              style={{
                margin: "6px 0",
                fontWeight: "600",
                color: isDark ? "#ffd700" : "#f59e0b",
              }}
            >
              ⭐{" "}
              {typeof details.vote_average === "number" && details.vote_average > 0
                ? details.vote_average.toFixed(1)
                : "Not Rated"}
              /10
            </p>
            <p style={{ marginTop: "12px", lineHeight: "1.5", color: subTextColor }}>
              {details.overview?.trim() || "No description available for this movie."}
            </p>
          </div>
        </div>

        
        {details.trailer && (
          <div style={{ padding: "20px" }}>
            <h3>🎬 Trailer</h3>
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                id="yt-trailer"
                src={`https://www.youtube.com/embed/${details.trailer.key}?enablejsapi=1&autoplay=1`}
                title="Trailer"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "8px",
                }}
                allow="autoplay; encrypted-media"
              />
            </div>
          </div>
        )}

        
        {details.cast?.length > 0 && (
          <div style={{ padding: "20px" }}>
            <h3>👥 Cast</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {details.cast.map((actor) => (
                <div
                  key={actor.id}
                  style={{ width: "100px", textAlign: "center", fontSize: "13px" }}
                >
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      style={{ width: "100%", borderRadius: "8px", marginBottom: "6px" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        background: isDark ? "#333" : "#eee",
                        borderRadius: "8px",
                        marginBottom: "6px",
                      }}
                    />
                  )}
                  <div>{actor.name}</div>
                  <div style={{ color: subTextColor, fontSize: "12px" }}>{actor.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
