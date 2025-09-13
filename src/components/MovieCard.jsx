import React, { useState } from "react";
import { getImageUrl } from "../api/tmdb";
import BookingModal from "./BookingModal";

function MovieCard({ movie }) { 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const poster = getImageUrl(movie.poster_path, "w342"); 

  return (
    <>
      <div className="movie-card">
        <div className="movie-card__image">
          {poster ? <img src={poster} alt={movie.title} className="movie-card__img" /> : <div className="movie-card__noimg">No image</div>}
        </div>

        <div className="movie-card__content">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__meta">Rating: {movie.vote_average ?? "—"}</div>
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



