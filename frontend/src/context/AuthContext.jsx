import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { setToken, setUser, getUser, removeToken, removeUser } from "../utils/storage";

export const AuthContext = createContext();

/**
 * Expected backend login response:
 * { token: "JWT...", user: { _id, name, email, role } }
 */

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // you could optionally validate token here on load
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user: userObj } = res.data;
      if (!token) throw new Error("No token returned");
      setToken(token);
      setUser(userObj);          // storage util
      setUserState(userObj);
      return userObj;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: setUserState, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
