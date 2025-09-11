import React from "react";
import MovieList from "../components/MovieList";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Movie Explorer</h1>
      {user ? <p>Hello, {user.displayName}!</p> : <p>Please log in to book tickets.</p>}
      <MovieList />
    </div>
  );
}
