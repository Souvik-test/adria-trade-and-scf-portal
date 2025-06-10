
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Search, DollarSign, Upload, MessageSquare } from 'lucide-react';
import ManualBillsForm from './ManualBillsForm';
import ResolveDiscrepanciesForm from './ResolveDiscrepanciesForm';
import RequestFinanceForm from './RequestFinanceForm';

interface BillsModalProps {
  onClose: () => void;
  onBack: () => void;
  type: 'import' | 'export';
}

type ActionType = 'present-bills' | 'resolve-discrepancies' | 'request-finance' | null;

const BillsModal: React.FC<BillsModalProps> = ({ onClose, onBack, type }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [showMethodSelection, setShowMethodSelection] = useState(false);
  const [showManualBillsForm, setShowManualBillsForm] = useState(false);
  const [showResolveDiscrepanciesForm, setShowResolveDiscrepanciesForm] = useState(false);
  const [showRequestFinanceForm, setShowRequestFinanceForm] = useState(false);

  const handleActionSelect = (action: ActionType) => {
    setSelectedAction(action);
    setShowMethodSelection(true);
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'manual') {
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
      }
    }
    // Upload and Contextual Assistance methods remain disabled for now
  };

  const handleBackToActions = () => {
    setSelectedAction(null);
    setShowMethodSelection(false);
  };

  const handleBackToBills = () => {
    setShowRequestFinanceForm(false);
    setShowMethodSelection(false);
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

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackToActions}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {selectedAction === 'present-bills' && 'Present Bills'}
          {selectedAction === 'resolve-discrepancies' && 'Resolve Discrepancies'}
          {selectedAction === 'request-finance' && 'Request Finance'}
          {' - Select Processing Method'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="border border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 transition-colors cursor-pointer" 
          onClick={() => handleMethodSelect('manual')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-corporate-teal-100 dark:bg-corporate-teal-900 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-corporate-teal-600 dark:text-corporate-teal-400" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Enter details manually through forms
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors cursor-pointer opacity-50">
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
              Upload documents and auto-extract data
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors cursor-pointer opacity-50">
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
              Use AI-powered interactive assistant
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMainView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Bills under {type === 'export' ? 'Export' : 'Import'} LC
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="border border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 transition-colors cursor-pointer" 
            onClick={() => handleActionSelect('present-bills')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-corporate-teal-100 dark:bg-corporate-teal-900 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-corporate-teal-600 dark:text-corporate-teal-400" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                Present Bills
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Submit bills for presentation
              </p>
            </CardContent>
          </Card>

          <Card 
            className="border border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-400 transition-colors cursor-pointer" 
            onClick={() => handleActionSelect('resolve-discrepancies')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                Resolve Discrepancies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Address and resolve bill discrepancies
              </p>
            </CardContent>
          </Card>

          <Card 
            className="border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-400 transition-colors cursor-pointer" 
            onClick={() => handleActionSelect('request-finance')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                Request Finance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Apply for trade finance facilities
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          Processing Methods
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-500 dark:text-gray-500">
                Manual
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Select an action above to enable methods
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed">
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
                Select an action above to enable methods
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed">
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
                Select an action above to enable methods
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

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
          {showMethodSelection ? renderMethodSelection() : renderMainView()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillsModal;
