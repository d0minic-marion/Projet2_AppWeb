import { useState } from "react";

export default function FormEditor({ onCreate }) {
  const [form, setForm] = useState({ nom: "", session: "" });

  function handleSubmit(e) {
    e.preventDefault();
    onCreate(form);
    setForm({ nom: "", session: "" });
  }

  return (
    <div className="admin-card">
      <h3>Créer un formulaire</h3>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="inputs-admin">
            <input
            type="text"
            placeholder="Nom du formulaire"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
            />

            <input
            type="text"
            placeholder="Session (ex: H25)"
            value={form.session}
            onChange={(e) => setForm({ ...form, session: e.target.value })}
            required
            />

        <button className="primary button-align">Créer</button>


        </div>

      </form>
    </div>
  );
}
