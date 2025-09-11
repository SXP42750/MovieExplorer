// src/api/tmdb.js

// handles all communication with the Movie Database API
import axios from "axios"; //so we dont repeat base url and api key

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
if (!API_KEY) {
  console.warn("REACT_APP_TMDB_API_KEY is not set in .env");
}

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

// Language list for dropdown
export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "te", name: "Telugu" },
  { code: "ta", name: "Tamil" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

// Image helpers
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
export const getImageUrl = (path, size = "w500") =>
  path ? `${IMAGE_BASE_URL}${size}${path}` : null;

// Get genres list
export const getGenres = () =>
  tmdb.get("/genre/movie/list").then((r) => r.data.genres);

// Get single movie details and asks tmdb to include credits and videos in response
export const getMovieDetails = (movieId) =>
  tmdb
    .get(`/movie/${movieId}`, { params: { append_to_response: "credits,videos" } })
    .then((r) => r.data);

// Get movies with optional filters and search
export const getMovies = async ({
  query = "", // search query or empty string
  page = 1,
  genreId = "",
  language = "",
  minRating = "",
} = {}) => {
  let data;

  if (query.trim()) {
    // Search movies
    const res = await tmdb.get("/search/movie", {
      params: { query, page, include_adult: false },
    });
    data = res.data;

    // Local filtering for search results
    let results = data.results || [];
    if (genreId) results = results.filter((m) => m.genre_ids.includes(Number(genreId)));
    if (language) results = results.filter((m) => m.original_language === language);
    if (minRating) results = results.filter((m) => m.vote_average >= Number(minRating));

    return { ...data, results };
  } else {
    // Discover movies with filters
    const params = { page, sort_by: "popularity.desc" };
    if (genreId) params.with_genres = genreId;
    if (language) params.with_original_language = language;
    if (minRating) params["vote_average.gte"] = minRating;

    const res = await tmdb.get("/discover/movie", { params });
    return res.data;
  }
};
