import React from 'react';

interface ShippingGuaranteeProgressIndicatorProps {
  currentPane: number;
  panes: string[];
  onPaneClick: (paneIndex: number) => void;
}

const ShippingGuaranteeProgressIndicator: React.FC<ShippingGuaranteeProgressIndicatorProps> = ({
  currentPane,
  panes,
  onPaneClick
}) => {
  return (
    <div className="bg-background border-b border-border px-6 py-3">
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
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
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

export default ShippingGuaranteeProgressIndicator;