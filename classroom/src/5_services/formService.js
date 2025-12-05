import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getActiveForm() {
  try {
    const q = query(collection(db, "formulaires"), where("actif", "==", true));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      console.warn("Aucun formulaire actif trouvé dans Firestore. Utilisation de données mock.");
      return {
        id: "MOCK_FORM",
        nom: "Formulaire de Démonstration (Actif)",
        session: "H25",
        actif: true,
        questions: [
            { id: "q1", text: "Objectifs du cours (Règle: min 100 mots)", rule: "Vérifier que la description contient au moins 100 mots et mentionne les objectifs d'apprentissage." },
            { id: "q2", text: "Méthodes d'évaluation (Règle: mentionner 'examen' et 'projet')", rule: "Vérifier la mention d'un examen et d'un projet pour l'évaluation." },
            { id: "q3", text: "Activités d'apprentissage (Règle: optionnelle)", rule: "" },
        ],
      };
    }
    
    const formDoc = snap.docs[0];
    return { id: formDoc.id, ...formDoc.data() };
  } catch (error) {
    console.error("Erreur lors de la récupération du formulaire actif:", error);
    throw new Error("Impossible de charger le formulaire actif.");
  }
}