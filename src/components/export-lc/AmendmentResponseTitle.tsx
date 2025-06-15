
import React from "react";

interface AmendmentResponseTitleProps {
  title?: string;
  status?: string;
}

const AmendmentResponseTitle: React.FC<AmendmentResponseTitleProps> = ({
  title = "Record Amendment Response",
  status = "Amendment Under Review",
}) => (
  <div>
    <div className="flex items-center gap-3">
      <span className="text-2xl font-semibold text-gray-900 dark:text-white">
        <span role="img" aria-label="amendment">📝</span> {title}
      </span>
      <span className="ml-3 px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
        {status}
      </span>
    </div>
    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
      Review and record your consent for LC amendment.
    </p>
  </div>
);

export default AmendmentResponseTitle;
