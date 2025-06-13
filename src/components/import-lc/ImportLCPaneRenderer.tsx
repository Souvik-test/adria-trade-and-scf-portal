
import React from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/types/importLC';
import BasicLCInformationPane from './BasicLCInformationPane';
import PartyDetailsPane from './PartyDetailsPane';
import LCAmountTermsPane from './LCAmountTermsPane';
import ShipmentDetailsPane from './ShipmentDetailsPane';
import DocumentRequirementsPane from './DocumentRequirementsPane';

interface ImportLCPaneRendererProps {
  currentStep: ImportLCFormStep;
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ImportLCPaneRenderer: React.FC<ImportLCPaneRendererProps> = ({
  currentStep,
  formData,
  updateField
}) => {
  switch (currentStep) {
    case 'basic':
      return (
        <BasicLCInformationPane
          formData={formData}
          updateField={updateField}
        />
      );
    case 'parties':
      return (
        <PartyDetailsPane
          formData={formData}
          updateField={updateField}
        />
      );
    case 'amount':
      return (
        <LCAmountTermsPane
          formData={formData}
          updateField={updateField}
        />
      );
    case 'shipment':
      return (
        <ShipmentDetailsPane
          formData={formData}
          updateField={updateField}
        />
      );
    case 'documents':
      return (
        <DocumentRequirementsPane
          formData={formData}
          updateField={updateField}
        />
      );
    default:
      return null;
  }
};

export default ImportLCPaneRenderer;
