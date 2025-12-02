// 4_components/admin/PlanList.jsx
export default function PlanList({ plans, onSelect }) {
  return (
    <div className="admin-card">
      <h2>Plans soumis</h2>

      <div className="admin-list">
        {plans.map((p) => (
          <div key={p.id} className="admin-item" onClick={() => onSelect(p)}>
            <strong>{p.cours}</strong> – {p.enseignant}
            <span>{p.statut}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
