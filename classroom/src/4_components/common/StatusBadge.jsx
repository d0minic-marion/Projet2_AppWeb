
import React from "react";
import { PLAN_STATUS, AI_STATUS } from "../../6_utils/constant";

export default function StatusBadge({ type, value }) {
  if (!value) return null;

  let label = value;
  let className = "status-badge";

  if (type === "plan") {
    switch (value) {
      case PLAN_STATUS.DRAFT:
        label = "Brouillon";
        className += " status-draft";
        break;
      case PLAN_STATUS.SUBMITTED:
        label = "Soumis";
        className += " status-submitted";
        break;
      case PLAN_STATUS.APPROVED:
        label = "Approuvé";
        className += " status-approved";
        break;
      case PLAN_STATUS.NEEDS_CHANGES:
        label = "À corriger";
        className += " status-needs-changes";
        break;
      default:
        break;
    }
  } else if (type === "ai") {
    switch (value) {
      case AI_STATUS.CONFORME:
        label = "Conforme";
        className += " status-ai-ok";
        break;
      case AI_STATUS.A_AMELIORER:
        label = "À améliorer";
        className += " status-ai-medium";
        break;
      case AI_STATUS.NON_CONFORME:
        label = "Non conforme";
        className += " status-ai-bad";
        break;
      default:
        break;
    }
  }

  return <span className={className}>{label}</span>;
}
