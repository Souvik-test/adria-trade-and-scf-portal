
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { supabase } from '@/integrations/supabase/client';

interface POPIItem {
  id: string;
  number: string;
  type: 'PO' | 'PI';
  date: string;
  amount: number;
  currency: string;
  vendor_supplier?: string;
  buyer_name?: string;
}

interface POPISearchableSelectProps {
  type: 'PO' | 'PI';
  value: string;
  onChange: (value: string) => void;
}

const POPISearchableSelect: React.FC<POPISearchableSelectProps> = ({
  type,
  value,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<POPIItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type) {
      fetchItems();
    } else {
      setItems([]);
    }
  }, [type]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (type === 'PO') {
        const { data, error } = await supabase
          .from('purchase_orders')
          .select('id, po_number, po_date, grand_total, currency, vendor_supplier')
          .limit(50);

        if (error) throw error;

        const mappedData: POPIItem[] = data?.map(item => ({
          id: item.id,
          number: item.po_number,
          type: 'PO' as const,
          date: item.po_date || '',
          amount: item.grand_total || 0,
          currency: item.currency || 'USD',
          vendor_supplier: item.vendor_supplier || ''
        })) || [];

        setItems(mappedData);
      } else if (type === 'PI') {
        const { data, error } = await supabase
          .from('proforma_invoices')
          .select('id, pi_number, pi_date, grand_total, currency, buyer_name')
          .limit(50);

        if (error) throw error;

        const mappedData: POPIItem[] = data?.map(item => ({
          id: item.id,
          number: item.pi_number,
          type: 'PI' as const,
          date: item.pi_date || '',
          amount: item.grand_total || 0,
          currency: item.currency || 'USD',
          buyer_name: item.buyer_name || ''
        })) || [];

        setItems(mappedData);
      }
    } catch (error) {
      console.error('Error fetching PO/PI items:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = items.find(item => item.number === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedItem
            ? `${selectedItem.number} - ${selectedItem.currency} ${selectedItem.amount.toLocaleString()}`
            : `Select ${type}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${type}...`} />
          <CommandList>
            <CommandEmpty>
              {loading ? 'Loading...' : `No ${type} found.`}
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.number}
                  onSelect={() => {
                    onChange(item.number);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.number ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.number}</div>
                    <div className="text-sm text-gray-500">
                      {item.type === 'PO' ? item.vendor_supplier : item.buyer_name} • 
                      {item.currency} {item.amount.toLocaleString()} • {item.date}
                    </div>
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

export default POPISearchableSelect;
