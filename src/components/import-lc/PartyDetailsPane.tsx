
import React from 'react';
import { ImportLCFormData } from '@/hooks/useImportLCForm';
import PartyDetailsGrid from './PartyDetailsGrid';

interface PartyDetailsPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const PartyDetailsPane: React.FC<PartyDetailsPaneProps> = ({ formData, updateField }) => {
  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-6 pr-2">
      <PartyDetailsGrid
        parties={formData.parties}
        onUpdateParties={(parties) => updateField('parties', parties)}
      />
    </div>
  );
};

export default PartyDetailsPane;
