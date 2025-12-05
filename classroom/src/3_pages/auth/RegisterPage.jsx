import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../2_context/AuthContext";

const FORMULAS = [
  "a² + b² = c²", "E = mc²", "f(x) = ax² + bx + c",
  "limₙ→∞ 1/n = 0", "∫ x² dx", "P(A ∩ B)", "Σᵢ xᵢ / n"
];

function getRandomFormula() {
  return FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
}

function FallingFormula({ slot }) {
  const [formula, setFormula] = useState(getRandomFormula());
  const [duration] = useState(() => 5 + Math.random() * 4);
  const [delay] = useState(() => Math.random() * 3);

  return (
    <div
      className={`formula formula-slot-${slot}`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
      onAnimationIteration={() => setFormula(getRandomFormula())}
    >
      {formula}
    </div>
  );
}

function MathRain() {
  return (
    <div className="math-rain">
      <FallingFormula slot={0} />
      <FallingFormula slot={1} />
      <FallingFormula slot={2} />
    </div>
  );
}

export default function RegisterPage() {
  const { registerWithEmail } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (pwd !== confirmPwd) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    if (pwd.length < 6) {
        return setError("Le mot de passe doit contenir au moins 6 caractères.");
    }

    setLoading(true);

    try {
      await registerWithEmail(email, pwd, name);
      
      navigate("/teacher");
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà utilisé.");
      } else {
        setError("Inscription échouée. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <MathRain />

      <div className="login-card">
        <div className="login-header">
          <a href="/" className="login-logo">
            <img src="/classroom-logo.svg" alt="classroom logo" />
            <span>classroom</span>
          </a>
          <h1>Inscription</h1>
          <p>Créez votre compte enseignant.</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label>
            Nom complet
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Jean Dupont"
              required
            />
          </label>

          <label>
            Courriel
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@ecole.com"
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <label>
            Confirmer mot de passe
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn-primary" disabled={loading}>
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '15px', fontSize: '0.9rem'}}>
            <span style={{opacity: 0.7}}>Déjà un compte ? </span>
            <span 
                style={{color: '#38bdf8', cursor: 'pointer', fontWeight: '600'}}
                onClick={() => navigate("/login")}
            >
                Connectez-vous
            </span>
        </div>
      </div>
    </div>
  );
}