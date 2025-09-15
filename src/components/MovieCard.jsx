import React, { useState } from "react";
import { getImageUrl } from "../api/tmdb";
import BookingModal from "./BookingModal";

function MovieCard({ movie }) { 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const poster = getImageUrl(movie.poster_path, "w342"); 

  const rating = movie.vote_average ?? 0;

  return (
    <>
      <div className="movie-card">
        <div className="movie-card__image">
          {poster ? <img src={poster} alt={movie.title} className="movie-card__img" /> : <div className="movie-card__noimg">No image</div>}
        </div>

        <div className="movie-card__content">
          <h3 className="movie-card__title">{movie.title}</h3>
         <div className="movie-card__meta" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg
              className="star-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.167L12 18.896 4.664 23.164 6.066 15 0.132 9.213l8.2-1.192z"
              />
            </svg>
            <span className="rating-number">{rating.toFixed(1)}/10</span>
          </div>
        </div>

        <div className="movie-card__footer">
          <button onClick={() => setIsModalOpen(true)} className="btn btn--primary">Book Now</button>
        </div>
      </div>

      <BookingModal movie={movie} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default MovieCard;



