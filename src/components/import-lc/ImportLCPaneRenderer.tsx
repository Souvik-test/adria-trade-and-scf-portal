
import React from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/types/importLC';
import BasicLCInformationPane from './BasicLCInformationPane';
import PartyDetailsPane from './PartyDetailsPane';
import LCAmountTermsPane from './LCAmountTermsPane';
import ShipmentDetailsPane from './ShipmentDetailsPane';
import DocumentRequirementsPane from './DocumentRequirementsPane';
import LimitDetailsPane from './LimitDetailsPane';
import SanctionDetailsPane from './SanctionDetailsPane';
import AccountingEntriesPane from './AccountingEntriesPane';
import ReleaseDocumentsPane from './ReleaseDocumentsPane';

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
    case 'limits':
      return <LimitDetailsPane formData={formData} />;
    case 'sanctions':
      return <SanctionDetailsPane formData={formData} />;
    case 'accounting':
      return <AccountingEntriesPane formData={formData} />;
    case 'release':
      return <ReleaseDocumentsPane formData={formData} />;
    default:
      return null;
  }
};

export default ImportLCPaneRenderer;
