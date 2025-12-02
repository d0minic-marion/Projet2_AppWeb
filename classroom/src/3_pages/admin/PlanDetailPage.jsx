// 4_components/admin/PlanDetails.jsx
import { useState } from "react";

export default function PlanDetails({ plan, onApprove, onCorrection, onClose }) {
  const [comment, setComment] = useState("");

  return (
    <div className="admin-modal">
      <div className="admin-card big">
        <button className="close" onClick={onClose}>×</button>

        <h2>Détails du plan</h2>

        <p><strong>Cours :</strong> {plan.cours}</p>
        <p><strong>Enseignant :</strong> {plan.enseignant}</p>

        <h3>Contenu</h3>
        <ul>
          {Object.entries(plan.reponses).map(([q, r]) => (
            <li key={q}><strong>{q} :</strong> {r}</li>
          ))}
        </ul>

        <h3>Validation IA</h3>
        <ul>
          {plan.ia?.map((v, i) => (
            <li key={i}>
              <strong>{v.status}</strong> — {v.message}
            </li>
          ))}
        </ul>

        <button className="primary" onClick={() => onApprove(plan.id)}>
          Approuver
        </button>

        <textarea
          placeholder="Commentaire pour correction…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="warning"
          onClick={() => onCorrection(plan.id, comment)}
        >
          Demander corrections
        </button>

        <button className="secondary" onClick={() => window.open(plan.pdfUrl)}>
          Télécharger PDF
        </button>
      </div>
    </div>
  );
}
