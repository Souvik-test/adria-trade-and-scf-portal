
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

interface POPIRecord {
  id: string;
  number: string;
  type: 'PO' | 'PI';
  date: string;
  amount: number;
  currency: string;
  vendor_supplier?: string;
  buyer_name?: string;
}

interface POPISearchSectionProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const POPISearchSection: React.FC<POPISearchSectionProps> = ({
  formData,
  updateField
}) => {
  const [popiRecords, setPopiRecords] = useState<POPIRecord[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPOPIRecords();
  }, []);

  const fetchPOPIRecords = async () => {
    const user = customAuth.getSession()?.user;
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch Purchase Orders
      const { data: poData } = await supabase
        .from('purchase_orders')
        .select('id, po_number, po_date, grand_total, currency, vendor_supplier')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch Proforma Invoices
      const { data: piData } = await supabase
        .from('proforma_invoices')
        .select('id, pi_number, pi_date, grand_total, currency, buyer_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const records: POPIRecord[] = [
        ...(poData || []).map(po => ({
          id: po.id,
          number: po.po_number,
          type: 'PO' as const,
          date: po.po_date || '',
          amount: po.grand_total || 0,
          currency: po.currency || 'USD',
          vendor_supplier: po.vendor_supplier
        })),
        ...(piData || []).map(pi => ({
          id: pi.id,
          number: pi.pi_number,
          type: 'PI' as const,
          date: pi.pi_date || '',
          amount: pi.grand_total || 0,
          currency: pi.currency || 'USD',
          buyer_name: pi.buyer_name
        }))
      ];

      setPopiRecords(records);
    } catch (error) {
      console.error('Error fetching POPI records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePOPISelect = (record: POPIRecord) => {
    updateField('popiNumber', record.number);
    updateField('popiType', record.type);
    setIsSearchOpen(false);
  };

  const handleManualInput = (value: string) => {
    updateField('popiNumber', value);
    if (!value.trim()) {
      updateField('popiType', '');
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Purchase Order / Proforma Invoice Number
      </Label>
      <div className="flex gap-2 mt-1">
        <div className="flex-1">
          <Input
            value={formData.popiNumber}
            onChange={(e) => handleManualInput(e.target.value)}
            placeholder="Type to search or enter PO/PI number"
          />
        </div>
        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="shrink-0"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search PO/PI records..." />
              <CommandList>
                <CommandEmpty>No records found.</CommandEmpty>
                <CommandGroup>
                  {popiRecords.map((record) => (
                    <CommandItem
                      key={record.id}
                      onSelect={() => handlePOPISelect(record)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{record.number}</span>
                          <span className="text-sm text-gray-500">
                            {record.currency} {record.amount?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.type} • {record.vendor_supplier || record.buyer_name} • {record.date}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {formData.popiType && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {formData.popiType === 'PO' ? 'Purchase Order' : 'Proforma Invoice'}
          </span>
        </div>
      )}
    </div>
  );
};

export default POPISearchSection;
