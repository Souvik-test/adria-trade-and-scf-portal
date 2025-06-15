
import React from "react";

interface DocumentsRequiredPaneProps {
  expanded: boolean;
  togglePane: () => void;
  documents: string[];
  PaneChevron: React.FC<{ open: boolean }>;
}

const DocumentsRequiredPane: React.FC<DocumentsRequiredPaneProps> = ({
  expanded,
  togglePane,
  documents,
  PaneChevron,
}) => (
  <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
    <button
      className="flex items-center gap-2 w-full px-6 py-4 text-left"
      onClick={togglePane}
      aria-expanded={expanded}
      type="button"
    >
      <span className="text-purple-600 dark:text-purple-300 text-lg">📄</span>
      <span className="font-semibold text-lg text-gray-800 dark:text-white">Documents Required</span>
      <div className="ml-auto"><PaneChevron open={expanded} /></div>
    </button>
    {expanded && (
      <div className="px-6 pb-4 space-y-2">
        {documents.map((doc, i) => (
          <div
            key={doc}
            className="flex items-center gap-2 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-base font-medium text-gray-900 dark:text-gray-100"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-sm">{i+1}</span>
            {doc}
          </div>
        ))}
      </div>
    )}
  </section>
);

export default DocumentsRequiredPane;
