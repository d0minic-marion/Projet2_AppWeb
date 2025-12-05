import React, { useState } from "react";
import { PLAN_STATUS } from "../../6_utils/constant";

export default function PlanList({ plans, onSelect }) {
  const [searchName, setSearchName] = useState("");
  const [searchSession, setSearchSession] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const filteredPlans = plans.filter((p) => {
    const matchName = (p.teacherName || "").toLowerCase().includes(searchName.toLowerCase());
    
    const matchSession = (p.session || "").toLowerCase().includes(searchSession.toLowerCase());
    
    const matchStatus = searchStatus === "" || p.status === searchStatus;

    return matchName && matchSession && matchStatus;
  });

  return (
    <div className="admin-card plans-card-container">
      <h2 style={{ marginBottom: '15px', flexShrink: 0 }}>
        Plans soumis ({filteredPlans.length})
      </h2>

      <div className="filters-container" style={{ flexShrink: 0 }}>
        <input
          type="text"
          placeholder="🔍 Chercher un prof..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="filter-input"
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Session..."
            value={searchSession}
            onChange={(e) => setSearchSession(e.target.value)}
            className="filter-input small"
            style={{ flex: 1 }}
          />

          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="filter-select"
            style={{ flex: 1.5 }}
          >
            <option value="">Tous statuts</option>
            <option value={PLAN_STATUS.SUBMITTED}>Soumis</option>
            <option value={PLAN_STATUS.APPROVED}>Approuvé</option>
            <option value={PLAN_STATUS.NEEDS_CHANGES}>À corriger</option>
            <option value={PLAN_STATUS.DRAFT}>Brouillon</option>
          </select>
        </div>
      </div>

      <div className="admin-list plans-scroll-area">
        {filteredPlans.length === 0 && (
            <p style={{ opacity: 0.5, fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                Aucun plan ne correspond.
            </p>
        )}
        
        {filteredPlans.map((p) => (
          <div key={p.id} className="admin-item" onClick={() => onSelect(p)}>
            <div style={{overflow: 'hidden'}}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.title || "Plan sans titre"}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.7, display:'flex', alignItems:'center', gap:'6px', marginTop:'2px' }}>
                    <span>👤 {p.teacherName || "Inconnu"}</span>
                    {p.session && (
                        <span style={{
                            backgroundColor: '#e2e8f0', 
                            padding: '1px 6px', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            fontWeight: '600'
                        }}>
                            {p.session}
                        </span>
                    )}
                </div>
            </div>
            
            <span style={{ 
                fontWeight: 'bold', 
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '12px',
                flexShrink: 0,
                marginLeft: '10px',
                backgroundColor: 
                    p.status === 'APPROVED' ? '#dcfce7' : 
                    p.status === 'SUBMITTED' ? '#fef3c7' : 
                    p.status === 'NEEDS_CHANGES' ? '#fee2e2' : '#f1f5f9',
                color: 
                    p.status === 'APPROVED' ? '#166534' : 
                    p.status === 'SUBMITTED' ? '#d97706' : 
                    p.status === 'NEEDS_CHANGES' ? '#991b1b' : '#64748b'
            }}>
                {p.status === 'APPROVED' ? 'APPROUVÉ' : 
                 p.status === 'SUBMITTED' ? 'SOUMIS' : 
                 p.status === 'NEEDS_CHANGES' ? 'CORRECTION' : 'BROUILLON'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}