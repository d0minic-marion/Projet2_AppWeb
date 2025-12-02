// src/3_pages/admin/AdminDashboard.jsx

import "./AdminDashboard.css";
import { useEffect, useState } from "react";



// Components (déjà faits par toi)
import Navbar from "../../4_components/common/Navbar"

import FormEditor from "./FormEditPage";
import FormList from "./FormListPage";
import PlanDetails from "./PlanDetailPage";
import PlanList from "./PlanEditPage";

 
// Firebase services

export default function AdminDashboard() {
  // ---------------- STATE ----------------
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    loadForms(),
    loadPlans()
  }, []);

  async function loadForms() {
    const data = await getFormulaires();
    setForms(data);
    setSelectedForm(data[0] || null);
  }

  async function loadPlans() {
    const data = await getPlans();
    setPlans(data);
  }

  // ---------------- FORM ACTIONS ----------------
  async function handleCreateForm(form) {
    await createFormulaire(form.nom, form.session);
    loadForms();
  }

  async function handleDeleteForm(id) {
    await deleteFormulaire(id);
    loadForms();
  }

  async function handleToggleForm(form) {
    try {
      await toggleActivation(form.id, form.actif, form.questions.length);
      loadForms();
    } catch (err) {
      alert(err.message);
    }
  }

  // ---------------- QUESTION ACTIONS ----------------
  async function handleAddQuestion(question) {
    await addQuestion(selectedForm.id, question);
    loadForms();
  }

  async function handleDeleteQuestion(questionId) {
    await removeQuestion(selectedForm.id, questionId);
    loadForms();
  }

  // ---------------- PLAN ACTIONS ----------------
  async function handleApprove(planId) {
    await updatePlanStatus(planId, "Approuvé");
    loadPlans();
    setSelectedPlan(null);
  }

  async function handleCorrection(planId, comment) {
    await updatePlanStatus(planId, "Correction demandée", comment);
    loadPlans();
    setSelectedPlan(null);
  }


  return (

<div className="admin-page">
  <Navbar />
  <h1 className="admin-title">TABLEAU DE BORD</h1>

  <div className="admin-grid-3">

    {/* Colonne 1 → Formulaires */}


    {/* Colonne 2 → Création formulaire */}
    <div className="admin-section">
      <FormEditor onCreate={handleCreateForm} />
    </div>

    <div className="admin-section">
      <FormList
        forms={forms}
        selectedForm={selectedForm}
        onSelect={setSelectedForm}
        onToggle={handleToggleForm}
        onDelete={handleDeleteForm}
      />
    </div>




    {/* Colonne 3 → Plans soumis */}
    <div className="admin-section">
      <PlanList plans={plans} onSelect={setSelectedPlan} />
    </div>

  </div>

  {/* En dessous (pas dans la grille) */}
  {selectedForm && (
    <div className="admin-section" style={{ marginTop: "20px" }}>
      <QuestionEditor
        form={selectedForm}
        onAdd={handleAddQuestion}
        onDelete={handleDeleteQuestion}
      />
    </div>
  )}

  {/* Détails du plan (popup ou card) */}
  {selectedPlan && (
    <PlanDetails
      plan={selectedPlan}
      onApprove={handleApprove}
      onCorrection={handleCorrection}
      onClose={() => setSelectedPlan(null)}
    />
  )}

</div>

  );
}
