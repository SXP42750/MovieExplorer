import React from "react";
import MovieList from "../components/MovieList";
// import { useAuth } from "../context/AuthContext";

export default function Home() {
  // const { user } = useAuth();

  return (
    <div style={{ padding: "50px 20px " }}>

      <MovieList />
    </div>

  );
}
