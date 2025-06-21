
import React from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/types/importLC';
import ImportLCAmendmentBasicPane from './ImportLCAmendmentBasicPane';
import ImportLCAmendmentPartyPane from './ImportLCAmendmentPartyPane';
import ImportLCAmendmentAmountPane from './ImportLCAmendmentAmountPane';
import ImportLCAmendmentShipmentPane from './ImportLCAmendmentShipmentPane';
import ImportLCAmendmentDocumentsPane from './ImportLCAmendmentDocumentsPane';

interface ImportLCAmendmentPanesProps {
  currentStep: ImportLCFormStep;
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ImportLCAmendmentPanes: React.FC<ImportLCAmendmentPanesProps> = ({
  currentStep,
  formData,
  originalData,
  changes,
  updateField
}) => {
  const commonProps = {
    formData,
    originalData,
    changes,
    updateField
  };

  switch (currentStep) {
    case 'basic':
      return <ImportLCAmendmentBasicPane {...commonProps} />;
    case 'parties':
      return <ImportLCAmendmentPartyPane {...commonProps} />;
    case 'amount':
      return <ImportLCAmendmentAmountPane {...commonProps} />;
    case 'shipment':
      return <ImportLCAmendmentShipmentPane {...commonProps} />;
    case 'documents':
      return <ImportLCAmendmentDocumentsPane {...commonProps} />;
    default:
      return null;
  }
};

export default ImportLCAmendmentPanes;
