
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, Bot, ArrowLeft, FileCheck, AlertCircle, DollarSign } from 'lucide-react';

interface BillsModalProps {
  onClose: () => void;
}

const BillsModal: React.FC<BillsModalProps> = ({ onClose }) => {
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
      id: 'interactive',
      title: 'Interactive Agent',
      description: 'Use AI-powered interactive assistant',
      icon: Bot
    }
  ];

  const handleBillTypeSelect = (billTypeId: string) => {
    setSelectedBillType(billTypeId);
  };

  const handleMethodSelect = (methodId: string) => {
    if (!selectedBillType) return;
    console.log('Selected bill type:', selectedBillType, 'Method:', methodId);
    
    if (selectedBillType === 'present' && methodId === 'manual') {
      // Navigate to manual bills form
      console.log('Opening manual bills form');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-slate-900 border-slate-700">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <DialogTitle className="text-2xl font-bold text-white">
              LC Bills Management
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-8 p-6">
          {/* Bills under Export LC Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
              Bills under Export LC
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {billTypes.map((billType) => (
                <Card
                  key={billType.id}
                  className={`cursor-pointer transition-all duration-200 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 ${
                    selectedBillType === billType.id
                      ? 'ring-2 ring-blue-500 bg-blue-500/10'
                      : ''
                  }`}
                  onClick={() => handleBillTypeSelect(billType.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <billType.icon className="w-8 h-8 text-slate-400" />
                      <h4 className="text-lg font-semibold text-white">
                        {billType.title}
                      </h4>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {billType.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Processing Methods Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">
              Processing Methods
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {processingMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all duration-200 bg-slate-800/30 border-slate-700 ${
                    selectedBillType
                      ? 'hover:bg-slate-700/30 hover:border-slate-600'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <CardContent className="p-8 text-center">
                    <method.icon className={`w-12 h-12 mx-auto mb-4 ${
                      selectedBillType ? 'text-slate-400' : 'text-slate-600'
                    }`} />
                    <h4 className={`text-lg font-semibold mb-3 ${
                      selectedBillType ? 'text-white' : 'text-slate-600'
                    }`}>
                      {method.title}
                    </h4>
                    <p className={`text-sm ${
                      selectedBillType ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {method.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {!selectedBillType && (
            <div className="text-center py-6">
              <p className="text-slate-500">
                Please select a bill type to enable processing method selection
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillsModal;
