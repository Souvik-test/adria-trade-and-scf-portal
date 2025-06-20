
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchTransferableImportLCs, ImportLCRequest } from '@/services/importLCRequestService';

interface TransferableLCSearchDropdownProps {
  value?: string;
  onValueChange: (value: string, lcData?: ImportLCRequest) => void;
  placeholder?: string;
}

const TransferableLCSearchDropdown: React.FC<TransferableLCSearchDropdownProps> = ({
  value,
  onValueChange,
  placeholder = "Search transferable LCs..."
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [lcRequests, setLcRequests] = useState<ImportLCRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLCs = async () => {
      setLoading(true);
      try {
        const data = await fetchTransferableImportLCs(searchValue);
        console.log('Loaded transferable LCs:', data);
        setLcRequests(data);
      } catch (error) {
        console.error('Error loading transferable LCs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLCs();
  }, [searchValue]);

  const handleSelect = (lcReference: string) => {
    const selectedLC = lcRequests.find(lc => lc.corporate_reference === lcReference);
    console.log('Selected transferable LC:', selectedLC);
    onValueChange(lcReference, selectedLC);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? lcRequests.find(lc => lc.corporate_reference === value)?.corporate_reference : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search transferable LCs..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading..." : "No transferable LCs found."}
            </CommandEmpty>
            <CommandGroup>
              {lcRequests.map((lc) => (
                <CommandItem
                  key={lc.id}
                  value={lc.corporate_reference}
                  onSelect={() => handleSelect(lc.corporate_reference)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === lc.corporate_reference ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{lc.corporate_reference}</span>
                    <span className="text-sm text-muted-foreground">
                      {lc.applicant_name} • {lc.currency} {lc.lc_amount?.toLocaleString()}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TransferableLCSearchDropdown;
