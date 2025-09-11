// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1) saved choice?
    const saved = localStorage.getItem("theme"); // uses the saved theme if present
    if (saved) return saved;
    // 2) system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    // toggle class on <html>
    document.documentElement.classList.toggle("dark", theme === "dark");
    // persist
    localStorage.setItem("theme", theme); // write theme to local storage
  }, [theme]); // runs on every theme change

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children} 
    </ThemeContext.Provider>
  );
}

export function useTheme() { // any component can call to read or change the theme
  return useContext(ThemeContext);
}
