import React from "react";

export default function QuestionBlock({ index, question, answer, onChangeAnswer }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', marginBottom: '10px', background: 'white', textAlign: 'left' }}>
      <h4 style={{marginTop: 0, marginBottom: '5px', fontSize: '1rem'}}>
        Question {index + 1}: {question.text}
      </h4>
      <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '10px' }}>
        Règle IA: {question.rule || "Non spécifiée"}
      </p>
      
      <textarea
        value={answer?.answerText || ''}
        onChange={(e) => onChangeAnswer(e.target.value)}
        placeholder="Entrez votre réponse ici..."
        rows={5}
        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
      />
    </div>
  );
}