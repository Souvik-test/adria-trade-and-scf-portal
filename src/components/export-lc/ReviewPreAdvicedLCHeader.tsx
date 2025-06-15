
import React from "react";
import ReviewPreAdvicedLCTitle from "./ReviewPreAdvicedLCTitle";
import ReviewPreAdvicedLCInfoRow from "./ReviewPreAdvicedLCInfoRow";

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
      <ReviewPreAdvicedLCTitle />
      {/* Optionally the onBack button could go here if you like */}
    </div>
    {/* Second row: info fields row */}
    <ReviewPreAdvicedLCInfoRow
      lcReference={lcReference}
      setLcReference={setLcReference}
      onLcSearch={onLcSearch}
      issueDate={issueDate}
      expiryDate={expiryDate}
      amount={amount}
      currency={currency}
    />
  </div>
);

export default ReviewPreAdvicedLCHeader;
