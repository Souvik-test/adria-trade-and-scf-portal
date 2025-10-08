import React, { useState } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SCFProductDefinitionProps {
  onBack: () => void;
}

interface ProductDefinition {
  id: string;
  productName: string;
  anchorRole: string;
  counterPartyRole: string;
  underlyingInstrument: string;
}

const SCFProductDefinition: React.FC<SCFProductDefinitionProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductDefinition[]>([
    {
      id: '1',
      productName: 'Receivable Finance',
      anchorRole: 'Seller/Supplier',
      counterPartyRole: 'Buyer',
      underlyingInstrument: 'Invoice',
    },
    {
      id: '2',
      productName: 'Approved Payable Finance',
      anchorRole: 'Buyer',
      counterPartyRole: 'Supplier',
      underlyingInstrument: 'Invoice',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ProductDefinition, 'id'>>({
    productName: '',
    anchorRole: '',
    counterPartyRole: '',
    underlyingInstrument: '',
  });

  const anchorRoles = ['Seller/Supplier', 'Buyer', 'Manufacturer', 'Distributor'];
  const counterPartyRoles = ['Buyer', 'Supplier', 'Vendor', 'Dealer'];
  const underlyingInstruments = ['Invoice', 'Purchase Order', 'Bill of Lading', 'Warehouse Receipt'];

  const handleAdd = () => {
    if (!formData.productName || !formData.anchorRole || !formData.counterPartyRole || !formData.underlyingInstrument) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const newProduct: ProductDefinition = {
      id: Date.now().toString(),
      ...formData,
    };

    setProducts([...products, newProduct]);
    setFormData({
      productName: '',
      anchorRole: '',
      counterPartyRole: '',
      underlyingInstrument: '',
    });
    setIsAdding(false);

    toast({
      title: 'Product Added',
      description: 'Product definition has been created successfully',
    });
  };

  const handleEdit = (product: ProductDefinition) => {
    setEditingId(product.id);
    setFormData({
      productName: product.productName,
      anchorRole: product.anchorRole,
      counterPartyRole: product.counterPartyRole,
      underlyingInstrument: product.underlyingInstrument,
    });
  };

  const handleUpdate = () => {
    if (!formData.productName || !formData.anchorRole || !formData.counterPartyRole || !formData.underlyingInstrument) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setProducts(products.map(p => 
      p.id === editingId 
        ? { ...p, ...formData }
        : p
    ));
    
    setEditingId(null);
    setFormData({
      productName: '',
      anchorRole: '',
      counterPartyRole: '',
      underlyingInstrument: '',
    });

    toast({
      title: 'Product Updated',
      description: 'Product definition has been updated successfully',
    });
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: 'Product Deleted',
      description: 'Product definition has been removed',
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      productName: '',
      anchorRole: '',
      counterPartyRole: '',
      underlyingInstrument: '',
    });
  };

  const handleProceedToConfiguration = () => {
    toast({
      title: 'Proceeding to Program Configuration',
      description: 'Redirecting to link products with programs...',
    });
    // This would trigger navigation to Program Configuration
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg professional-shadow">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Product Definition</h2>
            <p className="text-muted-foreground mt-1">Define SCF products tailored to your business needs</p>
          </div>
          <Button 
            onClick={() => setIsAdding(true)}
            disabled={isAdding || editingId !== null}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Product Definition' : 'New Product Definition'}</CardTitle>
              <CardDescription>
                {editingId ? 'Update the product details below' : 'Enter the details for your new SCF product'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g., Dynamic Discounting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="anchorRole">Anchor Role *</Label>
                  <Select
                    value={formData.anchorRole}
                    onValueChange={(value) => setFormData({ ...formData, anchorRole: value })}
                  >
                    <SelectTrigger id="anchorRole">
                      <SelectValue placeholder="Select anchor role" />
                    </SelectTrigger>
                    <SelectContent>
                      {anchorRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="counterPartyRole">Counter-Party Role *</Label>
                  <Select
                    value={formData.counterPartyRole}
                    onValueChange={(value) => setFormData({ ...formData, counterPartyRole: value })}
                  >
                    <SelectTrigger id="counterPartyRole">
                      <SelectValue placeholder="Select counter-party role" />
                    </SelectTrigger>
                    <SelectContent>
                      {counterPartyRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="underlyingInstrument">Underlying Instrument *</Label>
                  <Select
                    value={formData.underlyingInstrument}
                    onValueChange={(value) => setFormData({ ...formData, underlyingInstrument: value })}
                  >
                    <SelectTrigger id="underlyingInstrument">
                      <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      {underlyingInstruments.map((instrument) => (
                        <SelectItem key={instrument} value={instrument}>
                          {instrument}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={editingId ? handleUpdate : handleAdd} className="gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update' : 'Save'}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Defined Products</CardTitle>
            <CardDescription>
              Manage your SCF product definitions. Once complete, proceed to Program Configuration to link products with programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold">Anchor Role</TableHead>
                  <TableHead className="font-semibold">Counter-Party Role</TableHead>
                  <TableHead className="font-semibold">Underlying Instrument</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No products defined yet. Click "Add Product" to create your first product definition.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell>{product.anchorRole}</TableCell>
                      <TableCell>{product.counterPartyRole}</TableCell>
                      <TableCell>{product.underlyingInstrument}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                            disabled={isAdding || editingId !== null}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(product.id)}
                            disabled={isAdding || editingId !== null}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {products.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleProceedToConfiguration} size="lg" className="gap-2">
                  Proceed to Program Configuration
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SCFProductDefinition;
