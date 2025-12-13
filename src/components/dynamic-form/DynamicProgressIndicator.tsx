import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaneConfig } from '@/types/dynamicForm';

interface DynamicProgressIndicatorProps {
  panes: PaneConfig[];
  currentPaneIndex: number;
  completedPanes: Set<string>;
  onPaneClick?: (paneIndex: number) => void;
  allowNavigation?: boolean;
}

const DynamicProgressIndicator: React.FC<DynamicProgressIndicatorProps> = ({
  panes,
  currentPaneIndex,
  completedPanes,
  onPaneClick,
  allowNavigation = true,
}) => {
  const handleClick = (index: number) => {
    if (allowNavigation && onPaneClick) {
      onPaneClick(index);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {panes.map((pane, index) => {
          const isCompleted = completedPanes.has(pane.id);
          const isCurrent = index === currentPaneIndex;
          const isPast = index < currentPaneIndex;

          return (
            <React.Fragment key={pane.id}>
              {/* Step indicator */}
              <div
                className={cn(
                  "flex flex-col items-center flex-shrink-0",
                  allowNavigation && (isPast || isCompleted) && "cursor-pointer"
                )}
                onClick={() => (isPast || isCompleted) && handleClick(index)}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    isCompleted && !isCurrent && "border-primary bg-primary/10 text-primary",
                    isPast && !isCompleted && "border-muted-foreground/50 bg-muted text-muted-foreground",
                    !isCurrent && !isPast && !isCompleted && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center max-w-[100px] truncate",
                    isCurrent && "text-primary",
                    (isPast || isCompleted) && !isCurrent && "text-muted-foreground",
                    !isCurrent && !isPast && !isCompleted && "text-muted-foreground/60"
                  )}
                >
                  {pane.name}
                </span>
              </div>

              {/* Connector line */}
              {index < panes.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-all duration-200",
                    isPast || isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicProgressIndicator;
