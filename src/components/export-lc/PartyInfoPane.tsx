
import React from "react";

interface Party {
  role: string;
  name: string;
  address: string;
  accent: string;
}
interface PartyInfoPaneProps {
  expanded: boolean;
  togglePane: () => void;
  parties: Party[];
  PaneChevron: React.FC<{ open: boolean }>;
}

const PartyInfoPane: React.FC<PartyInfoPaneProps> = ({
  expanded,
  togglePane,
  parties,
  PaneChevron,
}) => (
  <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
    <button
      className="flex items-center gap-2 w-full px-6 py-4 text-left"
      onClick={togglePane}
      aria-expanded={expanded}
      type="button"
    >
      <span className="text-blue-600 dark:text-blue-400 text-lg">🧾</span>
      <span className="font-semibold text-lg text-gray-800 dark:text-white">
        Parties Information
      </span>
      <div className="ml-auto"><PaneChevron open={expanded} /></div>
    </button>
    {expanded && (
      <div className="px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parties.map((party) => (
            <div
              className={`rounded-xl p-4 ${party.accent}`}
              key={party.role}
            >
              <div className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-1">
                {party.role}
              </div>
              <div className="font-semibold text-gray-900 dark:text-white text-base leading-snug">
                {party.name}
              </div>
              <div className="text-gray-700 dark:text-gray-400 whitespace-pre-line text-sm">
                {party.address}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </section>
);

export default PartyInfoPane;
