import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getGenres, LANGUAGES } from "../api/tmdb";

const Navbar = ({ onFilterChange }) => {
  const { user, saveAuth, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  
  const [query, setQuery] = useState("");
  const [genreId, setGenreId] = useState("");
  const [language, setLanguage] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [genres, setGenres] = useState([]);

  
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ query, genreId, language, rating, sortBy });
    }
  }, [query, genreId, language, rating, sortBy, onFilterChange]);

  const handleResetFilters = () => {
    setQuery("");
    setGenreId("");
    setLanguage("");
    setRating("");
    setSortBy("");
  };

  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) return alert("Enter email and password");
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", { email: adminEmail, password: adminPassword });
      const { token, user: userObj } = res.data;
      saveAuth(token, userObj);
      setShowAdminForm(false);
      setAdminEmail("");
      setAdminPassword("");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common["Authorization"];
    logout();
  };

  return (
    <nav style={styles.nav}>

      
      <div style={styles.left}>
        <div style={styles.brand}>
          <img src="/logo.jpg" alt="Movie Explorer Logo" style={styles.logoImg} />
          <h1 style={styles.logo}>Movie Explorer</h1>
        </div>
      </div>

      
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />

        <select value={genreId} onChange={(e) => setGenreId(e.target.value)} style={styles.select}>
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>

        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.select}>
          <option value="">All Languages</option>
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>

        <select value={rating} onChange={(e) => setRating(e.target.value)} style={styles.select}>
          <option value="">Rating</option>
          {[...Array(10).keys()].map((i) => <option key={i + 1} value={i + 1}>{i + 1}+</option>)}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="">Sort By</option>
          <option value="popularity_desc">Popularity</option>
          <option value="release_date_desc">Release Date</option>
          <option value="vote_average_desc">Rating</option>
          <option value="title_asc">Title A → Z</option>
          <option value="title_desc">Title Z → A</option>
        </select>

        <button style={styles.resetBtn} onClick={handleResetFilters}>Reset</button>
      </div>

      {/* Right: actions */}
      <div style={styles.rightSection}>
        <a href="/movies" style={styles.link}>Movies</a>

        {user?.isAdmin && <>
          <span style={styles.sep}>|</span>
          <a href="/admin" style={styles.adminLink}>👑 Admin</a>
        </>}

        <button style={styles.themeButton} onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {user ? (
          <div style={styles.userSection}>
            <span style={styles.userName}>{user.isAdmin ? "👑 Admin" : user.name || user.email}</span>
            <button style={styles.button} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button style={styles.button} onClick={() => (window.location.href = "/login")}>Login</button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "var(--navbar-height)",
    background: "var(--card-bg)",
    color: "var(--text)",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto", 
    alignItems: "center",
    gap: "12px",
    padding: "0 20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    zIndex: 1000,
    boxSizing: "border-box",
  },

  
  left: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoImg: {
    height: "35px",
    width: "auto",
    objectFit: "cover",
    borderRadius: "6px"
  },
  logo: { fontSize: "1.2rem", fontWeight: 700, margin: 0 },

  
  filterSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "nowrap",     
    overflowX: "auto",
    padding: "6px 4px",
    minWidth: 0,           
  },

  
  input: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "180px",
    maxWidth: "420px",
    flex: "0 0 auto",
    background: "var(--card-bg)",
    color: "var(--text)"
  },
  select: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "120px",
    flex: "0 0 auto",
    background: "var(--card-bg)",
    color: "var(--text)"
  },
  resetBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#ff4757",
    color: "#fff",
    border: "none",
    flex: "0 0 auto"
  },

  
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifySelf: "end",   
    flexWrap: "nowrap",
    minWidth: 0,
    paddingLeft: "8px"
  },
  themeButton: {
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.06)",
    color: "var(--text)"
  },
  userSection: { display: "flex", alignItems: "center", gap: "8px" },
  button: {
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#ff4757",
    color: "#fff",
    border: "none"
  },
  userName: { maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block" },

  link: { textDecoration: "none", color: "var(--text)", fontWeight: 500 },
  sep: { margin: "0 6px", color: "var(--muted)" },
  adminLink: { fontWeight: 600, textDecoration: "none", color: "#3b82f6" },
};

export default Navbar;

