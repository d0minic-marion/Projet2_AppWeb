import React, { useState, useEffect } from "react";
import "./welcome.css";

function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    const savedTime = localStorage.getItem("cookieConsentTime");
    if (!savedTime) return true;

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (now - Number(savedTime) > oneHour) {
      return true;
    }
    return false;
  });

  const acceptOrRefuse = () => {
    localStorage.setItem("cookieConsentTime", Date.now());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          Nous utilisons des cookies pour améliorer votre expérience sur
          <strong> classroom</strong>. En continuant, vous acceptez notre
          utilisation des cookies.
        </p>
        <div className="cookie-actions">
          <button onClick={acceptOrRefuse}>Accepter</button>
          <button onClick={acceptOrRefuse}>Refuser</button>
        </div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * 12;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="welcome-container">
      <div
        className="floating-symbols"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <span className="symbol sym1">+</span>
        <span className="symbol sym2">×</span>
        <span className="symbol sym3">=</span>
        <span className="symbol sym4">?</span>
        <span className="symbol sym5">+</span>
        <span className="symbol sym6">×</span>
      </div>

      <header className="welcome-header">
        <div className="logo-block">
          <img
            src="/classroom-logo.svg"
            alt="classroom logo"
            className="logo-icon"
          />
          <span className="logo-text">classroom</span>
        </div>

        <nav className="welcome-nav">
          <a href="/features">Fonctionnalités</a>
          <a href="/about">About Us</a>
          <a href="/login">Connexion</a>
        </nav>
      </header>

      <div className="hero" id="hero">
        <h1 className="title">classroom</h1>
        <p className="subtitle">
          Gérez vos plans de cours, formulaires et validations IA facilement.
        </p>

        <a href="/login" className="start-btn">
          Commencer
        </a>
      </div>

      <footer className="welcome-footer">
        <span>© {new Date().getFullYear()} classroom</span>
      </footer>

      <CookieBanner />
    </div>
  );
}