// import React, { createContext, useContext, useEffect, useState } from "react";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/auth";
// import { app } from "../auth/firebase"; 

// const ADMIN_EMAIL = "sp1707702@gmail.com"; 

// const auth = getAuth(app); 

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext); 

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true); 


//   const loginWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     await signInWithPopup(auth, provider);
//   };


//   const loginWithEmail = async (email, password) => {
//     await signInWithEmailAndPassword(auth, email, password);
//   };

//   const logout = async () => {
//     await signOut(auth); 
//   };

 
//   // listen to firebase auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);

//        if (currentUser?.email) {
//         setIsAdmin(currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
//       } else {
//         setIsAdmin(false);
//       }

//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAdmin,
//         loading,
//         loginWithGoogle,
//         loginWithEmail,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// context/AuthContext.js
// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const ADMIN_EMAIL = "sp1707702@gmail.com"; // keep if you still want email-based admin check

// const AuthContext = createContext(null);

// export const useAuth = () => useContext(AuthContext);

// const STORAGE_TOKEN_KEY = "app_token";
// const STORAGE_USER_KEY = "app_user";

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // helper to apply token/user to app state
//   const applyAuth = (token, userObj) => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       localStorage.setItem(STORAGE_TOKEN_KEY, token);
//     } else {
//       delete axios.defaults.headers.common["Authorization"];
//       localStorage.removeItem(STORAGE_TOKEN_KEY);
//     }

//     if (userObj) {
//       localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
//       setUser(userObj);
//       setIsAdmin(
//         (userObj.isAdmin === true) ||
//         (userObj.email && userObj.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
//       );
//     } else {
//       localStorage.removeItem(STORAGE_USER_KEY);
//       setUser(null);
//       setIsAdmin(false);
//     }
//   };

//   // login via backend (expects { token, user })
//   const loginWithEmail = async (email, password) => {
//     const res = await axios.post("/api/auth/login", { email, password });
//     const { token, user: userObj } = res.data;
//     if (!token) throw new Error("No token returned from server");
//     applyAuth(token, userObj);
//     return userObj;
//   };

//   // optional: a function if you ever need to set auth from elsewhere
//   const saveAuth = (token, userObj) => {
//     applyAuth(token, userObj);
//   };

//   const logout = async () => {
//     applyAuth(null, null);
//     // if your backend needs token revoke, call it here
//   };

//   // on mount, hydrate from localStorage
//   useEffect(() => {
//     try {
//       const token = localStorage.getItem(STORAGE_TOKEN_KEY);
//       const userStr = localStorage.getItem(STORAGE_USER_KEY);
//       const userObj = userStr ? JSON.parse(userStr) : null;

//       if (token) {
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       }

//       if (userObj) {
//         setUser(userObj);
//         setIsAdmin(
//           (userObj.isAdmin === true) ||
//           (userObj.email && userObj.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
//         );
//       }
//     } catch (err) {
//       console.warn("Auth hydrate failed:", err);
//       localStorage.removeItem(STORAGE_TOKEN_KEY);
//       localStorage.removeItem(STORAGE_USER_KEY);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAdmin,
//         loading,
//         loginWithEmail,
//         logout,
//         saveAuth,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ADMIN_EMAIL = "sp1707702@gmail.com"; // optional admin email check

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const STORAGE_TOKEN_KEY = "app_token";
const STORAGE_USER_KEY = "app_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyAuth = (token, userObj) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }

    if (userObj) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
      setUser(userObj);
      setIsAdmin(
        userObj.isAdmin === true ||
        (userObj.email && userObj.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
      );
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
      setUser(null);
      setIsAdmin(false);
    }
  };

  // login
  const loginWithEmail = async (email, password) => {
    // const res = await axios.post("/api/auth/login", { email, password });
    // in AuthContext.js
const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });


    const { token, user: userObj } = res.data;
    if (!token) throw new Error("No token returned from server");
    applyAuth(token, userObj);
    return userObj;
  };

  // register
  const register = async (name, email, password) => {
    // const res = await axios.post("/api/auth/register", { name, email, password });
    const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });

    const { token, user: userObj } = res.data;
    if (!token) throw new Error("No token returned from server");
    applyAuth(token, userObj);
    return userObj;
  };

  const saveAuth = (token, userObj) => applyAuth(token, userObj);

  const logout = async () => {
    applyAuth(null, null);
    // optionally call backend logout here
  };

  // hydrate on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem(STORAGE_TOKEN_KEY);
      const userStr = localStorage.getItem(STORAGE_USER_KEY);
      const userObj = userStr ? JSON.parse(userStr) : null;

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (userObj) {
        setUser(userObj);
        setIsAdmin(
          userObj.isAdmin === true ||
          (userObj.email && userObj.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
        );
      }
    } catch (err) {
      console.warn("Auth hydrate failed:", err);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginWithEmail,
        register, // <-- added
        logout,
        saveAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
