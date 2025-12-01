/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginWithEmail as loginWithEmailService,
  loginWithGoogle as loginWithGoogleService,
  logout as logoutService,
  subscribeToAuthChanges,
} from "../5_services/authService";

const AuthContext = createContext(null);

function FullScreenLoader() {
  return (
    <div className="app-loader">
      <div className="app-loader-card">
        <div className="app-loader-spinner"></div>
        <p>Chargement de classroom…</p>
      </div>
    </div>
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const loginWithEmail = (email, password) =>
    loginWithEmailService(email, password);

  const loginWithGoogle = () => loginWithGoogleService();

  const logout = () => logoutService();

  const value = {
    user,
    loading,
    loginWithEmail,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <FullScreenLoader /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}