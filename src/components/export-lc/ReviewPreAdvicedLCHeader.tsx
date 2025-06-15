
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ReviewPreAdvicedLCHeaderProps {
  lcReference: string;
  setLcReference: (value: string) => void;
  onLcSearch: () => void;
  issueDate: string;
  expiryDate: string;
  amount: number;
  currency: string;
  onBack?: () => void;
}

const ReviewPreAdvicedLCHeader: React.FC<ReviewPreAdvicedLCHeaderProps> = ({
  lcReference,
  setLcReference,
  onLcSearch,
  issueDate,
  expiryDate,
  amount,
  currency,
  onBack,
}) => (
  <div className="flex flex-col px-6 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
    {/* Top row: Title and status */}
    <div className="flex flex-col md:flex-row md:items-center justify-between">
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
      {/* Optionally the onBack button could go here if you like */}
    </div>
    {/* Second row: LC Reference, Issue Date, Expiry Date, Amount */}
    <div className="flex flex-col md:flex-row gap-4 md:items-end mt-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
        {/* LC Reference */}
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">LC Reference</div>
          <div className="flex items-center">
            <Input
              value={lcReference}
              onChange={(e) => setLcReference(e.target.value)}
              placeholder="Enter LC Reference"
              className="w-[220px] pr-10"
              aria-label="LC Reference"
            />
            <Button
              type="button"
              onClick={onLcSearch}
              variant="ghost"
              size="icon"
              className="ml-1"
              aria-label="Search LC Reference"
            >
              <Search className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>
        {/* Issue Date */}
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Issue Date</div>
          <div className="font-medium">{issueDate}</div>
        </div>
        {/* Expiry Date */}
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expiry Date</div>
          <div className="font-medium">{expiryDate}</div>
        </div>
        {/* Amount */}
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</div>
          <div className="font-bold text-green-600 dark:text-green-300">
            {currency} {amount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReviewPreAdvicedLCHeader;
