
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, MessageSquare } from 'lucide-react';

interface LetterOfCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'import' | 'export';
}

const LetterOfCreditModal: React.FC<LetterOfCreditModalProps> = ({ isOpen, onClose, type }) => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const requestOptions = [
    { id: 'issuance', label: 'Request Issuance' },
    { id: 'amendment', label: 'Request Amendment' },
    { id: 'cancellation', label: 'Request Cancellation' }
  ];

  const methodOptions = [
    { id: 'manual', label: 'Manual', icon: FileText, description: 'Enter details manually' },
    { id: 'upload', label: 'Upload', icon: Upload, description: 'Upload documents' },
    { id: 'contextual', label: 'Contextual Assistance', icon: MessageSquare, description: 'AI-powered assistance' }
  ];

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequest(requestId);
  };

  const handleMethodSelect = (methodId: string) => {
    if (!selectedRequest) return;
    console.log('Selected request:', selectedRequest, 'Method:', methodId);
    // Handle the selection logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            {type === 'import' ? 'Import' : 'Export'} Letter of Credit
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {/* Request Options */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
              Select Request Type
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {requestOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedRequest === option.id
                      ? 'ring-2 ring-corporate-blue bg-corporate-blue/5 dark:bg-corporate-blue/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleRequestSelect(option.id)}
                >
                  <CardContent className="p-4 text-center">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {option.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Method Options */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
              Select Method
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {methodOptions.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedRequest
                      ? 'hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700'
                      : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <CardContent className="p-6 text-center">
                    <method.icon className={`w-8 h-8 mx-auto mb-3 ${
                      selectedRequest ? 'text-corporate-blue' : 'text-gray-400'
                    }`} />
                    <h4 className={`font-medium mb-2 ${
                      selectedRequest ? 'text-gray-800 dark:text-white' : 'text-gray-400'
                    }`}>
                      {method.label}
                    </h4>
                    <p className={`text-sm ${
                      selectedRequest ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'
                    }`}>
                      {method.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {!selectedRequest && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please select a request type to enable method selection
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LetterOfCreditModal;
