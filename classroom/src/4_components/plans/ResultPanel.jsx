import React from "react";
import StatusBadge from "../common/StatusBadge"; 
import { AI_STATUS } from "../../6_utils/constant";

export default function ResultPanel({ answers }) {
  const totalQuestions = answers.length;
  
  const aiStatuses = answers.map(a => {
    if (a.aiFeedback?.includes("Conforme")) return AI_STATUS.CONFORME;
    if (a.aiFeedback?.includes("améliorer")) return AI_STATUS.A_AMELIORER;
    if (a.aiFeedback?.includes("Non conforme")) return AI_STATUS.NON_CONFORME;
    return null;
  }).filter(status => status !== null);

  const analyzedCount = aiStatuses.length;
  const conformingCount = aiStatuses.filter(status => status === AI_STATUS.CONFORME).length;

  return (
    <div className="admin-card" style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', textAlign: 'left' }}>
      <h3>Sommaire de validation IA</h3>
      <p style={{fontSize: '0.9rem', color: '#475569'}}>
        Questions: **{totalQuestions}** / Analysées: **{analyzedCount}** / Conformes: **{conformingCount}**
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
        <h4 style={{fontSize: '1rem', margin: 0}}>Statut de chaque question:</h4>
        {answers.map((a, i) => {
            let status = null;
            if (a.aiFeedback?.includes("Conforme")) status = AI_STATUS.CONFORME;
            else if (a.aiFeedback?.includes("améliorer")) status = AI_STATUS.A_AMELIORER;
            else if (a.aiFeedback?.includes("Non conforme")) status = AI_STATUS.NON_CONFORME;

            return (
              <div key={a.questionId || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dotted #e2e8f0', padding: '5px 0' }}>
                <span style={{ fontSize: '0.9rem' }}>Question {i + 1}</span>
                {status ? <StatusBadge type="ai" value={status} /> : <span style={{fontSize: '0.8rem', opacity: 0.6}}>Non analysé</span>}
              </div>
            );
        })}
      </div>
    </div>
  );
}