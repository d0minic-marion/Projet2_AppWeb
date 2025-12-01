import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../2_context/AuthContext";
import { fetchUserRole } from "../../5_services/authService";

const FORMULAS = [
  "a² + b² = c²",
  "E = mc²",
  "f(x) = ax² + bx + c",
  "limₙ→∞ 1/n = 0",
  "∫ x² dx",
  "P(A ∩ B)",
  "Σᵢ xᵢ / n",
  "e^{iπ} + 1 = 0",
  "sin²x + cos²x = 1",
  "√(a² + b²)",
  "d/dx (x³) = 3x²",
  "ln(e) = 1",
  "|x| ≥ 0",
  "x₁, x₂ = (-b ± √Δ)/2a",
  "∀ε > 0, ∃δ > 0",
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

export default function LoginPage() {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await loginWithEmail(email, pwd);
      const user = cred.user;

      const role = await fetchUserRole(user);

      console.log(
        `%c[AUTH] Login email/pwd → ${user.email} | Role: ${role} | UID: ${user.uid}`,
        "color: #4ade80; font-weight: bold;"
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Connexion échouée. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const cred = await loginWithGoogle();
      const user = cred.user;

      const role = await fetchUserRole(user);

      console.log(
        `%c[AUTH] Login Google → ${user.email} | Role: ${role} | UID: ${user.uid}`,
        "color: #4ade80; font-weight: bold;"
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Connexion Google échouée.");
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
          <h1>Connexion</h1>
          <p>Connectez-vous pour gérer vos plans de cours.</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label>
            Courriel
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@site.com"
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

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="login-btn-primary"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="login-divider">
          <span></span>
          <p>ou</p>
          <span></span>
        </div>

        <button
          type="button"
          className="login-btn-google"
          onClick={onGoogle}
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
          <span>Continuer avec Google</span>
        </button>
      </div>
    </div>
  );
}