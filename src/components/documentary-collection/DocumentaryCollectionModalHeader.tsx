
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';

interface DocumentaryCollectionModalHeaderProps {
  onBack: () => void;
}

const DocumentaryCollectionModalHeader: React.FC<DocumentaryCollectionModalHeaderProps> = ({ onBack }) => {
  return (
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
            Outward Documentary Collection Bills
          </DialogTitle>
        </div>
      </div>
    </DialogHeader>
  );
};

export default DocumentaryCollectionModalHeader;
