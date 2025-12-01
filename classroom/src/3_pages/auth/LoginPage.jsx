import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../2_context/AuthContext";

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

      const token = await user.getIdTokenResult();
      const role = token.claims.role || "unknown";

      console.log(
        `%c[AUTH] Login email/pwd → ${user.email} | Role: ${role} | UID: ${user.uid}`,
        "color: #4ade80; font-weight: bold;"
      );

      navigate("/"); // rediriger selon type de compte (implimenter plustard)
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

      const token = await user.getIdTokenResult();
      const role = token.claims.role || "unknown";

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