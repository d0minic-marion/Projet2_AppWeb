import React from "react";
import "./about.css";
import { useLocation } from "react-router-dom";


export default function AboutPage() {
  return (
    <div className="about-container">
      <header className="page-header">
        <div className="page-logo">
          <a href="/" className="page-logo-link">
            <img
              src="/classroom-logo.svg"
              alt="classroom logo"
              className="page-logo-icon"
            />
            <span>classroom</span>
          </a>
        </div>

        <nav className="page-nav">
        {location.pathname !== "/features" && <a href="/features">Fonctionnalités</a>}
        {location.pathname !== "/about" && <a href="/about" className="active">About Us</a>}
        {location.pathname !== "/login" && <a href="/login">Connexion</a>}
        </nav>
      </header>

      <main className="about-main">
        <h1>About classroom</h1>
        <p className="about-lead">
          classroom est une application web conçue pour simplifier la gestion
          des plans de cours et la collaboration entre enseignants et
          coordonnateurs.
        </p>

        <section className="about-section">
        <p>
            Classroom est une plateforme moderne conçue pour aider les enseignants, les
            coordonnateurs et les établissements scolaires à structurer et gérer les
            plans de cours de manière centralisée. Notre objectif est de simplifier le
            travail administratif afin que les enseignants puissent consacrer plus de
            temps à ce qui compte vraiment : l’apprentissage des étudiants.
        </p>

        <p>
            Le projet est né d’un constat simple : chaque session, les enseignants
            doivent remplir des documents complexes, vérifier leur conformité,
            appliquer différentes normes pédagogiques et les faire approuver par la
            coordination. Classroom automatise cette procédure grâce à une interface
            intuitive et à un système de validation intelligente alimenté par l’IA.
            Chaque réponse est analysée en temps réel afin de détecter les informations
            manquantes, les éléments à préciser ou les points non conformes.
        </p>

        <p>
            Pour les coordonnateurs, Classroom offre un tableau de bord complet,
            permettant de suivre la progression des enseignants, de filtrer par
            programme ou session, et de valider officiellement les documents soumis. La
            plateforme assure également un archivage automatique des plans de cours en
            format PDF, facilitant l’accès aux documents d’une session à l’autre.
            Grâce à l’intégration Firebase, toutes les données sont sécurisées,
            sauvegardées et accessibles à tout moment.
        </p>

        <p>
            Notre mission est d’offrir un outil simple, rapide et fiable qui améliore
            l’efficacité des équipes pédagogiques. Classroom évolue continuellement
            grâce aux retours des utilisateurs, avec pour ambition de devenir la
            référence en gestion académique numérique au sein des établissements
            scolaires.
        </p>
        </section>

      </main>
    </div>
  );
}