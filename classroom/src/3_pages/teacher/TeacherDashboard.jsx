import React, { useEffect, useState } from "react";
import Navbar from "../../4_components/common/Navbar.jsx";
import QuestionBlock from "../../4_components/plans/QuestionBlock.jsx";
import ResultPanel from "../../4_components/plans/ResultPanel.jsx";
import StatusBadge from "../../4_components/common/StatusBadge.jsx"; 

import { useAuth } from "../../2_context/AuthContext.jsx";
import { getActiveForm } from "../../5_services/formService.js";
import { 
  createPlan, 
  getPlansForTeacher, 
  submitPlan, 
  updatePlanAnswers 
} from "../../5_services/planService.js";
import { analyzeAnswerWithAI } from "../../5_services/aiService.js";
import { PLAN_STATUS } from "../../6_utils/constant";
import "./teacher.css"; 

export default function TeacherDashboard() {
  const { user, profile } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const [activeForm, teacherPlans] = await Promise.all([
          getActiveForm(),
          getPlansForTeacher(user.uid),
        ]);
        setForm(activeForm);
        setPlans(teacherPlans);
        if (teacherPlans.length > 0) {
            setCurrentPlan(teacherPlans[0]);
        }
      } catch (error) {
        console.error("Erreur au chargement des données (Vérifiez les règles Firebase!):", error);
        setForm(null); 
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  
  const createNewPlan = async () => {
    if (!form) return alert("Aucun formulaire actif trouvé. Contactez l'administrateur.");
    try {
        setLoading(true);
        const p = await createPlan({
            teacherId: user.uid,
            teacherName: profile?.displayName || user.email,
            formId: form.id,
            questions: form.questions,
        });
        const newPlans = [p, ...plans];
        setPlans(newPlans);
        setCurrentPlan(p);
    } catch(err) {
        alert("Échec de la création du nouveau plan. Vérifiez vos règles Firestore (collection 'plans', permission 'create').");
        console.error("Erreur à la création du plan:", err);
    } finally {
        setLoading(false);
    }
  };

  const saveCurrentPlan = async () => {
    if (!currentPlan || currentPlan.status !== PLAN_STATUS.DRAFT) return;
    setIsSaving(true);
    try {
        await updatePlanAnswers(currentPlan.id, currentPlan.answers);
        setPlans(plans.map(p => p.id === currentPlan.id ? {...currentPlan, status: PLAN_STATUS.DRAFT} : p));
    } catch (error) {
        console.error("Erreur à la sauvegarde:", error);
        alert("Échec de la sauvegarde du plan. (Vérifiez la permission 'update' sur 'plans')");
    } finally {
        setIsSaving(false);
    }
  };

  const submitPlanForApproval = async () => {
    if (!currentPlan) return;
    if (currentPlan.status === PLAN_STATUS.SUBMITTED || currentPlan.status === PLAN_STATUS.APPROVED) {
         return alert(`Ce plan a déjà été ${currentPlan.status === PLAN_STATUS.SUBMITTED ? 'soumis' : 'approuvé'}.`);
    }

    const allQuestionsAnswered = currentPlan.answers.every(a => a.answerText && a.answerText.trim() !== "");
    if (!allQuestionsAnswered) {
        return alert("Veuillez répondre à toutes les questions avant de soumettre.");
    }
    
    if (form.questions.length < 10) {
         return alert(`Le formulaire actif (${form.questions.length} questions) doit contenir au moins 10 questions pour être soumis.`);
    }

    try {
        await submitPlan(currentPlan.id, currentPlan.answers);

        const updatedPlan = { ...currentPlan, status: PLAN_STATUS.SUBMITTED };
        setCurrentPlan(updatedPlan);
        setPlans(plans.map(p => p.id === currentPlan.id ? updatedPlan : p));

        alert("Plan de cours soumis pour approbation! Le PDF sera généré peu après.");
    } catch (err) {
        console.error("Erreur lors de la soumission du plan:", err);
        alert("Échec de la soumission du plan.");
    }
  };

  const handleAiAnalysis = async (question, index) => {
    const answerText = currentPlan?.answers[index]?.answerText;
    if (!answerText) return alert("Réponse vide !");
    
    setAiLoadingIndex(index);
    try {
      const feedback = await analyzeAnswerWithAI(question, answerText);
      setCurrentPlan((prev) => {
        const updatedAnswers = [...prev.answers];
        updatedAnswers[index] = { ...updatedAnswers[index], aiFeedback: feedback };
        return { ...prev, answers: updatedAnswers, status: PLAN_STATUS.DRAFT };
      });
      await updatePlanAnswers(currentPlan.id, currentPlan.answers); 
      
    } catch(err) {
        console.error("Erreur d'analyse IA:", err);
        alert("Échec de l'analyse IA. Vérifiez l'implémentation de aiService.js.");
    } finally {
      setAiLoadingIndex(null);
    }
  };
    
  if (loading) return (
    <>
      <Navbar />
      <div className="dashboard-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', paddingTop: '100px', background: 'white' }}>
          <p>Chargement du tableau de bord...</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar /> 
      
      <div className="dashboard-page-wrapper">
        
        <aside className="teacher-sidebar">
            <div style={{marginTop:20}}>
          <h2>📘 Mes plans</h2>
          <button className="btn-primary" onClick={createNewPlan} disabled={!form || loading}>
            {loading ? "Chargement..." : "+ Nouveau plan"}
          </button>
          
          <div className="plan-list">
            {plans.length === 0 ? (
              <p style={{textAlign:'center', opacity:0.6}}>Aucun plan.</p>
            ) : (
              plans.map((p) => (
                <div
                  key={p.id}
                  className={`plan-item ${currentPlan?.id === p.id ? "active" : ""}`}
                  onClick={() => setCurrentPlan(p)}
                >
                  <div style={{fontWeight:'bold'}}>{p.title}</div>
                  <StatusBadge type="plan" value={p.status} /> 
                </div>
              ))
            )}
          </div>
          </div>
        </aside>

        <main className="teacher-content">
          {!currentPlan ? (
            <div className="empty-state">
              <p>👈 Sélectionnez un plan pour commencer ou créez-en un nouveau.</p>
            </div>
          ) : (
            <>
              <div className="plan-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
                <h1 style={{margin:0}}>{currentPlan.title}</h1>
                <div className="plan-actions" style={{display:'flex', gap:'10px'}}>
                    <button className="btn-secondary" onClick={saveCurrentPlan} disabled={isSaving || currentPlan.status !== PLAN_STATUS.DRAFT}>
                        {isSaving ? "Sauvegarde..." : "💾 Sauvegarder"}
                    </button>
                    <button 
                        className="btn-primary" 
                        onClick={submitPlanForApproval} 
                        disabled={currentPlan.status === PLAN_STATUS.SUBMITTED || currentPlan.status === PLAN_STATUS.APPROVED}
                    >
                        {currentPlan.status === PLAN_STATUS.SUBMITTED ? "Soumis" : currentPlan.status === PLAN_STATUS.APPROVED ? "Approuvé" : "Soumettre pour validation"}
                    </button>
                </div>
              </div>
              
              <div className="content-scroll-area">
                {form?.questions?.map((q, i) => (
                  <div key={i} className="question-card">
                    <QuestionBlock
                      index={i}
                      question={q}
                      answer={currentPlan.answers[i]}
                      onChangeAnswer={(txt) => {
                         setCurrentPlan((prev) => {
                            const updatedAnswers = [...prev.answers];
                            updatedAnswers[i] = { ...updatedAnswers[i], answerText: txt };
                            updatedAnswers[i].aiFeedback = null;
                            return { 
                                ...prev, 
                                answers: updatedAnswers,
                                status: PLAN_STATUS.DRAFT 
                            };
                         });
                      }}
                    />
                    <button 
                      className="btn-ai"
                      onClick={() => handleAiAnalysis(q, i)}
                      disabled={aiLoadingIndex === i || currentPlan.status === PLAN_STATUS.APPROVED || currentPlan.status === PLAN_STATUS.SUBMITTED}
                    >
                      {aiLoadingIndex === i ? "Analyse..." : "✨ Analyser IA"}
                    </button>
                    {currentPlan.answers[i]?.aiFeedback && (
                      <div style={{marginTop:10, padding:10, background: '#f8fafc', borderRadius:6, border: '1px solid #eef2ff', whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: '0.9rem'}}>
                        {currentPlan.answers[i].aiFeedback}
                      </div>
                    )}
                  </div>
                ))}
                
                {currentPlan.answers.length > 0 && (
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