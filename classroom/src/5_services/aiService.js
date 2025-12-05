import { OpenAI } from "openai";
import { AI_STATUS } from "../6_utils/constant";
const OPENAI_API_KEY = "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";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export async function analyzeAnswerWithAI(question, answerText) {
  const responseSchema = {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: [AI_STATUS.CONFORME, AI_STATUS.A_AMELIORER, AI_STATUS.NON_CONFORME],
        description: "Le statut de conformité selon la règle de validation (CONFORME, A_AMELIORER, ou NON_CONFORME).",
      },
      pointsPositifs: {
        type: "array",
        items: { type: "string" },
        description: "Liste des points forts identifiés (au moins un, si CONFORME).",
      },
      pointsAmeliorer: {
        type: "array",
        items: { type: "string" },
        description: "Liste des points à améliorer ou manquants (au moins un, si A_AMELIORER ou NON_CONFORME).",
      },
      suggestionCorrection: {
        type: "string",
        description: "Suggestion de correction si le statut est 'A_AMELIORER' ou 'NON_CONFORME'. Doit être une phrase claire.",
      },
    },
    required: ["status", "pointsPositifs", "pointsAmeliorer", "suggestionCorrection"],
  };

  const userPrompt = `
    Question: "${question.text}"
    Règle de validation: "${question.rule}"
    Réponse de l'enseignant à analyser: 
    ---
    ${answerText}
    ---
    Analyse cette réponse strictement en fonction de la Règle de validation. Ton analyse doit suivre le Schéma JSON fourni.
    `;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: `Tu es un coordonnateur pédagogique spécialisé dans l'analyse de plans de cours. Ton rôle est de valider la conformité d'une réponse d'enseignant à une règle spécifique, en fournissant une analyse structurée. La réponse DOIT être un objet JSON qui suit STRICTEMENT ce schéma: ${JSON.stringify(responseSchema)}.`,
        },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, 
      temperature: 0.1, 
    });

    const aiResponseJson = JSON.parse(completion.choices[0].message.content);
    
    let feedback = `Statut: ${aiResponseJson.status}\n`;
    
    if (aiResponseJson.pointsPositifs && aiResponseJson.pointsPositifs.length > 0) {
      feedback += "Points forts:\n";
      feedback += aiResponseJson.pointsPositifs.map(p => `  - ${p}`).join('\n') + '\n';
    }
    
    if (aiResponseJson.pointsAmeliorer && aiResponseJson.pointsAmeliorer.length > 0) {
      feedback += "Points à améliorer:\n";
      feedback += aiResponseJson.pointsAmeliorer.map(p => `  - ${p}`).join('\n') + '\n';
    }

    if (aiResponseJson.suggestionCorrection) {
        feedback += `Suggestion: ${aiResponseJson.suggestionCorrection}\n`;
    }

    return feedback.trim();

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API OpenAI:", error);
    return `Erreur d'analyse IA: Impossible de contacter le service de validation. Vérifiez votre clé API ou les permissions réseau (Détails: ${error.message}).`;
  }
}