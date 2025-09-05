import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import ShippingGuaranteeActionSection from './ShippingGuaranteeActionSection';
import ShippingGuaranteeMethodSection from './ShippingGuaranteeMethodSection';
import ShippingGuaranteeForm from './ShippingGuaranteeForm';
import { ShippingGuaranteeActionType } from '@/types/shippingGuarantee';

interface ShippingGuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const ShippingGuaranteeModal: React.FC<ShippingGuaranteeModalProps> = ({
  isOpen,
  onClose,
  onBack
}) => {
  const [selectedAction, setSelectedAction] = useState<ShippingGuaranteeActionType>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleActionSelect = (action: ShippingGuaranteeActionType) => {
    setSelectedAction(action);
    setSelectedMethod(null);
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleBack = () => {
    if (selectedMethod) {
      setSelectedMethod(null);
    } else if (selectedAction) {
      setSelectedAction(null);
    } else {
      onBack();
    }
  };

  const renderContent = () => {
    if (selectedMethod && selectedAction) {
      return (
        <ShippingGuaranteeForm
          action={selectedAction}
          method={selectedMethod}
          onBack={handleBack}
          onClose={onClose}
        />
      );
    }

    if (selectedAction) {
      return (
        <ShippingGuaranteeMethodSection
          selectedAction={selectedAction}
          onMethodSelect={handleMethodSelect}
        />
      );
    }

    return (
      <ShippingGuaranteeActionSection
        selectedAction={selectedAction}
        onActionSelect={handleActionSelect}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 m-0 rounded-none">
        <div className="flex flex-col h-full">
          <div className="border-b border-border px-6 py-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="text-xl font-semibold text-foreground">
                Shipping Guarantee Management
              </h1>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingGuaranteeModal;