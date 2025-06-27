
import React from 'react';

interface OutwardBGProgressIndicatorProps {
  currentPane: number;
  panes: string[];
  onPaneClick: (paneIndex: number) => void;
}

const OutwardBGProgressIndicator: React.FC<OutwardBGProgressIndicatorProps> = ({
  currentPane,
  panes,
  onPaneClick
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex space-x-4 overflow-x-auto">
        {panes.map((pane, index) => (
          <button
            key={index}
            onClick={() => onPaneClick(index)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              index === currentPane
                ? 'bg-primary text-primary-foreground'
                : index < currentPane
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{index + 1}.</span>
            {pane}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OutwardBGProgressIndicator;
