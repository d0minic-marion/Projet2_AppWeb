import React from 'react';
import StatusBadge from "../../4_components/common/StatusBadge";
import { PLAN_STATUS } from "../../6_utils/constant";

const getFormStatus = (actif) => actif ? PLAN_STATUS.APPROVED : PLAN_STATUS.DRAFT;

export default function FormList({forms, selectedForm, onSelect, onToggle, onDelete}){
    return(
        <div className="admin-card">
            <h2>Formulaires</h2>

            <div className="admin-list">
                {forms.map((f)=>(
                    <div
                        key={f.id}
                        className={`admin-item ${selectedForm?.id=== f.id? "active" :""}`}
                        onClick={()=>onSelect(f)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <strong>{f.nom}</strong>({f.session})
                            <StatusBadge type="plan" value={getFormStatus(f.actif)} />
                        </div>

                        <div className="admin-row">
                            <button onClick={(e)=>{ e.stopPropagation(); onToggle(f); }}>
                                {f.actif ? "Désactiver" : "Activer"}
                            </button>
                            <button className="danger" onClick={(e)=>{e.stopPropagation(); onDelete(f.id);}}>
                                Supprimer
                            </button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )


}