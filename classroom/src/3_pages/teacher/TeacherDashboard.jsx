import React, { useEffect, useState } from "react";
import Navbar from "../../4_components/common/Navbar.jsx";
import QuestionBlock from "../../4_components/plans/QuestionBlock.jsx";
import ResultPanel from "../../4_components/plans/ResultPanel.jsx";
import StatusBadge from "../../4_components/common/StatusBadge.jsx";

import { useAuth } from "../../2_context/AuthContext.jsx";
import {
  createPlan,
  getPlansForTeacher,
  submitPlan,
  updatePlanAnswers,
  deletePlan 
} from "../../5_services/planService.js";
import { analyzeAnswerWithAI } from "../../5_services/aiService.js";
import { PLAN_STATUS } from "../../6_utils/constant";
import "./teacher.css";

import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function FormSelectionModal({ forms, onSelect, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-glass-panel">
        
        <div className="modal-header">
          <div className="modal-icon-header">✨</div>
          <h3>Nouveau Plan de Cours</h3>
          <p>Sélectionnez un modèle approuvé pour commencer.</p>
        </div>

        <div className="modal-grid">
            {forms.map(f => (
                <div key={f.id} className="form-choice-card" onClick={() => onSelect(f)}>
                    <div className="card-icon">📝</div>
                    <div className="card-info">
                        <span className="card-title">{f.nom}</span>
                        <span className="card-badge">{f.session}</span>
                    </div>
                    <div className="card-arrow">→</div>
                </div>
            ))}
        </div>

        <button className="modal-cancel-link" onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user, profile } = useAuth();
  
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [activeForms, setActiveForms] = useState([]);
  
  const [showSelector, setShowSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const teacherPlans = await getPlansForTeacher(user.uid);
        setPlans(teacherPlans);
        
        if (teacherPlans.length > 0) {
            setCurrentPlan(teacherPlans[0]);
        }

        const q = query(collection(db, "formulaires"), where("actif", "==", true));
        const snap = await getDocs(q);
        const formsData = snap.docs.map(d => ({id: d.id, ...d.data()}));
        setActiveForms(formsData);

      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);


  const handleCreateClick = () => {
      if (activeForms.length === 0) {
          return alert("Aucun formulaire disponible pour l'instant. Veuillez contacter l'administrateur.");
      }
      if (activeForms.length === 1) {
          createPlanFromForm(activeForms[0]);
      } else {
          setShowSelector(true);
      }
  };

  const createPlanFromForm = async (selectedForm) => {
    setShowSelector(false); 
    try {
        setLoading(true);
        const p = await createPlan({
            teacherId: user.uid,
            teacherName: profile?.displayName || user.email,
            formId: selectedForm.id,
            questions: selectedForm.questions,
            title: `${selectedForm.nom}`,
            session: selectedForm.session
        });
        
        const newPlans = [p, ...plans];
        setPlans(newPlans);
        setCurrentPlan(p);
    } catch(err) {
        console.error("Erreur création:", err);
        alert("Impossible de créer le plan.");
    } finally {
        setLoading(false);
    }
  };

  const handleDeletePlan = async (e, planId) => {
    e.stopPropagation();
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce plan ? Cette action est irréversible.")) {
      return;
    }

    try {
      await deletePlan(planId);
      
      const newList = plans.filter(p => p.id !== planId);
      setPlans(newList);

      if (currentPlan && currentPlan.id === planId) {
        setCurrentPlan(null);
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const saveCurrentPlan = async () => {
    if (!currentPlan || (currentPlan.status !== PLAN_STATUS.DRAFT && currentPlan.status !== PLAN_STATUS.NEEDS_CHANGES)) return;
    
    setIsSaving(true);
    try {
        await updatePlanAnswers(currentPlan.id, currentPlan.answers);
        setPlans(plans.map(p => p.id === currentPlan.id ? {...currentPlan} : p));
    } catch (error) {
        console.error("Erreur sauvegarde:", error);
        alert("Échec de la sauvegarde.");
    } finally {
        setIsSaving(false);
    }
  };

  const submitPlanForApproval = async () => {
    if (!currentPlan) return;
    
    if (currentPlan.status !== PLAN_STATUS.DRAFT && currentPlan.status !== PLAN_STATUS.NEEDS_CHANGES) {
         return alert(`Ce plan est en attente ou déjà validé. Il ne peut plus être modifié.`);
    }

    const allQuestionsAnswered = currentPlan.answers.every(a => a.answerText && a.answerText.trim() !== "");
    if (!allQuestionsAnswered) {
        return alert("Veuillez répondre à toutes les questions avant de soumettre.");
    }
    
    if (currentPlan.answers.length < 10) {
         return alert(`Ce plan contient moins de 10 questions (${currentPlan.answers.length}). Il ne peut pas être soumis.`);
    }

    setIsSaving(true);

    try {
        await submitPlan(currentPlan.id, currentPlan.answers, currentPlan);

        const updatedPlan = { ...currentPlan, status: PLAN_STATUS.SUBMITTED };
        setCurrentPlan(updatedPlan);
        setPlans(plans.map(p => p.id === currentPlan.id ? updatedPlan : p));

        alert("Plan soumis et PDF généré avec succès !");
    } catch (err) {
        console.error("Erreur soumission:", err);
        alert("Échec de la soumission ou de la génération PDF.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleAiAnalysis = async (question, index) => {
    const answerText = currentPlan?.answers[index]?.answerText;
    if (!answerText) return alert("Veuillez écrire une réponse avant d'analyser.");
    
    setAiLoadingIndex(index);
    try {
      const feedback = await analyzeAnswerWithAI(question, answerText);
      
      setCurrentPlan((prev) => {
        const updatedAnswers = [...prev.answers];
        updatedAnswers[index] = { ...updatedAnswers[index], aiFeedback: feedback };
        return { ...prev, answers: updatedAnswers };
      });

      await updatePlanAnswers(currentPlan.id, currentPlan.answers); 
      
    } catch(err) {
        console.error("Erreur IA:", err);
        alert("Erreur lors de l'analyse IA.");
    } finally {
      setAiLoadingIndex(null);
    }
  };
    
  if (loading) return (
    <>
      <Navbar />
      <div className="dashboard-page-wrapper" style={{ justifyContent: 'center', paddingTop: '100px' }}>
          <p>Chargement...</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar /> 
      
      {showSelector && (
          <FormSelectionModal 
            forms={activeForms} 
            onSelect={createPlanFromForm} 
            onClose={() => setShowSelector(false)} 
          />
      )}

      <div className="dashboard-page-wrapper">
        
        <aside className="teacher-sidebar">
            <div style={{marginTop:20}}>
          <h2>📘 Mes plans</h2>
          
          <button className="btn-primary" onClick={handleCreateClick} disabled={loading}>
            + Nouveau plan
          </button>
          
          <div className="plan-list">
            {plans.length === 0 ? (
              <p style={{textAlign:'center', opacity:0.6, marginTop:20, fontSize:'0.9rem'}}>
                Aucun plan créé.
              </p>
            ) : (
              plans.map((p) => (
                <div
                  key={p.id}
                  className={`plan-item ${currentPlan?.id === p.id ? "active" : ""}`}
                  onClick={() => setCurrentPlan(p)}
                >
                  <div style={{flexGrow: 1}}>
                    <div style={{fontWeight:'bold', fontSize:'0.95rem'}}>{p.title || "Sans titre"}</div>
                    <div style={{display:'flex', alignItems:'center', marginTop:4, gap: 10}}>
                       <StatusBadge type="plan" value={p.status} />
                       <span style={{fontSize:'0.8rem', opacity:0.7}}>{p.session || ""}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-icon-delete"
                    onClick={(e) => handleDeletePlan(e, p.id)}
                    title="Supprimer ce plan"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
          </div>
        </aside>

        <main className="teacher-content">
          {!currentPlan ? (
            <div className="empty-state">
              <p>👈 Sélectionnez un plan ou créez-en un nouveau pour commencer.</p>
              {activeForms.length === 0 && (
                  <p style={{color:'#e03131', fontWeight:'bold', marginTop:10}}>
                      ⚠️ Aucun formulaire n'est disponible actuellement. Contactez l'admin.
                  </p>
              )}
            </div>
          ) : (
            <>
              <div className="plan-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px', flexWrap:'wrap', gap:10}}>
                <h1 style={{margin:0}}>{currentPlan.title}</h1>
                <div className="plan-actions" style={{display:'flex', gap:'10px'}}>
                    <button 
                        className="btn-secondary" 
                        onClick={saveCurrentPlan} 
                        disabled={isSaving || (currentPlan.status !== PLAN_STATUS.DRAFT && currentPlan.status !== PLAN_STATUS.NEEDS_CHANGES)}
                    >
                        {isSaving ? "..." : "💾 Sauvegarder"}
                    </button>
                    <button 
                        className="btn-primary" 
                        style={{margin:0}}
                        onClick={submitPlanForApproval} 
                        disabled={currentPlan.status !== PLAN_STATUS.DRAFT && currentPlan.status !== PLAN_STATUS.NEEDS_CHANGES}
                    >
                        {isSaving ? "Génération PDF..." : 
                         currentPlan.status === PLAN_STATUS.SUBMITTED ? "En attente" : 
                         currentPlan.status === PLAN_STATUS.APPROVED ? "Validé" : "Soumettre"}
                    </button>
                </div>
              </div>

              {currentPlan.status === PLAN_STATUS.NEEDS_CHANGES && currentPlan.commentaireAdmin && (
                <div className="admin-feedback-alert">
                  <h3>⚠️ Corrections demandées</h3>
                  <p>{currentPlan.commentaireAdmin}</p>
                </div>
              )}
              
              <div className="content-scroll-area">
                {currentPlan.questions?.map((q, i) => (
                  <div key={i} className="question-card">
                    <QuestionBlock
                      index={i}
                      question={q}
                      answer={currentPlan.answers[i]}
                      
                      onChangeAnswer={(txt) => {
                         if (currentPlan.status !== PLAN_STATUS.DRAFT && currentPlan.status !== PLAN_STATUS.NEEDS_CHANGES) return;

                         setCurrentPlan((prev) => {
                            const updatedAnswers = [...prev.answers];
                            updatedAnswers[i] = { ...updatedAnswers[i], answerText: txt };
                            updatedAnswers[i].aiFeedback = null;
                            return { ...prev, answers: updatedAnswers };
                         });
                      }}
                    />
                    
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <button 
                        className="btn-ai"
                        onClick={() => handleAiAnalysis(q, i)}
                        disabled={aiLoadingIndex === i || (currentPlan.status !== PLAN_STATUS.DRAFT && currentPlan.status !== PLAN_STATUS.NEEDS_CHANGES)}
                        >
                        {aiLoadingIndex === i ? "Analyse..." : "✨ Analyser IA"}
                        </button>
                    </div>
                    
                    {currentPlan.answers[i]?.aiFeedback && (
                      <div style={{marginTop:15, padding:15, background: '#f8fafc', borderRadius:8, borderLeft: '4px solid #4c6ef5', whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: '0.9rem', color:'#334155'}}>
                        <strong>Analyse IA :</strong><br/>
                        {currentPlan.answers[i].aiFeedback}
                      </div>
                    )}
                  </div>
                ))}
                
                {currentPlan.answers && currentPlan.answers.length > 0 && (
                    <ResultPanel answers={currentPlan.answers} />
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}