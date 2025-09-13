import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");


  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("User logged in with Google");
    } catch (error) {
      console.error("User login failed:", error);
    }
  };


  const handleAdminLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log("Admin logged in successfully");
      setShowAdminForm(false);
    } catch (error) {
      console.error("Admin login failed:", error.code, error.message);
      alert(error.message);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav style={styles.nav}> 
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <img 
    src="/logo.jpg" 
    alt="Movie Explorer Logo" 
    style={{ height: "40px", objectFit: "contain" }} 
  />
  <h1 style={styles.logo}>Movie Explorer</h1>
</div>

      <div style={styles.rightSection}>
      
        <button style={styles.themeButton} onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {user ? (
          <div style={styles.userSection}>
            <span style={styles.username}>
              {isAdmin ? "👑 Admin" : user.displayName || user.email}
            </span>
            <button style={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <button style={styles.button} onClick={handleLogin}>
              Login with Google
            </button>
            <button style={styles.button} onClick={() => setShowAdminForm(!showAdminForm)}>
              Admin Login
            </button>
          </>
        )}
      </div>

      {/* Admin Login Form (only shows when clicked) */}
      {showAdminForm && (
        <div style={styles.adminForm}>
          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <button style={styles.button} onClick={handleAdminLogin}>
            Login as Admin
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: "var(--card-bg)",
    color: "var(--text)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
  },
  logo: { fontSize: "1.5rem", fontWeight: "bold" },
  rightSection: { display: "flex", alignItems: "center", gap: "10px" },
  themeButton: {
    background: "transparent",
    border: "1px solid var(--text)",
    color: "var(--text)",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  userSection: { display: "flex", alignItems: "center", gap: "10px" },
  username: { fontSize: "1rem" },
  button: {
    background: "#ff4757",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  adminForm: {
    position: "absolute",
    top: "60px",
    right: "20px",
    background: "#222",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};

export default Navbar;
