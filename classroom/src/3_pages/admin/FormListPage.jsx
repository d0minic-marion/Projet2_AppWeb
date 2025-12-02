

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
                        <div>
                            <strong>{f.nom}</strong>({f.session})
                        </div>

                        {/*ajouter StatusBadge */}

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