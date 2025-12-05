import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

export async function getFormulaires() {
  const snap = await getDocs(collection(db, "formulaires"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createFormulaire(nom, session) {
  return await addDoc(collection(db, "formulaires"), {
    nom,
    session,
    actif: false,
    createdAt: Date.now(),
    questions: [],
  });
}

export async function deleteFormulaire(id) {
  await deleteDoc(doc(db, "formulaires", id));
}

export async function toggleActivation(id, actif, nbQuestions) {
  if (!actif && nbQuestions < 10) {
    throw new Error("Un formulaire actif doit contenir au moins 10 questions.");
  }
  await updateDoc(doc(db, "formulaires", id), { actif: !actif });
}

export async function addQuestion(formId, question) {
  const refForm = doc(db, "formulaires", formId);
  const snap = await getDoc(refForm);
  const form = snap.data();

  await updateDoc(refForm, {
    questions: [...form.questions, question],
  });
}

export async function removeQuestion(formId, questionId) {
  const refForm = doc(db, "formulaires", formId);
  const snap = await getDoc(refForm);
  const form = snap.data();

  await updateDoc(refForm, {
    questions: form.questions.filter((q) => q.id !== questionId),
  });
}

export async function getPlans() {
  const snap = await getDocs(collection(db, "plans"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updatePlanStatus(planId, status, commentaire = "") {
  await updateDoc(doc(db, "plans", planId), {
    status: status,
    commentaireAdmin: commentaire,
  });
}

export async function getPDF(planId) {
  const pdfRef = ref(storage, `pdf/${planId}.pdf`);
  return await getDownloadURL(pdfRef);
}