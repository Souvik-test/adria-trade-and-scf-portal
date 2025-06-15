
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ChangeItem {
  field: string;
  previous: string;
  updated: string;
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Amendment Changes Summary</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                <th className="text-left px-4 py-2">Field</th>
                <th className="text-left px-4 py-2">Previous Value</th>
                <th className="text-left px-4 py-2">New Value</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((change, idx) => (
                <tr key={change.field} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-200">{change.field}</td>
                  <td className="px-4 py-2 text-red-600 line-through dark:text-red-400">{change.previous}</td>
                  <td className="px-4 py-2 text-green-700 font-semibold dark:text-green-300">{change.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2 rounded bg-corporate-blue text-white font-semibold">
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default AmendmentChangesSummaryModal;
