import React from 'react';
import { ImportLCFormData } from '@/types/importLC';
import PartyDetailsGrid from './PartyDetailsGrid';

interface PartyDetailsPaneProps {
  formData: ImportLCFormData;
  updateField?: (field: keyof ImportLCFormData, value: any) => void;
  readOnly?: boolean;
}

const PartyDetailsPane: React.FC<PartyDetailsPaneProps> = ({
  formData,
  updateField,
  readOnly = false
}) => {
  const handleUpdateParties = (parties: any) => {
    if (!readOnly && updateField) {
      updateField('parties', parties);
    }
  };

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 pr-2">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Party Details</h3>
        <PartyDetailsGrid
          parties={formData.parties}
          onUpdateParties={handleUpdateParties}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default PartyDetailsPane;
