import React from "react";
import MovieList from "../components/MovieList";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "10px 20px " }}>

      <h1 style={{ margin: "10px 0 5px 0", textAlign: "center" }}>
        Welcome to Movie Explorer
      </h1>
      <p style={{ margin: 0 ,  textAlign:"center" }}>
        {user ? `Hello, ${user.displayName}!` : "Please log in to book tickets."}
      </p>
      <MovieList />
    </div>

  );
}
