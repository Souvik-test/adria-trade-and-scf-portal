
import React from "react";
import { Button } from "@/components/ui/button";

interface ReviewPreAdvicedLCActionsBarProps {
  handleDiscard: () => void;
  handleSaveDraft: () => void;
}

const ReviewPreAdvicedLCActionsBar: React.FC<ReviewPreAdvicedLCActionsBarProps> = ({
  handleDiscard,
  handleSaveDraft
}) => (
  <div className="sticky bottom-0 z-10 mt-6 px-0 md:px-6 py-5 bg-card border-t border-border flex flex-col md:flex-row items-center justify-end gap-4">
    <div className="flex gap-3">
      <Button
        onClick={handleDiscard}
        variant="outline"
        className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
      >
        Discard
      </Button>
      <Button
        onClick={handleSaveDraft}
        variant="outline"
        className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
      >
        Save as Draft
      </Button>
    </div>
  </div>
);

export default ReviewPreAdvicedLCActionsBar;
