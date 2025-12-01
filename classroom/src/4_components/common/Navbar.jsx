
import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../2_context/AuthContext";


export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <span className="navbar-logo">
          <img src="/classroom-logo.svg" alt="logo" />
          <span>classroom</span>
        </span>
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <div className="navbar-user">
              <span className="navbar-name">
                {profile?.displayName || user.email}
              </span>
              {profile?.role && (
                <span className="navbar-role">({profile.role})</span>
              )}
            </div>

            <button className="navbar-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  );
}
