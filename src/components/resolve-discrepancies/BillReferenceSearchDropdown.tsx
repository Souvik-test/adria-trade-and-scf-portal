
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ExportLCBill {
  id: string;
  bill_reference: string;
  lc_reference: string;
  corporate_reference: string;
  applicant_name: string;
  issuing_bank: string;
  status: string;
}

interface BillReferenceSearchDropdownProps {
  value: string;
  onSelect: (billReference: string, billData: ExportLCBill) => void;
  placeholder?: string;
}

const BillReferenceSearchDropdown: React.FC<BillReferenceSearchDropdownProps> = ({
  value,
  onSelect,
  placeholder = "Search bill reference..."
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [bills, setBills] = useState<ExportLCBill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 1) {
      searchBills(searchTerm);
    } else {
      setBills([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  const searchBills = async (term: string) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    try {
      console.log('Searching for bills with term:', term);
      
      const { data, error } = await supabase
        .from('export_lc_bills')
        .select('id, bill_reference, lc_reference, corporate_reference, applicant_name, issuing_bank, status')
        .ilike('bill_reference', `%${term}%`)
        .eq('status', 'submitted')
        .limit(10);

      if (error) {
        console.error('Error searching bills:', error);
        setBills([]);
      } else {
        console.log('Found bills:', data);
        setBills(data || []);
        setIsOpen(data && data.length > 0);
      }
    } catch (error) {
      console.error('Error searching bills:', error);
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (bill: ExportLCBill) => {
    console.log('Selected bill:', bill);
    setSearchTerm(bill.bill_reference);
    setIsOpen(false);
    onSelect(bill.bill_reference, bill);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (newValue.trim() === '') {
      setBills([]);
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 1) {
      searchBills(searchTerm);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Input
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          )}
          <Search className="w-4 h-4 text-gray-400" />
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {isOpen && bills.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {bills.map((bill) => (
            <div
              key={bill.id}
              onClick={() => handleSelect(bill)}
              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
            >
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                {bill.bill_reference}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                LC: {bill.lc_reference || 'N/A'} | Corp: {bill.corporate_reference || 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {bill.applicant_name || 'N/A'} | {bill.issuing_bank || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && searchTerm.length >= 1 && bills.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
            No bills found matching "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
};

export default BillReferenceSearchDropdown;
