import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterColumn {
  id: string;
  label: string;
  enabled: boolean;
}

interface FilterColumnSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedColumns: string[];
  onApply: (columns: string[]) => void;
}

const AVAILABLE_FILTERS: FilterColumn[] = [
  { id: "productType", label: "Product Type", enabled: true },
  { id: "transactionReference", label: "Transaction Reference", enabled: true },
  { id: "programId", label: "Program ID", enabled: true },
  { id: "programName", label: "Program Name", enabled: false },
  { id: "anchorId", label: "Anchor ID", enabled: true },
  { id: "anchorName", label: "Anchor Name", enabled: false },
  { id: "counterPartyId", label: "Counter Party ID", enabled: true },
  { id: "counterPartyName", label: "Counter Party Name", enabled: false },
  { id: "fromDate", label: "From Date", enabled: true },
  { id: "toDate", label: "To Date", enabled: true },
  { id: "status", label: "Status", enabled: true },
  { id: "currency", label: "Currency", enabled: false },
  { id: "amountRange", label: "Amount Range", enabled: false },
];

export function FilterColumnSelector({ open, onOpenChange, selectedColumns, onApply }: FilterColumnSelectorProps) {
  const [localSelectedColumns, setLocalSelectedColumns] = useState<string[]>(selectedColumns);

  const handleToggle = (columnId: string, checked: boolean) => {
    setLocalSelectedColumns(prev => 
      checked 
        ? [...prev, columnId]
        : prev.filter(id => id !== columnId)
    );
  };

  const handleApply = () => {
    onApply(localSelectedColumns);
    onOpenChange(false);
  };

  const handleSelectAll = () => {
    setLocalSelectedColumns(AVAILABLE_FILTERS.map(f => f.id));
  };

  const handleClearAll = () => {
    setLocalSelectedColumns([]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Select Filter Columns</SheetTitle>
        </SheetHeader>

        <div className="flex gap-2 my-4">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-4">
            {AVAILABLE_FILTERS.map((filter) => (
              <div key={filter.id} className="flex items-center space-x-2">
                <Checkbox
                  id={filter.id}
                  checked={localSelectedColumns.includes(filter.id)}
                  onCheckedChange={(checked) => handleToggle(filter.id, checked as boolean)}
                />
                <Label
                  htmlFor={filter.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {filter.label}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="mt-6">
          <Button onClick={handleApply} className="w-full">
            Apply Filters ({localSelectedColumns.length} selected)
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
