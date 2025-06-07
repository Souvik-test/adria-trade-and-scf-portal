
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, Bot, ArrowLeft, FileCheck, AlertCircle, DollarSign } from 'lucide-react';

interface BillsModalProps {
  onClose: () => void;
  type: 'import' | 'export';
}

const BillsModal: React.FC<BillsModalProps> = ({ onClose, type }) => {
  const [selectedBillType, setSelectedBillType] = useState<string | null>(null);

  const billTypes = [
    {
      id: 'present',
      title: 'Present Bills',
      description: 'Submit bills for presentation',
      icon: FileText
    },
    {
      id: 'resolve',
      title: 'Resolve Discrepancies',
      description: 'Address and resolve bill discrepancies',
      icon: AlertCircle
    },
    {
      id: 'finance',
      title: 'Request Finance',
      description: 'Apply for trade finance facilities',
      icon: DollarSign
    }
  ];

  const processingMethods = [
    {
      id: 'manual',
      title: 'Manual',
      description: 'Enter details manually through forms',
      icon: FileText
    },
    {
      id: 'upload',
      title: 'Upload',
      description: 'Upload documents and auto-extract data',
      icon: Upload
    },
    {
      id: 'contextual',
      title: 'Contextual Assistance',
      description: 'Use AI-powered interactive assistant',
      icon: Bot
    }
  ];

  const handleBillTypeSelect = (billTypeId: string) => {
    setSelectedBillType(billTypeId);
  };

  const handleMethodSelect = (methodId: string) => {
    if (!selectedBillType) return;
    console.log('Selected bill type:', selectedBillType, 'Method:', methodId, 'Type:', type);
    
    if (selectedBillType === 'present' && methodId === 'manual') {
      // Navigate to manual bills form
      console.log('Opening manual bills form for', type, 'LC bills');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              {type === 'import' ? 'Import' : 'Export'} LC Bills
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {/* Bills under LC Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
              Bills under {type === 'import' ? 'Import' : 'Export'} LC
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {billTypes.map((billType) => (
                <Card
                  key={billType.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedBillType === billType.id
                      ? 'ring-2 ring-corporate-blue bg-corporate-blue/5 dark:bg-corporate-blue/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleBillTypeSelect(billType.id)}
                >
                  <CardContent className="p-4 text-center">
                    <billType.icon className="w-8 h-8 mx-auto mb-3 text-corporate-blue" />
                    <h4 className="font-medium mb-2 text-gray-800 dark:text-white">
                      {billType.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {billType.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Processing Methods Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
              Processing Methods
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {processingMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedBillType
                      ? 'hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700'
                      : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <CardContent className="p-6 text-center">
                    <method.icon className={`w-8 h-8 mx-auto mb-3 ${
                      selectedBillType ? 'text-corporate-blue' : 'text-gray-400'
                    }`} />
                    <h4 className={`font-medium mb-2 ${
                      selectedBillType ? 'text-gray-800 dark:text-white' : 'text-gray-400'
                    }`}>
                      {method.title}
                    </h4>
                    <p className={`text-sm ${
                      selectedBillType ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'
                    }`}>
                      {method.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {!selectedBillType && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please select a bill type to enable method selection
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillsModal;
