
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, FileText, Search, DollarSign } from 'lucide-react';
import ManualBillsForm from './ManualBillsForm';
import ResolveDiscrepanciesForm from './ResolveDiscrepanciesForm';
import RequestFinanceForm from './RequestFinanceForm';

interface BillsModalProps {
  onClose: () => void;
  onBack: () => void;
}

const BillsModal: React.FC<BillsModalProps> = ({ onClose, onBack }) => {
  const [currentView, setCurrentView] = useState<'main' | 'request-finance'>('main');
  const [showManualBillsForm, setShowManualBillsForm] = useState(false);
  const [showResolveDiscrepanciesForm, setShowResolveDiscrepanciesForm] = useState(false);
  const [showRequestFinanceForm, setShowRequestFinanceForm] = useState(false);

  const handleRequestFinance = () => {
    setCurrentView('request-finance');
  };

  const handleRequestFinanceManual = () => {
    setShowRequestFinanceForm(true);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleBackToBills = () => {
    setShowRequestFinanceForm(false);
    setCurrentView('main');
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

  const renderRequestFinanceView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackToMain}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Request Finance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-corporate-teal-600 dark:text-corporate-teal-400">
              <Plus className="w-6 h-6" />
              Manual Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manually enter bill details for finance request
            </p>
            <Button 
              onClick={handleRequestFinanceManual}
              className="w-full bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
            >
              Start Manual Entry
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 transition-colors cursor-pointer opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-500 dark:text-gray-500">
              <FileText className="w-6 h-6" />
              Upload from File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              Upload bill details from Excel/CSV file
            </p>
            <Button 
              disabled
              className="w-full"
              variant="outline"
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMainView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-corporate-teal-600 dark:text-corporate-teal-400">
              <Plus className="w-6 h-6" />
              Create New Bill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Submit new export LC bills for processing
            </p>
            <Button 
              onClick={() => setShowManualBillsForm(true)}
              className="w-full bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
            >
              Start New Submission
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <Search className="w-6 h-6" />
              Resolve Discrepancies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Address and resolve bill discrepancies
            </p>
            <Button 
              onClick={() => setShowResolveDiscrepanciesForm(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              View Discrepancies
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-600 hover:border-corporate-teal-300 dark:hover:border-corporate-teal-400 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <DollarSign className="w-6 h-6" />
              Request Finance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Request financing against submitted bills
            </p>
            <Button 
              onClick={handleRequestFinance}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Request Finance
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Bills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No bills found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start by creating your first bill submission
            </p>
          </div>
        </CardContent>
      </Card>
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
                {currentView === 'request-finance' ? 'Request Finance' : 'Bills under Export LC'}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6">
          {currentView === 'request-finance' ? renderRequestFinanceView() : renderMainView()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillsModal;
