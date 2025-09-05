import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShippingGuaranteeFormData, ShippingGuaranteeActionType } from '@/types/shippingGuarantee';

interface BasicInformationPaneProps {
  formData: ShippingGuaranteeFormData;
  onFieldChange: (field: string, value: any) => void;
  action: ShippingGuaranteeActionType;
}

const BasicInformationPane: React.FC<BasicInformationPaneProps> = ({
  formData,
  onFieldChange,
  action
}) => {
  const [guaranteeSearchOpen, setGuaranteeSearchOpen] = useState(false);
  const [relatedRefSearchOpen, setRelatedRefSearchOpen] = useState(false);

  // Sample data for dropdowns - replace with actual data from your service
  const existingGuarantees = [
    { id: 'SG001', reference: 'SG001 - Export LC ABC123' },
    { id: 'SG002', reference: 'SG002 - Import Bill DEF456' },
    { id: 'SG003', reference: 'SG003 - Documentary Collection GHI789' }
  ];

  const relatedReferences = [
    { id: 'LC001', reference: 'LC001 - Export Letter of Credit', type: 'LC' },
    { id: 'LC002', reference: 'LC002 - Import Letter of Credit', type: 'LC' },
    { id: 'BILL001', reference: 'BILL001 - Export Bills Collection', type: 'Bills' },
    { id: 'BILL002', reference: 'BILL002 - Import Bills Settlement', type: 'Bills' }
  ];
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guaranteeReference">Guarantee Reference *</Label>
              {action === 'update' ? (
                <Popover open={guaranteeSearchOpen} onOpenChange={setGuaranteeSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={guaranteeSearchOpen}
                      className="w-full justify-between"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {formData.guaranteeReference || "Search guarantee reference..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search guarantee reference..." />
                      <CommandList>
                        <CommandEmpty>No guarantee found.</CommandEmpty>
                        <CommandGroup>
                          {existingGuarantees.map((guarantee) => (
                            <CommandItem
                              key={guarantee.id}
                              value={guarantee.id}
                              onSelect={() => {
                                onFieldChange('guaranteeReference', guarantee.reference);
                                setGuaranteeSearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.guaranteeReference === guarantee.reference ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {guarantee.reference}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  id="guaranteeReference"
                  value={formData.guaranteeReference || ''}
                  onChange={(e) => onFieldChange('guaranteeReference', e.target.value)}
                  placeholder="Enter guarantee reference"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="corporateReference">Corporate Reference</Label>
              <Input
                id="corporateReference"
                value={formData.corporateReference || ''}
                onChange={(e) => onFieldChange('corporateReference', e.target.value)}
                placeholder="Enter corporate reference"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relatedReference">Related Reference</Label>
            <Popover open={relatedRefSearchOpen} onOpenChange={setRelatedRefSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={relatedRefSearchOpen}
                  className="w-full justify-between"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {formData.relatedReference || "Search LC/Bills reference..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search LC/Bills reference..." />
                  <CommandList>
                    <CommandEmpty>No reference found.</CommandEmpty>
                    <CommandGroup>
                      {relatedReferences.map((ref) => (
                        <CommandItem
                          key={ref.id}
                          value={ref.id}
                          onSelect={() => {
                            onFieldChange('relatedReference', ref.reference);
                            setRelatedRefSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.relatedReference === ref.reference ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{ref.reference}</span>
                            <span className="text-sm text-muted-foreground">Type: {ref.type}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate || ''}
                onChange={(e) => onFieldChange('issueDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => onFieldChange('expiryDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guaranteeAmount">Guarantee Amount *</Label>
              <Input
                id="guaranteeAmount"
                type="number"
                value={formData.guaranteeAmount || ''}
                onChange={(e) => onFieldChange('guaranteeAmount', parseFloat(e.target.value))}
                placeholder="Enter amount"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select 
                value={formData.currency || 'USD'} 
                onValueChange={(value) => onFieldChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guaranteeType">Guarantee Type</Label>
            <Select 
              value={formData.guaranteeType || ''} 
              onValueChange={(value) => onFieldChange('guaranteeType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select guarantee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping Guarantee</SelectItem>
                <SelectItem value="delivery">Delivery Guarantee</SelectItem>
                <SelectItem value="cargo">Cargo Release Guarantee</SelectItem>
                <SelectItem value="vessel">Vessel Guarantee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInformationPane;