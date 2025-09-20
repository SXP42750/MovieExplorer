import React, { createContext, useState, useEffect } from 'react';

import { jwtDecode } from "jwt-decode";


export const AppContext = createContext();


export const AppProvider = ({ children }) => {
const [user, setUser] = useState(null);


useEffect(() => {
const token = localStorage.getItem('token');
if (token) {
try {
const decoded = jwtDecode(token);
setUser({ id: decoded.id, name: decoded.name, isAdmin: decoded.isAdmin });
} catch (e) { /* invalid token */ }
}
}, []);


const saveAuth = (token, userObj) => {
localStorage.setItem('token', token);
setUser(userObj);
};


const logout = () => {
localStorage.removeItem('token');
setUser(null);
};


return (
<AppContext.Provider value={{ user, saveAuth, logout }}>
{children}
</AppContext.Provider>
);
};