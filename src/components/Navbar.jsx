// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { useTheme } from "../context/ThemeContext";

// const Navbar = () => {
//   const { user, isAdmin } = useAuth();
//   const { theme, toggleTheme } = useTheme(); 
//   const auth = getAuth();
//   const provider = new GoogleAuthProvider();

//   const [showAdminForm, setShowAdminForm] = useState(false);
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");


//   const handleLogin = async () => {
//     try {
//       await signInWithPopup(auth, provider);
//       console.log("User logged in with Google");
//     } catch (error) {
//       console.error("User login failed:", error);
//     }
//   };


//   const handleAdminLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
//       console.log("Admin logged in successfully");
//       setShowAdminForm(false);
//     } catch (error) {
//       console.error("Admin login failed:", error.code, error.message);
//       alert(error.message);
//     }
//   };


//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       console.log("Logged out successfully");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <nav style={styles.nav}> 
//       <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//   <img 
//     src="/logo.jpg" 
//     alt="Movie Explorer Logo" 
//     style={{ height: "35px", objectFit: "contain" }} 
//   />
//   <h1 style={styles.logo}>Movie Explorer</h1>
// </div>

//       <div style={styles.rightSection}>
      
//         <button style={styles.themeButton} onClick={toggleTheme}>
//           {theme === "light" ? "🌙 Dark" : "☀️ Light"}
//         </button>

//         {user ? (
//           <div style={styles.userSection}>
//             <span style={styles.username}>
//               {isAdmin ? "👑 Admin" : user.displayName || user.email}
//             </span>
//             <button style={styles.button} onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         ) : (
//           <>
//             <button style={styles.button} onClick={handleLogin}>
//               Login with Google
//             </button>
//             <button style={styles.button} onClick={() => setShowAdminForm(!showAdminForm)}>
//               Admin Login
//             </button>
//           </>
//         )}
//       </div>

//       {showAdminForm && (
//         <div style={styles.adminForm}>
//           <input
//             type="email"
//             placeholder="Admin Email"
//             value={adminEmail}
//             onChange={(e) => setAdminEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={adminPassword}
//             onChange={(e) => setAdminPassword(e.target.value)}
//           />
//           <button style={styles.button} onClick={handleAdminLogin}>
//             Login as Admin
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };



// const styles = {
//   nav: {
//     position: "fixed", 
//     top: 0,
//     left: 0,
//     width: "100%",      
//     zIndex: 1000,
//     height: "60px", 
//     background: "var(--card-bg)",
//     color: "var(--text)",
//     display: "flex",
//     flexWrap : "wrap",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "10 20px", 
//     boxShadow: "var(--shadow)",
//   },

//   logo: { fontSize: "1.2rem", fontWeight: "bold" },
//   rightSection: { display: "flex", alignItems: "center", gap: "5px" },
//   themeButton: {
//     background: "transparent",
//     border: "1px solid var(--text)",
//     color: "var(--text)",
//     padding: "6px 10px",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   userSection: { display: "flex", alignItems: "center", gap: "10px" },
//   username: { fontSize: "1rem" },
//   button: {
//     background: "#ff4757",
//     color: "#fff",
//     border: "none",
//     padding: "8px 12px",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   adminForm: {
//     position: "absolute",
//     top: "70px",
//     right: "20px",
//     background: "var(--card-bg)",
//     padding: "10px",
//     borderRadius: "8px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
//   },
// };

// export default Navbar;

// src/components/Navbar.jsx
import React, { useState} from "react";
import axios from "axios";
// import { AppContext } from "../AppContext";        // earlier canvas: AppContext with saveAuth/logout
import { useTheme } from "../context/ThemeContext"; // your theme context
import { useAuth } from "../context/AuthContext"; // <-- use your AuthContext
const Navbar = () => {
  // expects AppContext: { user, saveAuth, logout }
  const { user, saveAuth, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // POST to your backend login endpoint (expects { token, user } response)
  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) return alert("Enter email and password");
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", {
        email: adminEmail,
        password: adminPassword,
      });
      // backend should send: { token, user: { id, name, email, isAdmin } }
      const { token, user: userObj } = res.data;
      if (!token) throw new Error("No token returned from server");
      // saveAuth should set localStorage and context state
      saveAuth(token, userObj);
      setShowAdminForm(false);
      setAdminEmail("");
      setAdminPassword("");
      // optionally set axios default header for subsequent calls:
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (err) {
      console.error("Admin login failed:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // clear auth on frontend; if you have server-side logout, call it here
    // also remove axios auth header
    delete axios.defaults.headers.common["Authorization"];
    logout();
  };

  return (
    <nav style={styles.nav}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src="/logo.jpg"
          alt="Movie Explorer Logo"
          style={{ height: "35px", objectFit: "contain" }}
        />
        <h1 style={styles.logo}>Movie Explorer</h1>
      </div>

      <div style={styles.centerSection}>
        {/* If using react-router, replace <a> with <Link to="/"> */}
        <a href="/" style={styles.link}>
          Home
        </a>
        <span style={styles.sep}>|</span>
        <a href="/movies" style={styles.link}>
          Movies
        </a>
        <span style={styles.sep}>|</span>

        {/* show admin link when logged-in user is admin */}
        {user?.isAdmin && (
          <>
            <a href="/admin" style={styles.adminLink}>
              👑 Admin Dashboard
            </a>
            <span style={styles.sep}>|</span>
          </>
        )}
      </div>

      <div style={styles.rightSection}>
        <button style={styles.themeButton} onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {user ? (
          <div style={styles.userSection}>
            <span style={styles.username}>
              {user.isAdmin ? "👑 Admin" : user.name || user.email}
            </span>
            <button style={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* You can add a regular user login modal here if you want */}
            <button
              style={styles.button}
              onClick={() => {
                
                window.location.href = "/login";
              }}
            >
              Login
            </button>

            {/* <button
              style={styles.button}
              onClick={() => setShowAdminForm(!showAdminForm)}
            >
              Admin Login
            </button> */}
          </>
        )}
      </div>

      {showAdminForm && (
        <div style={styles.adminForm}>
          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            style={styles.input}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={styles.button}
              onClick={handleAdminLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
            <button
              style={{ ...styles.button, background: "#6c757d" }}
              onClick={() => {
                setShowAdminForm(false);
                setAdminEmail("");
                setAdminPassword("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    height: "60px",
    background: "var(--card-bg)",
    color: "var(--text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0px",
    boxShadow: "var(--shadow)",
    gap: "12px",
  },

  logo: { fontSize: "1.2rem", fontWeight: "bold", margin: 0 },

  centerSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
    justifyContent: "center",
  },

  rightSection: { display: "flex", alignItems: "center", gap: "8px" },

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
    top: "70px",
    right: "20px",
    background: "var(--card-bg)",
    padding: "12px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    minWidth: "240px",
  },

  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
  },

  adminLink: {
    textDecoration: "none",
    fontWeight: "600",
  },

  link: {
    textDecoration: "none",
    color: "var(--text)",
    fontWeight: 500,
  },

  sep: { margin: "0 6px", color: "var(--muted)" },
};

export default Navbar;
