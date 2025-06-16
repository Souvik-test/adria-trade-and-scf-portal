
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchTransferableLCs, TransferableLC } from '@/services/transferableLCService';

interface LCSearchDropdownProps {
  value: string;
  onSelect: (lc: TransferableLC) => void;
  placeholder?: string;
}

const LCSearchDropdown: React.FC<LCSearchDropdownProps> = ({
  value,
  onSelect,
  placeholder = "Search LC Number..."
}) => {
  const [open, setOpen] = useState(false);
  const [lcs, setLCs] = useState<TransferableLC[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLCs = async (search?: string) => {
    setLoading(true);
    try {
      console.log('Loading LCs with search term:', search);
      const data = await fetchTransferableLCs(search);
      console.log('Loaded LCs:', data);
      setLCs(data);
    } catch (error) {
      console.error('Error fetching transferable LCs:', error);
      setLCs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      console.log('Dropdown opened, loading all LCs');
      loadLCs();
    }
  }, [open]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (open) {
        console.log('Search term changed to:', searchTerm);
        loadLCs(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, open]);

  const handleSelect = (lc: TransferableLC) => {
    console.log('Selected LC:', lc);
    onSelect(lc);
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
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput
            placeholder="Search LC Number..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : lcs.length === 0 ? (
              <CommandEmpty>
                {searchTerm ? `No transferable LCs found matching "${searchTerm}"` : 'No transferable LCs found.'}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {lcs.map((lc) => (
                  <CommandItem
                    key={lc.id}
                    onSelect={() => handleSelect(lc)}
                    className="cursor-pointer"
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
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LCSearchDropdown;
