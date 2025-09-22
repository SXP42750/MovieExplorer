
import React, { useEffect, useState } from "react";
import { getMovies } from "../api/tmdb";
import MovieCard from "./MovieCard";

export default function MovieList({ query, genreId, language, rating, sortBy }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const data = await getMovies({ query, genreId, language, rating, page });
        if (!cancelled) {
          setMovies(data.results || []);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load movies");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => { cancelled = true; };
  }, [query, genreId, language, rating, page]);

  
  const filteredMovies = movies.filter((m) => {
    const matchesQuery = !query || (m.title && m.title.toLowerCase().includes(query.toLowerCase()));
    const matchesGenre = !genreId || (m.genre_ids && m.genre_ids.includes(Number(genreId)));
    const matchesLanguage = !language || m.original_language === language;
    const matchesRating = !rating || (m.vote_average >= Number(rating));
    return matchesQuery && matchesGenre && matchesLanguage && matchesRating;
  });

  const sortedMovies = (() => {
    if (!sortBy) return filteredMovies;

    const [field, order] = sortBy.split("_");
    return [...filteredMovies].sort((a, b) => {
      let va = a[field] ?? 0;
      let vb = b[field] ?? 0;

      if (field === "release" || field === "release_date") {
        va = a.release_date ? new Date(a.release_date).getTime() : 0;
        vb = b.release_date ? new Date(b.release_date).getTime() : 0;
      }

      if (field === "title") {
        va = va || "";
        vb = vb || "";
        return order === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }

      return order === "asc" ? va - vb : vb - va;
    });
  })();

  return (
    <div style={{ padding: 0}}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="movie-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {sortedMovies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: "0 12px" }}>
          Page {page} / {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
