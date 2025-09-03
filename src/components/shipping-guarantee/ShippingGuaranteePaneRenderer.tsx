import React from 'react';
import { ShippingGuaranteeFormData, ShippingGuaranteeActionType } from '@/types/shippingGuarantee';
import BasicInformationPane from './panes/BasicInformationPane';
import PartyDetailsPane from './panes/PartyDetailsPane';
import ShippingDetailsPane from './panes/ShippingDetailsPane';
import GuaranteeTermsPane from './panes/GuaranteeTermsPane';
import SupportingDocumentsPane from './panes/SupportingDocumentsPane';
import ReviewSubmitPane from './panes/ReviewSubmitPane';

interface ShippingGuaranteePaneRendererProps {
  currentPane: number;
  formData: ShippingGuaranteeFormData;
  onFieldChange: (field: string, value: any) => void;
  action: ShippingGuaranteeActionType;
}

const ShippingGuaranteePaneRenderer: React.FC<ShippingGuaranteePaneRendererProps> = ({
  currentPane,
  formData,
  onFieldChange,
  action
}) => {
  switch (currentPane) {
    case 0:
      return <BasicInformationPane formData={formData} onFieldChange={onFieldChange} action={action} />;
    case 1:
      return <PartyDetailsPane formData={formData} onFieldChange={onFieldChange} action={action} />;
    case 2:
      return <ShippingDetailsPane formData={formData} onFieldChange={onFieldChange} action={action} />;
    case 3:
      return <GuaranteeTermsPane formData={formData} onFieldChange={onFieldChange} action={action} />;
    case 4:
      return <SupportingDocumentsPane formData={formData} onFieldChange={onFieldChange} />;
    case 5:
      return <ReviewSubmitPane formData={formData} onFieldChange={onFieldChange} />;
    default:
      return <BasicInformationPane formData={formData} onFieldChange={onFieldChange} action={action} />;
  }
};

export default ShippingGuaranteePaneRenderer;