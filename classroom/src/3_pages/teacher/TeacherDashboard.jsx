import React, { useEffect, useState } from "react";
import Navbar from "../../4_components/common/Navbar.jsx";
import QuestionBlock from "../../4_components/plans/QuestionBlock.jsx";
import ResultPanel from "../../4_components/plans/ResultPanel.jsx";
import { useAuth } from "../../2_context/AuthContext.jsx";
import { getActiveForm } from "../../5_services/formService.js";
import { createPlan, getPlansForTeacher } from "../../5_services/planService.js";
import { analyzeAnswerWithAI } from "../../5_services/aiService.js";
import "./teacher.css";

export default function TeacherDashboard() {
  const { user, profile } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);

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
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const createNewPlan = async () => {
    if (!form) return;
    const p = await createPlan({
      teacherId: user.uid,
      teacherName: profile?.displayName || user.email,
      formId: form.id,
      questions: form.questions,
    });
    setPlans([p, ...plans]);
    setCurrentPlan(p);
  };

  const handleAiAnalysis = async (question, index) => {
    const answerText = currentPlan?.answers[index]?.answerText;
    if (!answerText) return alert("Réponse vide !");
    
    setAiLoadingIndex(index);
    try {
      const feedback = await analyzeAnswerWithAI(question, answerText);
      setCurrentPlan((prev) => {
        const updated = [...prev.answers];
        updated[index] = { ...updated[index], aiFeedback: feedback };
        return { ...prev, answers: updated };
      });
    } finally {
      setAiLoadingIndex(null);
    }
  };

  return (
    <>
      <Navbar /> 
      
      <div className="dashboard-page-wrapper">
        
        <aside className="teacher-sidebar">
            <div style={{marginTop:100}}>
          <h2>📘 Mes plans</h2>
          <button className="btn-primary" onClick={createNewPlan}>+ Nouveau plan</button>
          
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
                  <div style={{fontSize:'12px', opacity:0.8}}>{p.status}</div>
                </div>
              ))
            )}
          </div>
          </div>
        </aside>

        <main className="teacher-content">
          {!currentPlan ? (
            <div className="empty-state">
              <p>👈 Sélectionnez un plan pour commencer</p>
            </div>
          ) : (
            <>
              <div className="plan-header">
                <h1>{currentPlan.title}</h1>
              </div>
              
              <div className="content-scroll-area">
                {form?.questions?.map((q, i) => (
                  <div key={i} className="question-card">
                    <QuestionBlock
                      index={i}
                      question={q}
                      answer={currentPlan.answers[i]}
                      onChangeAnswer={(txt) => {
                         const updated = [...currentPlan.answers];
                         updated[i] = { ...updated[i], answerText: txt };
                         setCurrentPlan({ ...currentPlan, answers: updated });
                      }}
                    />
                    <button 
                      className="btn-ai"
                      onClick={() => handleAiAnalysis(q, i)}
                      disabled={aiLoadingIndex === i}
                    >
                      {aiLoadingIndex === i ? "..." : "✨ Analyser IA"}
                    </button>
                    {currentPlan.answers[i]?.aiFeedback && (
                      <div style={{marginTop:10, padding:10, background:'#f0fdf4', borderRadius:6}}>
                        {currentPlan.answers[i].aiFeedback}
                      </div>
                    )}
                  </div>
                ))}
                <ResultPanel answers={currentPlan.answers} />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}