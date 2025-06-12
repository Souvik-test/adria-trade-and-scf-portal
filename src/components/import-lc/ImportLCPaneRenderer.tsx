
import React from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/hooks/useImportLCForm';
import BasicLCInformationPane from './BasicLCInformationPane';
import ApplicantInformationPane from './ApplicantInformationPane';
import BeneficiaryInformationPane from './BeneficiaryInformationPane';
import LCAmountTermsPane from './LCAmountTermsPane';
import ShipmentDetailsPane from './ShipmentDetailsPane';
import DocumentRequirementsPane from './DocumentRequirementsPane';
import MT700PreviewPane from './MT700PreviewPane';

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
    case 'applicant':
      return (
        <ApplicantInformationPane
          formData={formData}
          updateField={updateField}
        />
      );
    case 'beneficiary':
      return (
        <BeneficiaryInformationPane
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
    case 'preview':
      return (
        <MT700PreviewPane
          formData={formData}
        />
      );
    default:
      return null;
  }
};

export default ImportLCPaneRenderer;
