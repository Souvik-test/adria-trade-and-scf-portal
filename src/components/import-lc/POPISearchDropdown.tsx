
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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

interface POPISearchDropdownProps {
  selectedPOPI: POPIItem | null;
  onSelectPOPI: (popi: POPIItem | null) => void;
  popiType: 'PO' | 'PI' | '';
  onTypeChange: (type: 'PO' | 'PI' | '') => void;
}

const POPISearchDropdown: React.FC<POPISearchDropdownProps> = ({
  selectedPOPI,
  onSelectPOPI,
  popiType,
  onTypeChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<POPIItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (popiType && searchTerm.length >= 2) {
      fetchItems();
    } else {
      setItems([]);
    }
  }, [popiType, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (popiType === 'PO') {
        const { data, error } = await supabase
          .from('purchase_orders')
          .select('id, po_number, po_date, grand_total, currency, vendor_supplier')
          .ilike('po_number', `%${searchTerm}%`)
          .limit(10);

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
      } else if (popiType === 'PI') {
        const { data, error } = await supabase
          .from('proforma_invoices')
          .select('id, pi_number, pi_date, grand_total, currency, buyer_name')
          .ilike('pi_number', `%${searchTerm}%`)
          .limit(10);

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

  const handleSelectItem = (item: POPIItem) => {
    onSelectPOPI(item);
    setSearchTerm(item.number);
    setIsOpen(false);
  };

  const handleTypeChange = (type: 'PO' | 'PI') => {
    onTypeChange(type);
    onSelectPOPI(null);
    setSearchTerm('');
    setItems([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          POPI Type <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-4 mt-2">
          <Button
            type="button"
            variant={popiType === 'PO' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('PO')}
            className="px-6"
          >
            Purchase Order
          </Button>
          <Button
            type="button"
            variant={popiType === 'PI' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('PI')}
            className="px-6"
          >
            Proforma Invoice
          </Button>
        </div>
      </div>

      {popiType && (
        <div className="relative">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Search {popiType === 'PO' ? 'Purchase Order' : 'Proforma Invoice'}
          </Label>
          <div className="relative mt-1">
            <Input
              placeholder={`Search ${popiType} number...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {loading && <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>}
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {isOpen && items.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.number}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.type === 'PO' ? item.vendor_supplier : item.buyer_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.currency} {item.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedPOPI && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">
                Selected: {selectedPOPI.number}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {selectedPOPI.currency} {selectedPOPI.amount.toLocaleString()} • {selectedPOPI.date}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onSelectPOPI(null);
                setSearchTerm('');
              }}
              className="text-green-600 hover:text-green-800"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POPISearchDropdown;
