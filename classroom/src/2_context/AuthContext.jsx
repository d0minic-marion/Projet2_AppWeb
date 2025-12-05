/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginWithEmail as loginWithEmailService,
  registerWithEmail as registerWithEmailService,
  loginWithGoogle as loginWithGoogleService,
  logout as logoutService,
  subscribeToAuthChanges,
  fetchUserRole,
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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const role = await fetchUserRole(firebaseUser);
        
        setUser(firebaseUser);
        setProfile({
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          role: role,
        });
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const loginWithEmail = (email, password) => loginWithEmailService(email, password);
  const registerWithEmail = (email, password, name) => registerWithEmailService(email, password, name);
  const loginWithGoogle = () => loginWithGoogleService();
  const logout = () => {
    setProfile(null);
    return logoutService();
  };

  const value = {
    user,
    profile,
    loading,
    loginWithEmail,
    registerWithEmail,
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