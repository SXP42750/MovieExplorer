import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ADMIN_EMAIL = "sp1707702@gmail.com";

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
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    const { token, user: userObj } = res.data;
    if (!token) throw new Error("No token returned from server");
    applyAuth(token, userObj);
    return userObj;
  };

  // register
  const register = async (name, email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
    const { token, user: userObj } = res.data;
    if (!token) throw new Error("No token returned from server");
    applyAuth(token, userObj);
    return userObj;
  };

  // request password reset (updated)
  const requestPasswordReset = async (email) => {
    const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
    // include previewUrl for development
    return {
      message: res.data.message,
      previewUrl: res.data.previewUrl || null, 
    };
  };

  // reset password (updated)
  const resetPassword = async (token, newPassword) => {
    const res = await axios.post("http://localhost:5000/api/auth/reset-password", { token, newPassword });
    return {
      message: res.data.message,
      previewUrl: res.data.previewUrl || null,
    };
  };

  const saveAuth = (token, userObj) => applyAuth(token, userObj);

  const logout = async () => {
    applyAuth(null, null);
  };

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
        register,
        logout,
        saveAuth,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

