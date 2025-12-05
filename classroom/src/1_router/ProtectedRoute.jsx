import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../2_context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "#f8fafc",
        color: "#64748b"
      }}>
        Vérification des accès...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    if (profile?.role === 'teacher') {
        return <Navigate to="/teacher" replace />;
    }
    if (profile?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}