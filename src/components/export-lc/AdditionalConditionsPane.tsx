
import React from "react";

interface AdditionalConditionsPaneProps {
  expanded: boolean;
  togglePane: () => void;
  additionalConditions: string;
  specialInstructions: string;
  PaneChevron: React.FC<{ open: boolean }>;
}

const AdditionalConditionsPane: React.FC<AdditionalConditionsPaneProps> = ({
  expanded,
  togglePane,
  additionalConditions,
  specialInstructions,
  PaneChevron,
}) => (
  <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
    <button
      className="flex items-center gap-2 w-full px-6 py-4 text-left"
      onClick={togglePane}
      aria-expanded={expanded}
      type="button"
    >
      <span className="text-amber-600 dark:text-amber-300 text-lg">⚠️</span>
      <span className="font-semibold text-lg text-gray-800 dark:text-white">Additional Conditions</span>
      <div className="ml-auto"><PaneChevron open={expanded} /></div>
    </button>
    {expanded && (
      <div className="px-6 pb-4 space-y-3">
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
          <div className="text-xs font-medium text-gray-600 dark:text-amber-100 mb-1">
            Additional Conditions
          </div>
          <div className="text-gray-900 dark:text-white">{additionalConditions}</div>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
          <div className="text-xs font-medium text-gray-600 dark:text-amber-100 mb-1">
            Special Instructions
          </div>
          <div className="text-gray-900 dark:text-white">{specialInstructions}</div>
        </div>
      </div>
    )}
  </section>
);

export default AdditionalConditionsPane;
