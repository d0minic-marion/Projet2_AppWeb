import { jsPDF } from "jspdf";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function generateAndUploadPDF(plan) {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;
  
  const checkPageBreak = (heightNeeded) => {
    if (y + heightNeeded > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addWrappedText = (text, fontSize = 12, fontType = "normal", color = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontType);
    doc.setTextColor(...color);
    
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    const lineHeight = fontSize * 0.35 + 2;
    const blockHeight = lines.length * lineHeight;

    checkPageBreak(blockHeight);

    doc.text(lines, margin, y);
    y += blockHeight + 2;
  };

  doc.setFillColor(76, 110, 245);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Plan de Cours", margin, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Généré le : ${new Date().toLocaleDateString('fr-CA')}`, margin, 30);

  y = 55;

  doc.setTextColor(0, 0, 0);
  addWrappedText(`Titre : ${plan.title}`, 16, "bold");
  addWrappedText(`Enseignant : ${plan.teacherName}`, 12, "normal");
  addWrappedText(`Session : ${plan.session || "N/A"}`, 12, "normal");
  
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  if (plan.answers && plan.answers.length > 0) {
    plan.answers.forEach((item, index) => {
      checkPageBreak(20);
      addWrappedText(`Question ${index + 1} : ${item.questionText}`, 12, "bold", [30, 41, 59]);
      
      const reponse = item.answerText || "Aucune réponse fournie.";
      addWrappedText(reponse, 11, "normal", [55, 65, 81]);
      
      y += 8;
    });
  } else {
    addWrappedText("Aucun contenu disponible.", 12, "italic");
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Page ${i} / ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: "right" });
    doc.text("Généré par Classroom App", margin, pageHeight - 10);
  }
  
  const pdfBlob = doc.output('blob');

  const safeName = (plan.teacherName || "prof").replace(/[^a-z0-9]/gi, '_');
  const safeTitle = (plan.title || "plan").replace(/[^a-z0-9]/gi, '_').substring(0, 20);
  const fileName = `${safeName}_${safeTitle}_${Date.now()}.pdf`;

  const storageRef = ref(storage, `plans_pdf/${fileName}`);
  await uploadBytes(storageRef, pdfBlob);
  
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}