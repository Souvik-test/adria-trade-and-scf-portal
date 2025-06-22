
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImportLC {
  id: string;
  corporate_reference: string;
  lc_amount: number | null;
  currency: string | null;
  expiry_date: string | null;
  place_of_expiry: string | null;
  applicant_name: string | null;
  issuing_bank: string | null;
  status: string | null;
}

interface LCSearchDropdownProps {
  value: string;
  onSelect: (lcReference: string, lcData: ImportLC) => void;
  placeholder?: string;
  disabled?: boolean;
}

const LCSearchDropdown: React.FC<LCSearchDropdownProps> = ({
  value,
  onSelect,
  placeholder = "Search LC Reference...",
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [lcOptions, setLcOptions] = useState<ImportLC[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImportLCs();
  }, []);

  const fetchImportLCs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('import_lc_requests')
        .select(`
          id,
          corporate_reference,
          lc_amount,
          currency,
          expiry_date,
          place_of_expiry,
          applicant_name,
          issuing_bank,
          status
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setLcOptions(data || []);
    } catch (error) {
      console.error('Error fetching Import LC requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Import LC requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (currentValue: string) => {
    const selectedLC = lcOptions.find(lc => lc.corporate_reference === currentValue);
    if (selectedLC) {
      onSelect(currentValue, selectedLC);
    }
    setOpen(false);
  };

  const selectedLC = lcOptions.find(lc => lc.corporate_reference === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? (
            <span className="truncate">
              {selectedLC ? 
                `${selectedLC.corporate_reference} - ${selectedLC.applicant_name || 'N/A'}` : 
                value
              }
            </span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search LC Reference..." 
            className="h-9"
            icon={<Search className="h-4 w-4" />}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading LC requests..." : "No LC requests found."}
            </CommandEmpty>
            <CommandGroup>
              {lcOptions.map((lc) => (
                <CommandItem
                  key={lc.id}
                  value={lc.corporate_reference}
                  onSelect={handleSelect}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lc.corporate_reference}</span>
                    <span className="text-sm text-gray-500">
                      {lc.applicant_name} • {lc.currency} {lc.lc_amount?.toLocaleString()}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === lc.corporate_reference ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LCSearchDropdown;
