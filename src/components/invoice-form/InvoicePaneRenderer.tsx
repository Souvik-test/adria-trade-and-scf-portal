
import React from 'react';
import { InvoiceFormData, InvoiceFormStep } from '@/hooks/useInvoiceForm';
import InvoiceGeneralDetailsPane from './InvoiceGeneralDetailsPane';
import InvoiceLineItemsPane from './InvoiceLineItemsPane';
import InvoiceSummaryPane from './InvoiceSummaryPane';

interface InvoicePaneRendererProps {
  currentStep: InvoiceFormStep;
  formData: InvoiceFormData;
  updateField: (field: keyof InvoiceFormData, value: any) => void;
  searchPurchaseOrder: (poNumber: string) => void;
  addLineItem: () => void;
  updateLineItem: (id: string, updates: Partial<InvoiceFormData['lineItems'][0]>) => void;
  removeLineItem: (id: string) => void;
}

const InvoicePaneRenderer: React.FC<InvoicePaneRendererProps> = ({
  currentStep,
  formData,
  updateField,
  searchPurchaseOrder,
  addLineItem,
  updateLineItem,
  removeLineItem
}) => {
  switch (currentStep) {
    case 'general':
      return (
        <InvoiceGeneralDetailsPane
          formData={formData}
          updateField={updateField}
          searchPurchaseOrder={searchPurchaseOrder}
        />
      );
    
    case 'items':
      return (
        <InvoiceLineItemsPane
          formData={formData}
          addLineItem={addLineItem}
          updateLineItem={updateLineItem}
          removeLineItem={removeLineItem}
        />
      );
    
    case 'summary':
      return (
        <InvoiceSummaryPane
          formData={formData}
          updateField={updateField}
        />
      );
    
    default:
      return null;
  }
};

export default InvoicePaneRenderer;
