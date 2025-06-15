
import React from "react";

interface ReviewPreAdvicedLCTitleProps {
  title?: string;
  status?: string;
}

const ReviewPreAdvicedLCTitle: React.FC<ReviewPreAdvicedLCTitleProps> = ({
  title = "Pre-Advised Letter of Credit",
  status = "Pending Review",
}) => (
  <div>
    <div className="flex items-center gap-3">
      <span className="text-2xl font-semibold text-gray-900 dark:text-white">
        <span role="img" aria-label="doc">📄</span> {title}
      </span>
      <span className="ml-3 px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
        {status}
      </span>
    </div>
    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
      Review and respond to LC pre-advice
    </p>
  </div>
);

export default ReviewPreAdvicedLCTitle;
