
import React from 'react';
import GuaranteeInformationPane from './panes/GuaranteeInformationPane';
import PartyDetailsPane from './panes/PartyDetailsPane';
import AmountTermsPane from './panes/AmountTermsPane';
import ConditionsClausesPane from './panes/ConditionsClausesPane';
import DocumentsRequiredPane from './panes/DocumentsRequiredPane';
import SupportingDocumentsPane from './panes/SupportingDocumentsPane';
import ReviewSubmitPane from './panes/ReviewSubmitPane';
import { OutwardBGFormData } from '@/types/outwardBankGuarantee';

interface OutwardBGPaneRendererProps {
  currentPane: number;
  formData: OutwardBGFormData;
  onFieldChange: (field: string, value: any) => void;
  isAmendment?: boolean;
}

const OutwardBGPaneRenderer: React.FC<OutwardBGPaneRendererProps> = ({
  currentPane,
  formData,
  onFieldChange,
  isAmendment = false
}) => {
  switch (currentPane) {
    case 0:
      return <GuaranteeInformationPane formData={formData} onFieldChange={onFieldChange} isAmendment={isAmendment} />;
    case 1:
      return <PartyDetailsPane formData={formData} onFieldChange={onFieldChange} />;
    case 2:
      return <AmountTermsPane formData={formData} onFieldChange={onFieldChange} isAmendment={isAmendment} />;
    case 3:
      return <ConditionsClausesPane formData={formData} onFieldChange={onFieldChange} isAmendment={isAmendment} />;
    case 4:
      return <DocumentsRequiredPane formData={formData} onFieldChange={onFieldChange} isAmendment={isAmendment} />;
    case 5:
      return <SupportingDocumentsPane formData={formData} onFieldChange={onFieldChange} />;
    case 6:
      return <ReviewSubmitPane formData={formData} onFieldChange={onFieldChange} />;
    default:
      return <GuaranteeInformationPane formData={formData} onFieldChange={onFieldChange} isAmendment={isAmendment} />;
  }
};

export default OutwardBGPaneRenderer;
