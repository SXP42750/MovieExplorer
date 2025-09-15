import React, { useEffect, useState } from "react";
import { getMovies, getGenres, LANGUAGES } from "../api/tmdb";
import MovieCard from "./MovieCard";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [genreId, setGenreId] = useState("");
  const [language, setLanguage] = useState("");
  const [rating, setRating] = useState(""); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMovies({
          query,
          page,
          genreId,
          language,
          rating,
        });
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
    return () => {
      cancelled = true;
    };
  }, [query, page, genreId, language, rating]);

  const filteredMovies = movies.filter((m) => {
    const matchesQuery =
      !query ||
      (m.title && m.title.toLowerCase().includes(query.toLowerCase()));
    const matchesGenre = !genreId || (m.genre_ids && m.genre_ids.includes(Number(genreId)));
    const matchesLanguage = !language || m.original_language === language;
    const matchesRating = !rating || (m.vote_average >= Number(rating));
    return matchesQuery && matchesGenre && matchesLanguage && matchesRating;
  });

  function sortMovies(arr) {
    if (!sortBy) return arr;
    const [field, order] = sortBy.split("_"); 

    return [...arr].sort((a, b) => {
      let va = a[field];
      let vb = b[field];


      if (field === "release" || field === "release_date") {
        va = a.release_date ? new Date(a.release_date).getTime() : 0;
        vb = b.release_date ? new Date(b.release_date).getTime() : 0;
      }

      
      if (field === "title") {
        va = va || "";
        vb = vb || "";
        const comp = va.localeCompare(vb);
        return order === "asc" ? comp : -comp;
      }

      
      va = Number(va) || 0;
      vb = Number(vb) || 0;

      return order === "asc" ? va - vb : vb - va;
    });
  }

  const sortedMovies = sortMovies(filteredMovies);

  
  const handleResetFilters = () => {
    setQuery("");
    setGenreId("");
    setLanguage("");
    setRating("");
    setSortBy("");
    setPage(1);
  };

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "8px",
              width: "180px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <select
            value={genreId}
            onChange={(e) => {
              setGenreId(e.target.value);
              setPage(1);
            }}
            style={{ padding: "8px", width: "150px", borderRadius: "6px" }}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setPage(1);
            }}
            style={{ padding: "8px", width: "150px", borderRadius: "6px" }}
          >
            <option value="">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>

          <select
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setPage(1);
            }}
            style={{ padding: "8px", width: "150px", borderRadius: "6px" }}
          >
            <option value="">Rating</option>
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}+
              </option>
            ))}
          </select>
        </div>

        
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            style={{ padding: "8px", width: "180px", borderRadius: "6px" }}
          >
            <option value="">Sort By (default)</option>
            <option value="popularity_desc">Popularity</option>
            <option value="release_date_desc">Release Date</option>
            <option value="vote_average_desc">Rating</option>
            <option value="title_asc">Title A → Z</option>
            <option value="title_desc">Title Z → A</option>
          </select>

          <button className ="btn ghost"
            onClick={handleResetFilters}
            title="Reset filters and sorting"
          >
            Reset
          </button>
        </div>
      </div>

     
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      
      <div className="movie-grid">
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
