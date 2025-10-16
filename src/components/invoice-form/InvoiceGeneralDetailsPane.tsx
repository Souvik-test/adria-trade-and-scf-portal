import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceFormData } from '@/hooks/useInvoiceForm';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';

interface InvoiceGeneralDetailsPaneProps {
  formData: InvoiceFormData;
  updateField: (field: keyof InvoiceFormData, value: any) => void;
  searchPurchaseOrder: (poNumber: string) => void;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_supplier: string;
  currency: string;
  grand_total: number;
  po_date: string;
}

interface SCFProgram {
  id: string;
  program_id: string;
  program_name: string;
  anchor_name: string;
  anchor_id: string;
}

const InvoiceGeneralDetailsPane: React.FC<InvoiceGeneralDetailsPaneProps> = ({
  formData,
  updateField,
  searchPurchaseOrder
}) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [poSearchOpen, setPoSearchOpen] = useState(false);
  const [isLoadingPOs, setIsLoadingPOs] = useState(false);
  const [scfPrograms, setScfPrograms] = useState<SCFProgram[]>([]);
  const [programSearchOpen, setProgramSearchOpen] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);

  // Fetch POs (all, no user filter)
  const fetchPurchaseOrders = useCallback(async () => {
    setIsLoadingPOs(true);
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('id, po_number, vendor_supplier, currency, grand_total, po_date')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching purchase orders:', error);
      } else {
        setPurchaseOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setIsLoadingPOs(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  // Refetch POs every time the popover is opened
  useEffect(() => {
    if (poSearchOpen) {
      fetchPurchaseOrders();
    }
  }, [poSearchOpen, fetchPurchaseOrders]);

  // Fetch SCF Programs
  const fetchSCFPrograms = useCallback(async () => {
    setIsLoadingPrograms(true);
    try {
      const { data, error } = await supabase
        .from('scf_program_configurations')
        .select('id, program_id, program_name, anchor_name, anchor_id')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching SCF programs:', error);
      } else {
        setScfPrograms(data || []);
      }
    } catch (error) {
      console.error('Error fetching SCF programs:', error);
    } finally {
      setIsLoadingPrograms(false);
    }
  }, []);

  // Initial fetch for programs
  useEffect(() => {
    fetchSCFPrograms();
  }, [fetchSCFPrograms]);

  // Refetch programs when popover opens
  useEffect(() => {
    if (programSearchOpen) {
      fetchSCFPrograms();
    }
  }, [programSearchOpen, fetchSCFPrograms]);

  const handleProgramSelect = async (selectedProgram: SCFProgram) => {
    updateField('programId', selectedProgram.program_id);
    updateField('programName', selectedProgram.program_name);
    
    // Fetch full program configuration
    try {
      const { data: programConfig, error } = await supabase
        .from('scf_program_configurations')
        .select('*')
        .eq('program_id', selectedProgram.program_id)
        .eq('status', 'active')
        .single();
      
      if (programConfig && !error) {
        // Store program configuration in form
        updateField('programCurrency', programConfig.program_currency || 'USD');
        updateField('currency', programConfig.program_currency || 'USD');
        updateField('minTenorDays', programConfig.min_tenor_total_days || 0);
        updateField('maxTenorDays', programConfig.max_tenor_total_days || 365);
        updateField('programLimit', Number(programConfig.program_limit) || 0);
        updateField('anchorLimit', Number(programConfig.anchor_limit) || 0);
        
        // Auto-populate buyer and seller based on product roles
        const { getBuyerSellerInfoFromProgram } = await import('@/services/invoiceManualValidationService');
        const buyerSellerInfo = await getBuyerSellerInfoFromProgram(
          programConfig.program_id,
          programConfig.product_code,
          programConfig.anchor_id,
          programConfig.anchor_name,
          (programConfig.counter_parties as any[]) || []
        );

        if (buyerSellerInfo) {
          updateField('buyerId', buyerSellerInfo.buyerId);
          updateField('buyerName', buyerSellerInfo.buyerName);
          updateField('sellerId', buyerSellerInfo.sellerId);
          updateField('sellerName', buyerSellerInfo.sellerName);
        }
      }
    } catch (error) {
      console.error('Error fetching program configuration:', error);
    }
    
    setProgramSearchOpen(false);
  };

  const handlePOSelect = (selectedPO: PurchaseOrder) => {
    // Auto-populate fields when PO is selected
    updateField('purchaseOrderNumber', selectedPO.po_number);
    updateField('purchaseOrderCurrency', selectedPO.currency);
    updateField('purchaseOrderAmount', selectedPO.grand_total);
    updateField('purchaseOrderDate', selectedPO.po_date);
    setPoSearchOpen(false);
  };

  const handleManualPOSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField('purchaseOrderNumber', value);
    if (value.trim()) {
      searchPurchaseOrder(value);
    } else {
      // Clear PO fields if no PO number
      updateField('purchaseOrderCurrency', '');
      updateField('purchaseOrderAmount', 0);
      updateField('purchaseOrderDate', '');
    }
  };

  const handleRefreshPOs = async () => {
    await fetchPurchaseOrders();
  };

  return (
    <div className="space-y-6">
      {/* Program Details */}
      <Card>
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="programId">Program ID *</Label>
              <div className="flex gap-2 mt-1 items-center">
                <div className="flex-1">
                  <Input
                    id="programId"
                    value={formData.programId}
                    onChange={(e) => updateField('programId', e.target.value)}
                    placeholder="Search or enter Program ID"
                  />
                </div>
                <Popover open={programSearchOpen} onOpenChange={setProgramSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="shrink-0"
                      disabled={isLoadingPrograms}
                      aria-label="Search Program"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                      <span className="text-sm font-semibold">Active SCF Programs</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Refresh Program List"
                        onClick={fetchSCFPrograms}
                        disabled={isLoadingPrograms}
                        className="ml-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoadingPrograms ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                    <Command>
                      <CommandInput placeholder="Search programs..." />
                      <CommandList>
                        {isLoadingPrograms ? (
                          <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                        ) : (
                          <>
                            <CommandEmpty>No programs found.</CommandEmpty>
                            <CommandGroup>
                              {scfPrograms.map((program) => (
                                <CommandItem
                                  key={program.id}
                                  onSelect={() => handleProgramSelect(program)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{program.program_id}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {program.program_name} • {program.anchor_name}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="programName">Program Name</Label>
              <Input
                id="programName"
                value={formData.programName}
                placeholder="Auto-populated from Program ID"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
              <div className="flex gap-2 mt-1 items-center">
                <div className="flex-1">
                  <Input
                    id="purchaseOrderNumber"
                    value={formData.purchaseOrderNumber}
                    onChange={handleManualPOSearch}
                    placeholder="Type to search or enter PO number"
                  />
                </div>
                <Popover open={poSearchOpen} onOpenChange={setPoSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="shrink-0"
                      disabled={isLoadingPOs}
                      aria-label="Search PO"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                      <span className="text-sm font-semibold">Your Purchase Orders</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Refresh PO List"
                        onClick={handleRefreshPOs}
                        disabled={isLoadingPOs}
                        className="ml-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoadingPOs ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                    <Command>
                      <CommandInput placeholder="Search purchase orders..." />
                      <CommandList>
                        {isLoadingPOs ? (
                          <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                        ) : (
                          <>
                            <CommandEmpty>No purchase orders found.</CommandEmpty>
                            <CommandGroup>
                              {purchaseOrders.map((po) => (
                                <CommandItem
                                  key={po.id}
                                  onSelect={() => handlePOSelect(po)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{po.po_number}</span>
                                      <span className="text-sm text-gray-500">
                                        {po.currency} {po.grand_total?.toLocaleString() || '0'}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {po.vendor_supplier} • {po.po_date}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="purchaseOrderCurrency">Purchase Order Currency</Label>
              <Input
                id="purchaseOrderCurrency"
                value={formData.purchaseOrderCurrency}
                placeholder="Auto-populated"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
            
            <div>
              <Label htmlFor="purchaseOrderAmount">Purchase Order Amount</Label>
              <Input
                id="purchaseOrderAmount"
                value={formData.purchaseOrderAmount || ''}
                placeholder="Auto-populated"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
            
            <div>
              <Label htmlFor="purchaseOrderDate">Purchase Order Date</Label>
              <Input
                id="purchaseOrderDate"
                type="date"
                value={formData.purchaseOrderDate}
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Information */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                placeholder="Enter invoice number"
              />
            </div>
            
            <div>
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => updateField('invoiceDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
              />
              {formData.minTenorDays !== undefined && formData.maxTenorDays !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  Tenor will be validated against program range: {formData.minTenorDays} - {formData.maxTenorDays} days
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Input
                id="currency"
                value={formData.currency}
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
              {formData.programCurrency && (
                <p className="text-xs text-muted-foreground mt-1">
                  Must match program currency: {formData.programCurrency}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Party Information */}
      <Card>
        <CardHeader>
          <CardTitle>Party Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buyerId">Buyer ID *</Label>
              <Input
                id="buyerId"
                value={formData.buyerId}
                placeholder="Auto-populated from Program"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
            
            <div>
              <Label htmlFor="buyerName">Buyer Name *</Label>
              <Input
                id="buyerName"
                value={formData.buyerName}
                placeholder="Auto-populated from Program"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
            
            <div>
              <Label htmlFor="sellerId">Seller ID *</Label>
              <Input
                id="sellerId"
                value={formData.sellerId}
                placeholder="Auto-populated from Program"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
            
            <div>
              <Label htmlFor="sellerName">Seller Name *</Label>
              <Input
                id="sellerName"
                value={formData.sellerName}
                placeholder="Auto-populated from Program"
                readOnly
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Textarea
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => updateField('paymentTerms', e.target.value)}
              placeholder="Enter payment terms"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGeneralDetailsPane;
