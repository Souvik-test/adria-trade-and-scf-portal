
import React from "react";
import { Button } from "@/components/ui/button";

interface ReviewPreAdvicedLCHeaderProps {
  lcReference: string;
  issueDate: string;
  expiryDate: string;
  amount: number;
  currency: string;
  onBack?: () => void;
}

const ReviewPreAdvicedLCHeader: React.FC<ReviewPreAdvicedLCHeaderProps> = ({
  lcReference,
  issueDate,
  expiryDate,
  amount,
  currency,
  onBack,
}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
          <span role="img" aria-label="doc">📄</span> Pre-Advised Letter of Credit
        </span>
        <span className="ml-3 px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
          Pending Review
        </span>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
        Review and respond to LC pre-advice
      </p>
    </div>
    <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-end gap-2">
      <div className="flex items-end gap-1">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">LC Reference</div>
          <div className="font-medium tracking-wide">{lcReference}</div>
        </div>
      </div>
      <div className="flex gap-4 ml-0 md:ml-8">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Issue Date</div>
          <div className="font-medium">{issueDate}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Expiry Date</div>
          <div className="font-medium">{expiryDate}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Amount</div>
          <div className="font-bold text-green-600 dark:text-green-300">
            {currency} {amount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReviewPreAdvicedLCHeader;
