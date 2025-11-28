import React from "react";
import "./features.css";
import { useLocation } from "react-router-dom";

export default function FeaturesPage() {
  const location = useLocation();

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-logo">
          <a href="/" className="page-logo-link">
            <img src="/classroom-logo.svg" className="page-logo-icon" />
            <span>classroom</span>
          </a>
        </div>

        <nav className="page-nav">
          {location.pathname !== "/features" && <a href="/features">Fonctionnalités</a>}
          {location.pathname !== "/about" && <a href="/about">About Us</a>}
          {location.pathname !== "/login" && <a href="/login">Connexion</a>}
        </nav>
      </header>

      <main className="page-main">
        <section className="page-hero">
          <h1>Fonctionnalités de classroom</h1>
          <p>
            Tout ce dont vous avez besoin pour centraliser les plans de cours,
            automatiser la validation et simplifier la vie des enseignants et
            des coordonnateurs.
          </p>
        </section>

        <section className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">📝</div>
            <h2>Formulaires de plans de cours dynamiques</h2>
            <p>
              Le coordonnateur crée et met à jour des formulaires de plans de
              cours avec au moins 10 questions, adaptés à chaque session et
              programme.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🤖</div>
            <h2>Validation IA des réponses</h2>
            <p>
              Chaque question est liée à une règle de validation. L&apos;IA
              analyse la réponse de l&apos;enseignant et fournit un statut
              (Conforme, À améliorer, Non conforme) avec des suggestions
              concrètes.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">📊</div>
            <h2>Suivi des plans soumis</h2>
            <p>
              Les enseignants peuvent suivre l&apos;état de leurs plans de
              cours, tandis que le coordonnateur voit tous les plans, filtre
              par session et valide officiellement les documents.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">📄</div>
            <h2>Génération de PDF et archivage</h2>
            <p>
              Une fois le plan complété et validé, un PDF propre est généré et
              stocké dans Firebase Storage, prêt à être téléchargé ou partagé.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🔐</div>
            <h2>Gestion des rôles et sécurité</h2>
            <p>
              Accès séparé pour les enseignants et les coordonnateurs, règles
              de sécurité Firestore pour protéger les données et limiter les
              actions selon le rôle.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">☁️</div>
            <h2>Intégration complète Firebase</h2>
            <p>
              Authentification Google, Firestore, Storage et Hosting : tout est
              intégré dans une seule application web moderne.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}