import React from "react";
import StatusBadge from "../../4_components/common/StatusBadge";

export default function PlanList({ plans, onSelect }) {
  return (
    <div className="admin-card">
      <h2>Plans soumis</h2>

      <div className="admin-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {plans.length === 0 && <p style={{opacity:0.5, fontStyle:'italic'}}>Aucun plan soumis.</p>}
        
        {plans.map((p) => (
          <div key={p.id} className="admin-item" onClick={() => onSelect(p)}>
            <div>
                <div style={{fontWeight: 'bold'}}>{p.title || "Plan sans titre"}</div>
                <div style={{fontSize: '0.85rem', opacity: 0.7}}>Par : {p.teacherName || "Inconnu"}</div>
            </div>
            
            <span style={{ 
                fontWeight:'bold', 
                fontSize:'0.8rem',
                color: p.status === 'APPROVED' ? 'green' : p.status === 'SUBMITTED' ? '#d97706' : '#64748b'
            }}>
                {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}