import axios from "axios"; 

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


export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
export const getImageUrl = (path, size = "w500") =>
  path ? `${IMAGE_BASE_URL}${size}${path}` : null;


export const getGenres = () =>
  tmdb.get("/genre/movie/list").then((r) => r.data.genres); 


export const getMovieDetails = (movieId) =>
  tmdb
    .get(`/movie/${movieId}`, { params: { append_to_response: "credits,videos" } })
    .then((r) => r.data);

export const getMovies = async ({
  query = "", 
  page = 1,
  genreId = "",
  language = "",
  minRating = "",
} = {}) => {
  let data;

  if (query.trim()) {
  
    const res = await tmdb.get("/search/movie", {
      params: { query, page, include_adult: false },
    });
    data = res.data;

    let results = data.results || [];
    if (genreId) results = results.filter((m) => m.genre_ids.includes(Number(genreId)));
    if (language) results = results.filter((m) => m.original_language === language);
    if (minRating) results = results.filter((m) => m.vote_average >= Number(minRating));

    return { ...data, results };
  } else {
    const params = { page, sort_by: "popularity.desc" };
    if (genreId) params.with_genres = genreId;
    if (language) params.with_original_language = language;
    if (minRating) params["vote_average.gte"] = minRating;

    const res = await tmdb.get("/discover/movie", { params });
    return res.data;
  }
};
