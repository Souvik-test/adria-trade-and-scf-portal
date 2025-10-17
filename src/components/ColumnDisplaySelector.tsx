import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  alwaysVisible?: boolean;
}

interface ColumnDisplaySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnConfig: ColumnConfig[];
  onApply: (config: ColumnConfig[]) => void;
}

export const ColumnDisplaySelector = ({
  open,
  onOpenChange,
  columnConfig,
  onApply,
}: ColumnDisplaySelectorProps) => {
  const [localConfig, setLocalConfig] = useState<ColumnConfig[]>(columnConfig);

  const handleVisibilityToggle = (columnId: string, checked: boolean) => {
    setLocalConfig(prev =>
      prev.map(col =>
        col.id === columnId
          ? { ...col, visible: checked, sortable: checked ? col.sortable : false }
          : col
      )
    );
  };

  const handleSortableToggle = (columnId: string, checked: boolean) => {
    setLocalConfig(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, sortable: checked } : col
      )
    );
  };

  const handleSelectAll = () => {
    setLocalConfig(prev =>
      prev.map(col => ({ ...col, visible: true }))
    );
  };

  const handleClearAll = () => {
    setLocalConfig(prev =>
      prev.map(col => ({
        ...col,
        visible: col.alwaysVisible || false,
        sortable: col.alwaysVisible ? col.sortable : false,
      }))
    );
  };

  const handleApply = () => {
    onApply(localConfig);
    onOpenChange(false);
  };

  const visibleCount = localConfig.filter(col => col.visible).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Customize Display Columns</SheetTitle>
          <SheetDescription>
            Select which columns to display and enable sorting
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="flex-1"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="flex-1"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {localConfig.map((column) => (
              <div key={column.id} className="space-y-2 pb-2 border-b">
                {/* Main column visibility checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={column.visible}
                    disabled={column.alwaysVisible}
                    onCheckedChange={(checked) =>
                      handleVisibilityToggle(column.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={column.id}
                    className="font-medium flex items-center cursor-pointer"
                  >
                    {column.label}
                    {column.alwaysVisible && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            This column is always visible
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Label>
                </div>

                {/* Nested sorting checkbox */}
                <div className="flex items-center space-x-2 ml-6">
                  <Checkbox
                    id={`${column.id}-sort`}
                    checked={column.sortable}
                    disabled={!column.visible}
                    onCheckedChange={(checked) =>
                      handleSortableToggle(column.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`${column.id}-sort`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Enable Sorting
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button onClick={handleApply} className="w-full">
            Apply Changes ({visibleCount} visible)
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
