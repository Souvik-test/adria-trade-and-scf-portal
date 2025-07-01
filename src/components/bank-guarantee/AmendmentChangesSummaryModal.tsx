
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChangeItem {
  field: string;
  oldValue: string;
  newValue: string;
}

interface AmendmentChangesSummaryModalProps {
  open: boolean;
  onClose: () => void;
  changes: ChangeItem[];
}

const AmendmentChangesSummaryModal: React.FC<AmendmentChangesSummaryModalProps> = ({
  open,
  onClose,
  changes,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-700">
            Amendment Changes Summary
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-end mb-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>

        <ScrollArea className="h-[60vh]">
          {changes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No changes detected yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left px-4 py-3 border border-gray-200 font-semibold text-gray-700 dark:text-gray-300">
                      Field
                    </th>
                    <th className="text-left px-4 py-3 border border-gray-200 font-semibold text-gray-700 dark:text-gray-300">
                      Old Value
                    </th>
                    <th className="text-left px-4 py-3 border border-gray-200 font-semibold text-gray-700 dark:text-gray-300">
                      New Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {changes.map((change, idx) => (
                    <tr 
                      key={`${change.field}-${idx}`} 
                      className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                    >
                      <td className="px-4 py-3 border border-gray-200 font-medium text-gray-900 dark:text-gray-200">
                        {change.field}
                      </td>
                      <td className="px-4 py-3 border border-gray-200 text-red-600 dark:text-red-400">
                        <span className="line-through">
                          {change.oldValue || 'Not set'}
                        </span>
                      </td>
                      <td className="px-4 py-3 border border-gray-200 text-green-700 font-semibold dark:text-green-300">
                        {change.newValue || 'Not set'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AmendmentChangesSummaryModal;
