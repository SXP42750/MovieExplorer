// import React, { useState } from "react";
// import { getImageUrl } from "../api/tmdb";
// import BookingModal from "./BookingModal";
// import MovieDetailModal from "./MovieDetailModal";

// function MovieCard({ movie }) {
//   const [isBookingOpen, setIsBookingOpen] = useState(false);
//   const [isDetailOpen, setIsDetailOpen] = useState(false);

//   const poster = getImageUrl(movie.poster_path, "w342");
//   const rating = movie.vote_average ?? 0;

//   return (
//     <>
//       <div style={styles.card}>
//         <div style={styles.imageWrapper}>
//           {poster ? (
//             <>
//               <img src={poster} alt={movie.title} style={styles.poster} />
//               <button
//                 style={styles.overlayBtn}
//                 onClick={() => setIsDetailOpen(true)}
//                 aria-label="View details"
//               >
//                 ▶
//               </button>
//             </>
//           ) : (
//             <div style={styles.noImage}>No image</div>
//           )}
//         </div>

//         <div style={styles.content}>
//           <h3 style={styles.title}>{movie.title}</h3>
//           <div style={styles.meta}>
//             <svg
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               aria-hidden
//               style={{ color: "#facc15" }}
//             >
//               <path
//                 fill="currentColor"
//                 d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.167L12 18.896 4.664 23.164 6.066 15 0.132 9.213l8.2-1.192z"
//               />
//             </svg>
//             <span>{rating.toFixed(1)}/10</span>
//           </div>
//         </div>

//         <div style={styles.footer}>
//           <button
//             onClick={() => setIsBookingOpen(true)}
//             style={styles.bookBtn}
//           >
//             Book Now
//           </button>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       <BookingModal
//         movie={movie}
//         isOpen={isBookingOpen}
//         onClose={() => setIsBookingOpen(false)}
//       />

//       {/* Detail Modal */}
//       {isDetailOpen && (
//         <MovieDetailModal
//           movieId={movie.id}
//           onClose={() => setIsDetailOpen(false)}
//         />
//       )}
//     </>
//   );
// }

// const styles = {
//   card: {
//     display: "flex",
//     flexDirection: "column",
//     background: "var(--card-bg, #fff)",
//     color: "var(--card-text, #111)",
//     borderRadius: "10px",
//     overflow: "hidden",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//     transition: "transform 0.2s ease, box-shadow 0.2s ease",
//     cursor: "pointer",
//     maxWidth: "240px",
//     width: "100%",
//   },
//   imageWrapper: {
//     position: "relative",
//     width: "100%",
//     aspectRatio: "2/3",
//     overflow: "hidden",
//   },
//   poster: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     display: "block",
//     transition: "transform 0.3s ease",
//   },
//   overlayBtn: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     background: "rgba(0,0,0,0.6)",
//     border: "none",
//     borderRadius: "50%",
//     width: "50px",
//     height: "50px",
//     fontSize: "22px",
//     color: "#fff",
//     cursor: "pointer",
//     transition: "background 0.2s ease",
//   },
//   noImage: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#ddd",
//     height: "100%",
//     color: "#666",
//   },
//   content: {
//     padding: "10px",
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: "16px",
//     margin: "0 0 6px",
//     fontWeight: "600",
//     lineHeight: "1.4",
//   },
//   meta: {
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     fontSize: "14px",
//     color: "#555",
//   },
//   footer: {
//     padding: "10px",
//     borderTop: "1px solid rgba(0,0,0,0.1)",
//     textAlign: "center",
//   },
//   bookBtn: {
//     padding: "8px 14px",
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontWeight: "500",
//     transition: "background 0.2s ease",
//   },
// };

// export default MovieCard;

import React, { useState } from "react";
import { getImageUrl } from "../api/tmdb";
import BookingModal from "./BookingModal";
import MovieDetailModal from "./MovieDetailModal";

function MovieCard({ movie }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const poster = getImageUrl(movie.poster_path, "w342");
  const rating = movie.vote_average ?? null;

  return (
    <>
      <div style={styles.card}>
        {/* Poster + Play button */}
        <div style={styles.imageWrapper}>
          {poster ? (
            <>
              <img src={poster} alt={movie.title} style={styles.poster} />
              <button
                style={styles.overlayBtn}
                onClick={() => setIsDetailOpen(true)}
                aria-label="View details"
              >
                ▶
              </button>
            </>
          ) : (
            <div style={styles.noImage}>No image</div>
          )}
        </div>

        {/* Title + Rating */}
        <div style={styles.content}>
          <h3 style={styles.title}>{movie.title}</h3>
          {rating ? (
            <div style={styles.meta}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden
                style={{ color: "#facc15" }} // gold star
              >
                <path
                  fill="currentColor"
                  d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.167L12 18.896 4.664 23.164 6.066 15 0.132 9.213l8.2-1.192z"
                />
              </svg>
              <span style={styles.ratingText}>{rating.toFixed(1)}/10</span>
            </div>
          ) : (
            <div style={styles.meta}>
              <span style={styles.ratingText}>No rating</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            onClick={() => setIsBookingOpen(true)}
            style={styles.bookBtn}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        movie={movie}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Detail Modal */}
      {isDetailOpen && (
        <MovieDetailModal
          movieId={movie.id}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    background: "var(--card-bg, #fff)",
    color: "var(--card-text, #111)",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    maxWidth: "240px",
    width: "100%",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "2/3",
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
  },
  overlayBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0.6)",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "22px",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.2s ease, transform 0.2s ease",
  },
  noImage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ddd",
    height: "100%",
    color: "#666",
  },
  content: {
    padding: "10px",
    flexGrow: 1,
  },
  title: {
    fontSize: "16px",
    margin: "0 0 6px",
    fontWeight: "600",
    lineHeight: "1.4",
    color: "var(--card-text)", // ✅ dynamic with theme
    textAlign: "center",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "14px",
  },
  ratingText: {
    color: "var(--card-text)", // ✅ now follows theme
    fontWeight: "500",
  },
  footer: {
    padding: "10px",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  bookBtn: {
    padding: "8px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background 0.2s ease",
  },
};

export default MovieCard;
