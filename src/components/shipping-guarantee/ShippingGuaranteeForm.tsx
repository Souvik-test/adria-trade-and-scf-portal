import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShippingGuaranteeFormActions from './ShippingGuaranteeFormActions';
import ShippingGuaranteeProgressIndicator from './ShippingGuaranteeProgressIndicator';
import ShippingGuaranteePaneRenderer from './ShippingGuaranteePaneRenderer';
import { ShippingGuaranteeActionType, ShippingGuaranteeFormData } from '@/types/shippingGuarantee';

interface ShippingGuaranteeFormProps {
  action: ShippingGuaranteeActionType;
  method: string;
  onBack: () => void;
  onClose: () => void;
}

const ShippingGuaranteeForm: React.FC<ShippingGuaranteeFormProps> = ({
  action,
  method,
  onBack,
  onClose
}) => {
  const [currentPane, setCurrentPane] = useState(0);
  const [formData, setFormData] = useState<ShippingGuaranteeFormData>({
    currency: 'USD',
    status: 'draft'
  });

  const panes = [
    'Basic Information',
    'Party Details', 
    'Shipping Details',
    'Guarantee Terms',
    'Supporting Documents',
    'Review & Submit'
  ];

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentPane < panes.length - 1) {
      setCurrentPane(currentPane + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPane > 0) {
      setCurrentPane(currentPane - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting shipping guarantee:', formData);
    // Handle form submission
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    // Handle save as draft
  };

  const handleDiscard = () => {
    onClose();
  };

  const getFormTitle = () => {
    switch (action) {
      case 'create':
        return 'Create Shipping Guarantee';
      case 'update':
        return 'Update Shipping Guarantee';
      case 'link-delink':
        return 'Link/Delink Shipping Guarantee';
      default:
        return 'Shipping Guarantee';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-foreground">
            {getFormTitle()}
          </h2>
        </div>
        
        <ShippingGuaranteeProgressIndicator
          currentPane={currentPane}
          panes={panes}
          onPaneClick={setCurrentPane}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <ShippingGuaranteePaneRenderer
          currentPane={currentPane}
          formData={formData}
          onFieldChange={handleFieldChange}
          action={action}
        />
      </div>

      <ShippingGuaranteeFormActions
        currentPane={currentPane}
        onDiscard={handleDiscard}
        onSaveAsDraft={handleSaveDraft}
        onGoBack={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        canProceed={true}
        isFirstPane={currentPane === 0}
        isLastPane={currentPane === panes.length - 1}
      />
    </div>
  );
};

export default ShippingGuaranteeForm;