import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { PLAN_STATUS } from "../6_utils/constant";
import { generateAndUploadPDF } from "./pdfService";

export async function createPlan({ teacherId, teacherName, formId, questions, title, session }) {
  
  const answers = questions.map((q) => ({
    questionId: q.id,
    questionText: q.text,
    answerText: "",
    aiFeedback: null,
  }));

  const planData = {
    teacherId,
    teacherName,
    formId,
    questions,
    session: session || "",
    title: title || `Plan de cours - ${teacherName}`,
    status: PLAN_STATUS.DRAFT,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    answers: answers,
  };
  
  const docRef = await addDoc(collection(db, "plans"), planData);

  return { id: docRef.id, ...planData };
}

export async function getPlansForTeacher(teacherId) {
  const q = query(collection(db, "plans"), where("teacherId", "==", teacherId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function updatePlanAnswers(planId, answers) {
  const planRef = doc(db, "plans", planId);
  await updateDoc(planRef, {
    answers: answers,
    updatedAt: Date.now(),
  });
}

export async function submitPlan(planId, answers, planDetails) {
  
  const fullPlanData = { ...planDetails, answers }; 
  const pdfUrl = await generateAndUploadPDF(fullPlanData);

  const planRef = doc(db, "plans", planId);
  await updateDoc(planRef, {
    status: PLAN_STATUS.SUBMITTED,
    answers: answers, 
    updatedAt: Date.now(),
    pdfUrl: pdfUrl
  });

  return pdfUrl;
}

export async function deletePlan(planId) {
  const planRef = doc(db, "plans", planId);
  await deleteDoc(planRef);
}