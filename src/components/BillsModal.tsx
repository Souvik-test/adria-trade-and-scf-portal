
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, FileText, Upload, Bot, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import ManualBillsForm from './ManualBillsForm';

interface BillsModalProps {
  onClose: () => void;
}

const BillsModal: React.FC<BillsModalProps> = ({ onClose }) => {
  const [hoveredBillType, setHoveredBillType] = useState<string | null>(null);
  const [selectedExportOption, setSelectedExportOption] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const billTypes = [
    { id: 'import', label: 'Bills under Import LC', description: 'Process import letter of credit bills' },
    { id: 'export', label: 'Bills under Export LC', description: 'Handle export letter of credit bills' }
  ];

  const exportOptions = [
    {
      id: 'present',
      title: 'Present Bills',
      icon: FileText,
      description: 'Submit bills for presentation',
      activeMethods: ['manual', 'upload']
    },
    {
      id: 'discrepancies',
      title: 'Resolve Discrepancies',
      icon: AlertCircle,
      description: 'Address and resolve bill discrepancies',
      activeMethods: ['manual']
    },
    {
      id: 'finance',
      title: 'Request Finance',
      icon: CheckCircle,
      description: 'Apply for trade finance facilities',
      activeMethods: ['manual', 'upload']
    }
  ];

  const methods = [
    {
      id: 'manual',
      title: 'Manual',
      icon: FileText,
      description: 'Enter details manually through forms'
    },
    {
      id: 'upload',
      title: 'Upload',
      icon: Upload,
      description: 'Upload documents and auto-extract data'
    },
    {
      id: 'interactive',
      title: 'Interactive Agent',
      icon: Bot,
      description: 'Use AI-powered interactive assistant'
    }
  ];

  const handleBillTypeClick = (billType: string) => {
    if (billType === 'export') {
      setSelectedExportOption('export');
    }
  };

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const handleMethodClick = (methodId: string, cardId: string) => {
    if (isMethodActive(methodId, cardId)) {
      setSelectedMethod(methodId);
      if (methodId === 'manual' && cardId === 'present') {
        setShowManualForm(true);
      }
    }
  };

  const isMethodActive = (methodId: string, optionId: string) => {
    const option = exportOptions.find(opt => opt.id === optionId);
    return option?.activeMethods.includes(methodId) || false;
  };

  if (showManualForm) {
    return <ManualBillsForm onClose={onClose} onBack={() => setShowManualForm(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">LC Bills Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {!selectedExportOption ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Select Bill Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {billTypes.map((billType) => (
                  <Card 
                    key={billType.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-corporate-blue"
                    onMouseEnter={() => setHoveredBillType(billType.id)}
                    onMouseLeave={() => setHoveredBillType(null)}
                    onClick={() => handleBillTypeClick(billType.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <FileText className={`w-12 h-12 mx-auto mb-3 ${
                        hoveredBillType === billType.id ? 'text-corporate-blue' : 'text-gray-400'
                      } transition-colors`} />
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {billType.label}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {billType.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedExportOption(null)}
                  className="text-corporate-blue hover:bg-corporate-blue/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Bills under Export LC
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {exportOptions.map((option) => (
                  <Card 
                    key={option.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedCard === option.id 
                        ? 'ring-2 ring-corporate-blue bg-corporate-blue/5' 
                        : 'hover:shadow-lg hover:border-corporate-blue/50'
                    }`}
                    onClick={() => handleCardClick(option.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <option.icon className={`w-6 h-6 ${
                          selectedCard === option.id ? 'text-corporate-blue' : 'text-gray-600'
                        }`} />
                        {option.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Processing Methods
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {methods.map((method) => {
                    const isActive = selectedCard && isMethodActive(method.id, selectedCard);
                    return (
                      <Card 
                        key={method.id} 
                        className={`transition-all duration-200 ${
                          isActive
                            ? 'hover:shadow-lg cursor-pointer border-corporate-blue/30 hover:bg-corporate-blue/5' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => selectedCard && handleMethodClick(method.id, selectedCard)}
                      >
                        <CardContent className="p-6 text-center">
                          <method.icon className={`w-10 h-10 mx-auto mb-3 ${
                            isActive ? 'text-corporate-blue' : 'text-gray-400'
                          }`} />
                          <h5 className="font-semibold text-gray-800 dark:text-white mb-2">
                            {method.title}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {method.description}
                          </p>
                          {selectedCard && isActive && (
                            <div className="mt-3 text-xs text-corporate-blue font-medium">
                              Available for: {exportOptions
                                .filter(opt => opt.id === selectedCard && isMethodActive(method.id, opt.id))
                                .map(opt => opt.title)
                                .join(', ')}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillsModal;
