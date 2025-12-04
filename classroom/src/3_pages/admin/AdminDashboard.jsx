import "./AdminDashboard.css";
import { useEffect, useState } from "react";

import Navbar from "../../4_components/common/Navbar"

import FormEditor from "./FormEditPage";
import FormList from "./FormListPage";
import PlanDetails from "./PlanDetailPage";
import PlanList from "./PlanEditPage";
import QuestionEditor from "./QuestionEditor";

import {
  getFormulaires,
  createFormulaire,
  deleteFormulaire,
  toggleActivation,
  addQuestion,
  removeQuestion,
  getPlans,
  updatePlanStatus,
} from "./firebaseAdmin";


export default function AdminDashboard() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadForms();
    loadPlans();
  }, []);

  async function loadForms() {
    const data = await getFormulaires();
    setForms(data);
    setSelectedForm((prev) => {
      const currentSelected = data.find(f => f.id === prev?.id);
      return currentSelected || data[0] || null;
    });
  }

  async function loadPlans() {
    const data = await getPlans();
    setPlans(data);
  }

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

  async function handleAddQuestion(question) {
    await addQuestion(selectedForm.id, question);
    loadForms();
  }

  async function handleDeleteQuestion(questionId) {
    await removeQuestion(selectedForm.id, questionId);
    loadForms();
  }

  async function handleApprove(planId) {
    await updatePlanStatus(planId, "APPROVED");
    loadPlans();
    setSelectedPlan(null);
  }

  async function handleCorrection(planId, comment) {
    await updatePlanStatus(planId, "NEEDS_CHANGES", comment);
    loadPlans();
    setSelectedPlan(null);
  }


  return (

<div className="admin-page">
  <Navbar />
  <h1 className="admin-title">TABLEAU DE BORD</h1>

  <div className="admin-grid-3">

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


    <div className="admin-section">
      <PlanList plans={plans} onSelect={setSelectedPlan} />
    </div>

  </div>

  {selectedForm && (
    <div className="admin-section" style={{ marginTop: "20px" }}>
      <QuestionEditor
        form={selectedForm}
        onAdd={handleAddQuestion}
        onDelete={handleDeleteQuestion}
      />
    </div>
  )}

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