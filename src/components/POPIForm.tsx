import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash } from 'lucide-react';
import { savePurchaseOrder, saveProformaInvoice } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  productType: z.enum(['PO', 'PI']),
  poNumber: z.string().optional(),
  poDate: z.date().optional(),
  vendorSupplier: z.string().optional(),
  expectedDeliveryDate: z.date().optional(),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  sameAsShipping: z.boolean().default(false).optional(),
  paymentTerms: z.string().optional(),
  currency: z.string().optional(),
  termsOfSale: z.string().optional(),
  subtotal: z.string().optional(),
  totalTax: z.string().optional(),
  shippingCost: z.string().optional(),
  grandTotal: z.string().optional(),
  bankDetails: z.string().optional(),
  notes: z.string().optional(),
  piNumber: z.string().optional(),
  piDate: z.date().optional(),
  validUntilDate: z.date().optional(),
  buyerName: z.string().optional(),
  buyerId: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.string(),
      unitPrice: z.string(),
      discount: z.string(),
      taxRate: z.string(),
      lineTotal: z.string(),
    })
  ).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const POPIForm: React.FC = () => {
  const [items, setItems] = useState([
    { description: '', quantity: '', unitPrice: '', discount: '', taxRate: '', lineTotal: '' },
  ]);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productType: 'PO',
      sameAsShipping: false,
      items: [
        { description: '', quantity: '', unitPrice: '', discount: '', taxRate: '', lineTotal: '' },
      ],
    },
  });

  const productType = watch('productType');
  const sameAsShipping = watch('sameAsShipping');

  const onSubmit = async (data: FormValues) => {
    try {
      if (data.productType === 'PO') {
        await savePurchaseOrder(data);
      } else if (data.productType === 'PI') {
        await saveProformaInvoice(data);
      }
      toast({
        title: "Success",
        description: `${data.productType === 'PO' ? 'Purchase Order' : 'Proforma Invoice'} saved successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save",
        variant: "destructive"
      });
    }
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: '', unitPrice: '', discount: '', taxRate: '', lineTotal: '' }]);
    setValue('items', [...items, { description: '', quantity: '', unitPrice: '', discount: '', taxRate: '', lineTotal: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    setValue('items', newItems);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    setValue('items', newItems);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Type</CardTitle>
          <CardDescription>Select the type of document you want to create.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productType">Product Type</Label>
                <Controller
                  control={control}
                  name="productType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PO">Purchase Order (PO)</SelectItem>
                        <SelectItem value="PI">Proforma Invoice (PI)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.productType && (
                  <p className="text-red-500 text-sm mt-1">{errors.productType.message?.toString()}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {productType === 'PO' && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
            <CardDescription>Enter the details for the purchase order.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="poNumber">PO Number</Label>
                  <Controller
                    control={control}
                    name="poNumber"
                    render={({ field }) => (
                      <Input id="poNumber" placeholder="PO-2024-001" {...field} />
                    )}
                  />
                  {errors.poNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.poNumber.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="poDate">PO Date</Label>
                  <Controller
                    control={control}
                    name="poDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              new Date(field.value).toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('2020-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.poDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.poDate.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendorSupplier">Vendor/Supplier</Label>
                  <Controller
                    control={control}
                    name="vendorSupplier"
                    render={({ field }) => (
                      <Input id="vendorSupplier" placeholder="Acme Corp" {...field} />
                    )}
                  />
                  {errors.vendorSupplier && (
                    <p className="text-red-500 text-sm mt-1">{errors.vendorSupplier.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                  <Controller
                    control={control}
                    name="expectedDeliveryDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              new Date(field.value).toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.expectedDeliveryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expectedDeliveryDate.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Controller
                  control={control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <Textarea id="shippingAddress" placeholder="123 Main St, Anytown" {...field} />
                  )}
                />
                {errors.shippingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Controller
                  control={control}
                  name="billingAddress"
                  render={({ field }) => (
                    <Textarea id="billingAddress" placeholder="123 Main St, Anytown" {...field} />
                  )}
                />
                {errors.billingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingAddress.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sameAsShipping" className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="sameAsShipping"
                    render={({ field }) => (
                      <Checkbox
                        id="sameAsShipping"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <span>Same as Shipping Address</span>
                </Label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Controller
                    control={control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <Input id="paymentTerms" placeholder="Net 30" {...field} />
                    )}
                  />
                  {errors.paymentTerms && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <Input id="currency" placeholder="USD" {...field} />
                    )}
                  />
                  {errors.currency && (
                    <p className="text-red-500 text-sm mt-1">{errors.currency.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="termsOfSale">Terms of Sale</Label>
                <Controller
                  control={control}
                  name="termsOfSale"
                  render={({ field }) => (
                    <Input id="termsOfSale" placeholder="FOB Destination" {...field} />
                  )}
                />
                {errors.termsOfSale && (
                  <p className="text-red-500 text-sm mt-1">{errors.termsOfSale.message?.toString()}</p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <Controller
                    control={control}
                    name="subtotal"
                    render={({ field }) => (
                      <Input id="subtotal" placeholder="1000.00" {...field} />
                    )}
                  />
                  {errors.subtotal && (
                    <p className="text-red-500 text-sm mt-1">{errors.subtotal.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="totalTax">Total Tax</Label>
                  <Controller
                    control={control}
                    name="totalTax"
                    render={({ field }) => (
                      <Input id="totalTax" placeholder="100.00" {...field} />
                    )}
                  />
                  {errors.totalTax && (
                    <p className="text-red-500 text-sm mt-1">{errors.totalTax.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="shippingCost">Shipping Cost</Label>
                  <Controller
                    control={control}
                    name="shippingCost"
                    render={({ field }) => (
                      <Input id="shippingCost" placeholder="50.00" {...field} />
                    )}
                  />
                  {errors.shippingCost && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingCost.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="grandTotal">Grand Total</Label>
                <Controller
                  control={control}
                  name="grandTotal"
                  render={({ field }) => (
                    <Input id="grandTotal" placeholder="1150.00" {...field} />
                  )}
                />
                {errors.grandTotal && (
                  <p className="text-red-500 text-sm mt-1">{errors.grandTotal.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bankDetails">Bank Details</Label>
                <Controller
                  control={control}
                  name="bankDetails"
                  render={({ field }) => (
                    <Textarea id="bankDetails" placeholder="Bank Name, Account Number, SWIFT Code" {...field} />
                  )}
                />
                {errors.bankDetails && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankDetails.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Controller
                  control={control}
                  name="notes"
                  render={({ field }) => (
                    <Textarea id="notes" placeholder="Additional notes or comments" {...field} />
                  )}
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">{errors.notes.message?.toString()}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {productType === 'PI' && (
        <Card>
          <CardHeader>
            <CardTitle>Proforma Invoice Details</CardTitle>
            <CardDescription>Enter the details for the proforma invoice.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="piNumber">PI Number</Label>
                  <Controller
                    control={control}
                    name="piNumber"
                    render={({ field }) => (
                      <Input id="piNumber" placeholder="PI-2024-001" {...field} />
                    )}
                  />
                  {errors.piNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.piNumber.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="piDate">PI Date</Label>
                  <Controller
                    control={control}
                    name="piDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              new Date(field.value).toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('2020-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.piDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.piDate.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validUntilDate">Valid Until Date</Label>
                  <Controller
                    control={control}
                    name="validUntilDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              new Date(field.value).toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.validUntilDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.validUntilDate.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="buyerName">Buyer Name</Label>
                  <Controller
                    control={control}
                    name="buyerName"
                    render={({ field }) => (
                      <Input id="buyerName" placeholder="Acme Corp" {...field} />
                    )}
                  />
                  {errors.buyerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.buyerName.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyerId">Buyer ID</Label>
                  <Controller
                    control={control}
                    name="buyerId"
                    render={({ field }) => (
                      <Input id="buyerId" placeholder="BID-2024-001" {...field} />
                    )}
                  />
                  {errors.buyerId && (
                    <p className="text-red-500 text-sm mt-1">{errors.buyerId.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Controller
                  control={control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <Textarea id="shippingAddress" placeholder="123 Main St, Anytown" {...field} />
                  )}
                />
                {errors.shippingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Controller
                  control={control}
                  name="billingAddress"
                  render={({ field }) => (
                    <Textarea id="billingAddress" placeholder="123 Main St, Anytown" {...field} />
                  )}
                />
                {errors.billingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingAddress.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sameAsShipping" className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="sameAsShipping"
                    render={({ field }) => (
                      <Checkbox
                        id="sameAsShipping"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <span>Same as Shipping Address</span>
                </Label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Controller
                    control={control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <Input id="paymentTerms" placeholder="Net 30" {...field} />
                    )}
                  />
                  {errors.paymentTerms && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <Input id="currency" placeholder="USD" {...field} />
                    )}
                  />
                  {errors.currency && (
                    <p className="text-red-500 text-sm mt-1">{errors.currency.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="termsOfSale">Terms of Sale</Label>
                <Controller
                  control={control}
                  name="termsOfSale"
                  render={({ field }) => (
                    <Input id="termsOfSale" placeholder="FOB Destination" {...field} />
                  )}
                />
                {errors.termsOfSale && (
                  <p className="text-red-500 text-sm mt-1">{errors.termsOfSale.message?.toString()}</p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <Controller
                    control={control}
                    name="subtotal"
                    render={({ field }) => (
                      <Input id="subtotal" placeholder="1000.00" {...field} />
                    )}
                  />
                  {errors.subtotal && (
                    <p className="text-red-500 text-sm mt-1">{errors.subtotal.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="totalTax">Total Tax</Label>
                  <Controller
                    control={control}
                    name="totalTax"
                    render={({ field }) => (
                      <Input id="totalTax" placeholder="100.00" {...field} />
                    )}
                  />
                  {errors.totalTax && (
                    <p className="text-red-500 text-sm mt-1">{errors.totalTax.message?.toString()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="shippingCost">Shipping Cost</Label>
                  <Controller
                    control={control}
                    name="shippingCost"
                    render={({ field }) => (
                      <Input id="shippingCost" placeholder="50.00" {...field} />
                    )}
                  />
                  {errors.shippingCost && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingCost.message?.toString()}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="grandTotal">Grand Total</Label>
                <Controller
                  control={control}
                  name="grandTotal"
                  render={({ field }) => (
                    <Input id="grandTotal" placeholder="1150.00" {...field} />
                  )}
                />
                {errors.grandTotal && (
                  <p className="text-red-500 text-sm mt-1">{errors.grandTotal.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bankDetails">Bank Details</Label>
                <Controller
                  control={control}
                  name="bankDetails"
                  render={({ field }) => (
                    <Textarea id="bankDetails" placeholder="Bank Name, Account Number, SWIFT Code" {...field} />
                  )}
                />
                {errors.bankDetails && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankDetails.message?.toString()}</p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Controller
                  control={control}
                  name="notes"
                  render={({ field }) => (
                    <Textarea id="notes" placeholder="Additional notes or comments" {...field} />
                  )}
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">{errors.notes.message?.toString()}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Add the items for the {productType === 'PO' ? 'purchase order' : 'proforma invoice'}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-6 gap-4">
                <div>
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Input
                    id={`description-${index}`}
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    placeholder="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`unitPrice-${index}`}>Unit Price</Label>
                  <Input
                    id={`unitPrice-${index}`}
                    placeholder="10.00"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`discount-${index}`}>Discount</Label>
                  <Input
                    id={`discount-${index}`}
                    placeholder="0.00"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`taxRate-${index}`}>Tax Rate</Label>
                  <Input
                    id={`taxRate-${index}`}
                    placeholder="0.00"
                    value={item.taxRate}
                    onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`lineTotal-${index}`}>Line Total</Label>
                  <Input
                    id={`lineTotal-${index}`}
                    placeholder="10.00"
                    value={item.lineTotal}
                    onChange={(e) => handleItemChange(index, 'lineTotal', e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" size="sm" onClick={handleAddItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default POPIForm;
