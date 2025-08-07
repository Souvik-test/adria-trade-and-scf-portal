import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InwardDocumentaryCollectionModalHeaderProps {
  onBack: () => void;
}

const InwardDocumentaryCollectionModalHeader: React.FC<InwardDocumentaryCollectionModalHeaderProps> = ({
  onBack
}) => {
  return (
    <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              Inward Documentary Collection
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage inward documentary collection bills and processes
            </p>
          </div>
        </div>
      </div>
    </DialogHeader>
  );
};

export default InwardDocumentaryCollectionModalHeader;