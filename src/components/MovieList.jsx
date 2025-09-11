// src/components/MovieList.jsx

import React, { useEffect, useState } from "react";
import { getMovies, getGenres, LANGUAGES } from "../api/tmdb";
import MovieCard from "./MovieCard";

export default function MovieList() {
  const [movies, setMovies] = useState([]); //array of movies object to dispaly
  const [genres, setGenres] = useState([]); //list of genres object for the genre dropdown
  const [query, setQuery] = useState(""); // search text input
  //current filters state
  const [genreId, setGenreId] = useState(""); 
  const [language, setLanguage] = useState("");
  const [minRating, setMinRating] = useState("");
  //pagination current page and total pages
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); // total pages from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch genres on mount
  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []); // we use empty dependency array to run this effect only once on mount

  // Fetch movies whenever filters change
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true); // sets loading and clear error
      setError(null);
      try {
        const data = await getMovies({
          query,
          page,
          genreId,
          language,
          minRating,
        });
        if (!cancelled) { 
          setMovies(data.results || []); //
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load movies");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { // cleanup function to avoid updating state on unmounted component
      cancelled = true;
    };
  }, [query, page, genreId, language, minRating]);

  return ( 
    <div style={{ padding: 16 }}> 
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value); // update search text
            setPage(1); // reset to first page on new search
          }}
          style={{ padding: 8 }}
        />

        {/* Genre Dropdown */}
        <select value={genreId} onChange={(e) => setGenreId(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Language Dropdown */}
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">All Languages</option>
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>

        {/* Rating Dropdown */}
        <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
          <option value="">Min Rating</option>
          {[...Array(10).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}+
            </option>
          ))} 
        </select>
      </div>

      {/* Status */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Movies */}
      <div className="movie-grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>


      {/* Pagination */}
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: "0 8px" }}>
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
