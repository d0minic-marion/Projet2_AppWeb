import React, { useState } from "react";

export default function QuestionEditor({ form, onAdd, onDelete }) {
  const [questionText, setQuestionText] = useState("");
  const [validationRule, setValidationRule] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (questionText.trim() && validationRule.trim()) {
      onAdd({
        id: Date.now().toString(),
        text: questionText.trim(),
        rule: validationRule.trim(),
      });
      setQuestionText("");
      setValidationRule("");
    }
  };

  return (
    <div className="admin-card">
      <h3>Éditeur de questions pour: {form.nom}</h3>
      <p style={{ opacity: 0.7, fontSize: "0.85rem", marginBottom: "15px" }}>
        Questions actuelles: **{form.questions.length}**. (Min. 10 questions requises pour activer)
      </p>

      <div className="admin-list" style={{ marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
        {form.questions.map((q, index) => (
          <div key={q.id} className="admin-item" style={{ cursor: 'default', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 15px' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ flexGrow: 1 }}>{index + 1}. {q.text}</strong>
                <button className="danger" onClick={() => onDelete(q.id)} style={{ padding: '4px 8px' }}>
                    Supprimer
                </button>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '5px' }}>
                **Règle IA:** {q.rule}
            </div>
          </div>
        ))}
        {form.questions.length === 0 && <p style={{ textAlign: 'center', opacity: 0.6, padding: '10px 0' }}>Aucune question ajoutée.</p>}
      </div>

      <h4>Ajouter une nouvelle question</h4>
      <form onSubmit={handleAdd} className="admin-form">
        <div className="inputs-admin" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <input
            type="text"
            placeholder="Texte de la question (ex: 'Objectifs du cours')"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          <textarea
            placeholder="Règle de validation IA (ex: 'Vérifier que la description contient au moins 100 mots...')"
            value={validationRule}
            onChange={(e) => setValidationRule(e.target.value)}
            required
            rows={3}
            style={{ width: '100%', minHeight: '80px', boxSizing: 'border-box' }}
          />
          <button className="primary button-align" type="submit" style={{ width: '100%', marginTop: '10px' }}>
            Ajouter question
          </button>
        </div>
      </form>
    </div>
  );
}