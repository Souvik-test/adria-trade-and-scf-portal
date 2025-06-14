
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import POPIForm from './POPIForm';
import POPIModalHeader from './popi-modal/POPIModalHeader';
import ActionSection from './popi-modal/ActionSection';
import MethodSection from './popi-modal/MethodSection';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface POPIModalProps {
  onClose: () => void;
  onBack: () => void;
}

type ActionType = 'create' | 'amend' | 'cancel' | null;

const POPIModal: React.FC<POPIModalProps> = ({ onClose, onBack }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [showForm, setShowForm] = useState(false);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual' && selectedAction === 'create') {
      setShowForm(true);
    } else {
      console.log(`Opening ${method} for ${selectedAction} action`);
    }
  };

  const handleFormBack = () => {
    setShowForm(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        {/* Modal header with dynamic back or default header */}
        {showForm ? (
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <Button 
              variant="ghost"
              className="p-2"
              onClick={handleFormBack}
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {selectedAction === 'create' ? 'Create Purchase Order / Proforma Invoice' : 'POPI Form'}
            </span>
          </div>
        ) : (
          <POPIModalHeader onBack={onBack} />
        )}

        <div className="flex-1 overflow-auto p-6">
          {showForm ? (
            <POPIForm />
          ) : (
            <div className="space-y-8">
              <ActionSection
                selectedAction={selectedAction}
                onActionSelect={handleActionSelect}
              />

              <MethodSection
                selectedAction={selectedAction}
                onMethodSelect={handleMethodSelect}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POPIModal;

