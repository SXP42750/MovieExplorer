import React from "react";
import MovieList from "../components/MovieList";

export default function Home({ query, genreId, language, rating, sortBy }) {
  return (
    <div className="home-container">
      <MovieList
        query={query}
        genreId={genreId}
        language={language}
        rating={rating}
        sortBy={sortBy}
      />
    </div>
  );
}

