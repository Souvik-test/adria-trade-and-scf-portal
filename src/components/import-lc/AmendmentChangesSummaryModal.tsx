
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ImportLCFormData } from '@/types/importLC';

interface AmendmentChangesSummaryModalProps {
  open: boolean;
  onClose: () => void;
  changes: Record<string, { original: any; current: any }>;
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
}

const AmendmentChangesSummaryModal: React.FC<AmendmentChangesSummaryModalProps> = ({
  open,
  onClose,
  changes,
  formData,
  originalData
}) => {
  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'Not set';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-amber-700 dark:text-amber-300">
            Amendment Changes Summary
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Review all changes before submitting the amendment request
          </p>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {Object.keys(changes).length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No changes detected
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(changes).map(([fieldName, change]) => (
                  <div key={fieldName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-3">
                      {formatFieldName(fieldName)}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          Original Value:
                        </span>
                        <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 line-through">
                          {formatValue(change.original)}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          New Value:
                        </span>
                        <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-300 font-semibold">
                          {formatValue(change.current)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={onClose}
          >
            Continue Amendment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmendmentChangesSummaryModal;
