
import React from "react";

interface LCAmount {
  creditAmount: string;
  tolerance: string;
  availableWith: string;
  availableBy: string;
}
interface LCAmtPaneProps {
  expanded: boolean;
  togglePane: () => void;
  lcAmount: LCAmount;
  PaneChevron: React.FC<{ open: boolean }>;
}

const LCAmtPane: React.FC<LCAmtPaneProps> = ({
  expanded,
  togglePane,
  lcAmount,
  PaneChevron,
}) => (
  <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
    <button
      className="flex items-center gap-2 w-full px-6 py-4 text-left"
      onClick={togglePane}
      aria-expanded={expanded}
      type="button"
    >
      <span className="text-green-600 dark:text-green-400 text-lg">💲</span>
      <span className="font-semibold text-lg text-gray-800 dark:text-white">LC Amount</span>
      <div className="ml-auto"><PaneChevron open={expanded} /></div>
    </button>
    {expanded && (
      <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Credit Amount</span>
          <span className="text-2xl font-bold text-green-700 dark:text-green-300">{lcAmount.creditAmount}</span>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tolerance</span>
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-200">{lcAmount.tolerance}</span>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Available With</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">{lcAmount.availableWith}</span>
        </div>
        <div className="col-span-1 md:col-span-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Available By</span>
          <span className="font-medium text-gray-900 dark:text-gray-200">{lcAmount.availableBy}</span>
        </div>
      </div>
    )}
  </section>
);

export default LCAmtPane;
