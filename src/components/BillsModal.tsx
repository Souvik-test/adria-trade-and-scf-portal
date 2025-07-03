
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Search, DollarSign, Upload, MessageSquare, CheckCircle, CreditCard } from 'lucide-react';
import ManualBillsForm from './ManualBillsForm';
import ResolveDiscrepanciesForm from './ResolveDiscrepanciesForm';
import RequestFinanceForm from './RequestFinanceForm';
import ImportLCBillAcceptRefuseForm from './import-lc/ImportLCBillAcceptRefuseForm';
import ImportLCBillSettlementForm from './import-lc/ImportLCBillSettlementForm';

interface BillsModalProps {
  onClose: () => void;
  onBack: () => void;
  type: 'import' | 'export';
}

type ActionType = 'present-bills' | 'resolve-discrepancies' | 'request-finance' | 'accept-refuse' | 'process-bill-settlement' | null;

const BillsModal: React.FC<BillsModalProps> = ({ onClose, onBack, type }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [showManualBillsForm, setShowManualBillsForm] = useState(false);
  const [showResolveDiscrepanciesForm, setShowResolveDiscrepanciesForm] = useState(false);
  const [showRequestFinanceForm, setShowRequestFinanceForm] = useState(false);
  const [showAcceptRefuseForm, setShowAcceptRefuseForm] = useState(false);
  const [showSettlementForm, setShowSettlementForm] = useState(false);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual' && selectedAction) {
      switch (selectedAction) {
        case 'present-bills':
          setShowManualBillsForm(true);
          break;
        case 'resolve-discrepancies':
          setShowResolveDiscrepanciesForm(true);
          break;
        case 'request-finance':
          setShowRequestFinanceForm(true);
          break;
        case 'accept-refuse':
          setShowAcceptRefuseForm(true);
          break;
        case 'process-bill-settlement':
          setShowSettlementForm(true);
          break;
      }
    }
  };

  const handleBackToBills = () => {
    setShowRequestFinanceForm(false);
    setShowResolveDiscrepanciesForm(false);
    setShowManualBillsForm(false);
    setShowAcceptRefuseForm(false);
    setShowSettlementForm(false);
    setSelectedAction(null);
  };

  if (showManualBillsForm) {
    return (
      <ManualBillsForm
        onClose={onClose}
        onBack={() => setShowManualBillsForm(false)}
      />
    );
  }

  if (showResolveDiscrepanciesForm) {
    return (
      <ResolveDiscrepanciesForm
        onClose={onClose}
        onBack={() => setShowResolveDiscrepanciesForm(false)}
        isFullScreen={true}
      />
    );
  }

  if (showRequestFinanceForm) {
    return (
      <RequestFinanceForm
        onClose={onClose}
        onBack={handleBackToBills}
      />
    );
  }

  if (showAcceptRefuseForm) {
    return (
      <ImportLCBillAcceptRefuseForm
        onClose={onClose}
        onBack={handleBackToBills}
      />
    );
  }

  if (showSettlementForm) {
    return (
      <ImportLCBillSettlementForm
        onClose={onClose}
        onBack={handleBackToBills}
      />
    );
  }

  // Get action cards based on LC type
  const getActionCards = () => {
    if (type === 'import') {
      return [
        {
          id: 'accept-refuse',
          title: 'Accept/Refuse',
          description: 'Accept or refuse bills under Import LC',
          icon: CheckCircle,
          color: 'corporate-teal'
        },
        {
          id: 'process-bill-settlement',
          title: 'Process Bill Settlement',
          description: 'Process settlement for Import LC bills',
          icon: CreditCard,
          color: 'amber'
        }
      ];
    } else {
      return [
        {
          id: 'present-bills',
          title: 'Present Bills',
          description: 'Submit bills for presentation under Export LC',
          icon: FileText,
          color: 'corporate-teal'
        },
        {
          id: 'resolve-discrepancies',
          title: 'Resolve Discrepancies',
          description: 'Address discrepancies in Export LC documents',
          icon: Search,
          color: 'amber'
        },
        {
          id: 'request-finance',
          title: 'Request Finance',
          description: 'Apply for trade finance facilities',
          icon: DollarSign,
          color: 'green'
        }
      ];
    }
  };

  const actionCards = getActionCards();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                {type === 'export' ? 'Export' : 'Import'} LC Bills
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Bills under {type === 'export' ? 'Export' : 'Import'} LC
              </h2>
              
              <div className={`grid grid-cols-1 ${type === 'export' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
                {actionCards.map((card) => (
                  <Card 
                    key={card.id}
                    className={`border transition-colors cursor-pointer ${
                      selectedAction === card.id
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                        : `border-gray-200 dark:border-gray-600 hover:border-${card.color}-300 dark:hover:border-${card.color}-400`
                    }`}
                    onClick={() => handleActionSelect(card.id as ActionType)}
                  >
                    <CardHeader className="text-center">
                      <div className={`mx-auto w-16 h-16 bg-${card.color}-100 dark:bg-${card.color}-900 rounded-full flex items-center justify-center mb-4`}>
                        <card.icon className={`w-8 h-8 text-${card.color}-600 dark:text-${card.color}-400`} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                Processing Methods
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card 
                  className={`border transition-colors ${
                    selectedAction 
                      ? 'border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 cursor-pointer'
                      : 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => selectedAction && handleMethodSelect('manual')}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      selectedAction 
                        ? 'bg-corporate-teal-100 dark:bg-corporate-teal-900'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <FileText className={`w-8 h-8 ${
                        selectedAction 
                          ? 'text-corporate-teal-600 dark:text-corporate-teal-400'
                          : 'text-gray-400'
                      }`} />
                    </div>
                    <CardTitle className={`text-lg font-semibold ${
                      selectedAction 
                        ? 'text-gray-800 dark:text-white'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      Manual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className={`text-sm ${
                      selectedAction 
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {selectedAction 
                        ? 'Enter details manually through forms'
                        : 'Select an action above to enable methods'
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className={`border transition-colors ${
                  selectedAction 
                    ? 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer opacity-50'
                    : 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                }`}>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-500 dark:text-gray-500">
                      Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      {selectedAction 
                        ? 'Upload documents and auto-extract data'
                        : 'Select an action above to enable methods'
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className={`border transition-colors ${
                  selectedAction 
                    ? 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer opacity-50'
                    : 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                }`}>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-500 dark:text-gray-500">
                      Contextual Assistance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      {selectedAction 
                        ? 'Use AI-powered interactive assistant'
                        : 'Select an action above to enable methods'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillsModal;
