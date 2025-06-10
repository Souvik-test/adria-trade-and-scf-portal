
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Upload, MessageSquare, Plus, Edit, X } from 'lucide-react';

interface POPIModalProps {
  onClose: () => void;
  onBack: () => void;
}

type ActionType = 'create' | 'amend' | 'cancel' | null;

const POPIModal: React.FC<POPIModalProps> = ({ onClose, onBack }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual' && selectedAction) {
      console.log(`Opening manual form for ${selectedAction} action`);
      // TODO: Implement form navigation based on selectedAction
    }
  };

  const actionCards = [
    {
      id: 'create',
      title: 'Create Purchase Order/Pro-forma Invoice',
      description: 'Create new purchase orders and pro-forma invoices',
      icon: Plus,
      color: 'corporate-teal'
    },
    {
      id: 'amend',
      title: 'Amend Purchase Order/Pro-forma Invoice',
      description: 'Modify existing purchase orders and pro-forma invoices',
      icon: Edit,
      color: 'amber'
    },
    {
      id: 'cancel',
      title: 'Cancel Purchase Order/Pro-forma Invoice',
      description: 'Cancel purchase orders and pro-forma invoices',
      icon: X,
      color: 'red'
    }
  ];

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
                Purchase Order/Pro-forma Invoice Management
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                PO/PI Management Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

export default POPIModal;
