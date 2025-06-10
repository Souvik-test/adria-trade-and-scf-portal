
import React from 'react';
import { POPIFormData, POPIFormStep } from '@/hooks/usePOPIForm';
import GeneralDetailsPane from './GeneralDetailsPane';
import ItemDetailsPane from './ItemDetailsPane';
import SummaryPane from './SummaryPane';

interface POPIPaneRendererProps {
  currentStep: POPIFormStep;
  formData: POPIFormData;
  updateField: (field: keyof POPIFormData, value: any) => void;
  addItem: () => void;
  updateItem: (id: string, updates: Partial<POPIFormData['items'][0]>) => void;
  removeItem: (id: string) => void;
}

const POPIPaneRenderer: React.FC<POPIPaneRendererProps> = ({
  currentStep,
  formData,
  updateField,
  addItem,
  updateItem,
  removeItem
}) => {
  switch (currentStep) {
    case 'general':
      return (
        <GeneralDetailsPane
          formData={formData}
          updateField={updateField}
          readOnly={false}
        />
      );
    
    case 'items':
      return (
        <>
          <GeneralDetailsPane
            formData={formData}
            updateField={updateField}
            readOnly={true}
          />
          <ItemDetailsPane
            formData={formData}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        </>
      );
    
    case 'summary':
      return (
        <>
          <GeneralDetailsPane
            formData={formData}
            updateField={updateField}
            readOnly={true}
          />
          <SummaryPane
            formData={formData}
            updateField={updateField}
          />
        </>
      );
    
    default:
      return null;
  }
};

export default POPIPaneRenderer;
