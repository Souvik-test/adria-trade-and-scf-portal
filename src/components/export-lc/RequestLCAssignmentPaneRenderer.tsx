
import React from "react";
import LCAndAssignmentPane from "./steps/LCAndAssignmentPane";
import AssigneeAndDocumentsPane from "./steps/AssigneeAndDocumentsPane";
import { LCAssignmentFormStep } from "@/types/exportLCAssignment";

interface Props {
  step: LCAssignmentFormStep;
  form: any;
}

const RequestLCAssignmentPaneRenderer: React.FC<Props> = ({ step, form }) => {
  switch (step) {
    case "lc-and-assignment":
      return <LCAndAssignmentPane form={form} />;
    case "assignee-docs":
      return <AssigneeAndDocumentsPane form={form} />;
    default:
      return <div>Unknown step</div>;
  }
};

export default RequestLCAssignmentPaneRenderer;
