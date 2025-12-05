import { useState } from "react";

export default function PlanDetails({ plan, onApprove, onCorrection, onClose }) {
  const [comment, setComment] = useState("");

  return (
    <div className="admin-modal">
      <div className="admin-card big" style={{ width: '600px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2>Détails du plan</h2>
            <button className="close" onClick={onClose}>×</button>
        </div>

        <p><strong>Titre :</strong> {plan.title}</p>
        <p><strong>Enseignant :</strong> {plan.teacherName}</p>
        <p><strong>Session :</strong> {plan.session}</p>

        <hr style={{margin:'15px 0', border:'none', borderTop:'1px solid #e2e8f0'}} />

        <h3>Contenu du plan</h3>
        <ul style={{ paddingLeft: '20px', display:'flex', flexDirection:'column', gap:'15px' }}>
          {plan.answers && plan.answers.map((item, index) => (
            <li key={index} style={{ listStyle: 'none' }}>
              <div style={{fontWeight: 'bold', marginBottom:'4px', color:'#1e293b'}}>
                {index + 1}. {item.questionText}
              </div>
              <div style={{
                  background: '#f8fafc', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #e2e8f0',
                  whiteSpace: 'pre-wrap'
              }}>
                {item.answerText || <em style={{opacity:0.5}}>Pas de réponse</em>}
              </div>
              
              {item.aiFeedback && (
                  <div style={{fontSize:'0.85rem', marginTop:'5px', color:'#6366f1'}}>
                      🤖 <strong>IA:</strong> {item.aiFeedback}
                  </div>
              )}
            </li>
          ))}
        </ul>

        <div style={{marginTop:'20px', display:'flex', flexDirection:'column', gap:'10px'}}>
            
            {plan.status !== "APPROVED" && (
                <button className="primary" onClick={() => onApprove(plan.id)}>
                ✅ Approuver le plan
                </button>
            )}

            <div style={{display:'flex', gap:'5px'}}>
                <textarea
                placeholder="Commentaire pour correction…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{flexGrow: 1}}
                />
                <button
                className="warning"
                onClick={() => onCorrection(plan.id, comment)}
                disabled={!comment.trim()}
                >
                ⚠️ Demander corrections
                </button>
            </div>

            {plan.pdfUrl && (
              <button 
                className="secondary" 
                onClick={() => window.open(plan.pdfUrl, '_blank')}
                style={{marginTop: '10px', background: '#e2e8f0', color: '#334155'}}
              >
                📄 Télécharger le PDF officiel
              </button>
            )}
        </div>
      </div>
    </div>
  );
}