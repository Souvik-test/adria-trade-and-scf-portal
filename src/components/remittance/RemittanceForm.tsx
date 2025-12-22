import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, History } from 'lucide-react';
import TransferFormSection from './TransferFormSection';
import TransferHistorySection from './TransferHistorySection';

interface RemittanceFormProps {
  onBack: () => void;
}

const RemittanceForm: React.FC<RemittanceFormProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('new-transfer');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="new-transfer" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Transfer
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Transfer History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-transfer" className="mt-0">
          <TransferFormSection />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <TransferHistorySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RemittanceForm;
