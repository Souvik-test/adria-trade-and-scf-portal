
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchSubmittedImportLCRequests, ImportLCRequest } from '@/services/importLCRequestService';

interface ImportLCSearchDropdownProps {
  value: string;
  onSelect: (lc: ImportLCRequest) => void;
  placeholder?: string;
}

const ImportLCSearchDropdown: React.FC<ImportLCSearchDropdownProps> = ({
  value,
  onSelect,
  placeholder = "Search LC Reference..."
}) => {
  const [open, setOpen] = useState(false);
  const [lcRequests, setLCRequests] = useState<ImportLCRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLCRequests = async (search?: string) => {
    setLoading(true);
    try {
      console.log('Loading Import LC requests with search term:', search);
      const data = await fetchSubmittedImportLCRequests(search);
      console.log('Loaded Import LC requests:', data);
      setLCRequests(data);
    } catch (error) {
      console.error('Error fetching Import LC requests:', error);
      setLCRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      console.log('Dropdown opened, loading all Import LC requests');
      loadLCRequests();
    }
  }, [open]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (open) {
        console.log('Search term changed to:', searchTerm);
        loadLCRequests(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, open]);

  const handleSelect = (lc: ImportLCRequest) => {
    console.log('Selected Import LC:', lc);
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
            placeholder="Search LC Reference..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : lcRequests.length === 0 ? (
              <CommandEmpty>
                {searchTerm ? `No Import LC requests found matching "${searchTerm}"` : 'No submitted Import LC requests found.'}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {lcRequests.map((lc) => (
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

export default ImportLCSearchDropdown;
