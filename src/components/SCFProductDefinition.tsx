import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Power, CheckSquare, Square, Settings } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  type ProductFormData,
} from '@/services/scfProductService';

interface SCFProductDefinitionProps {
  onBack: () => void;
  onNavigateToProgramConfig: (productCode?: string) => void;
}

type ProductDefinition = ProductFormData & { id: string };

const SCFProductDefinition: React.FC<SCFProductDefinitionProps> = ({ onBack, onNavigateToProgramConfig }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ProductDefinition, 'id'>>({
    productCode: '',
    productName: '',
    productDescription: '',
    anchorRole: '',
    counterPartyRole: '',
    borrowerRole: '',
    underlyingInstrument: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    isActive: true,
    authorizationRequired: false,
  });

  const anchorRoles = ['Seller/Supplier', 'Buyer', 'Manufacturer', 'Distributor'];
  const counterPartyRoles = ['Buyer', 'Supplier', 'Vendor', 'Dealer'];
  const borrowerRoles = ['Seller/Supplier', 'Buyer', 'Manufacturer', 'Distributor', 'Both'];
  const underlyingInstruments = ['Invoice', 'Purchase Order', 'Bill of Lading', 'Warehouse Receipt'];

  // Fetch products on mount
  useEffect(() => {
    const loadProducts = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await fetchProducts(user.id);
        setProducts(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user?.id, toast]);

  const handleAdd = async () => {
    if (!formData.productCode || !formData.productName || !formData.anchorRole || !formData.counterPartyRole || !formData.underlyingInstrument || !formData.effectiveDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all mandatory fields (Product Code, Name, Anchor Role, Counter-Party Role, Underlying Instrument, and Effective Date)',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create products',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newProduct = await createProduct(formData, user.id);
      setProducts([newProduct, ...products]);
      setFormData({
        productCode: '',
        productName: '',
        productDescription: '',
        anchorRole: '',
        counterPartyRole: '',
        borrowerRole: '',
        underlyingInstrument: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        isActive: true,
        authorizationRequired: false,
      });
      setIsAdding(false);

      toast({
        title: 'Product Added',
        description: 'Product definition has been created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product: ProductDefinition) => {
    setEditingId(product.id);
    setFormData({
      productCode: product.productCode,
      productName: product.productName,
      productDescription: product.productDescription,
      anchorRole: product.anchorRole,
      counterPartyRole: product.counterPartyRole,
      borrowerRole: product.borrowerRole,
      underlyingInstrument: product.underlyingInstrument,
      effectiveDate: product.effectiveDate,
      expiryDate: product.expiryDate,
      isActive: product.isActive,
      authorizationRequired: product.authorizationRequired,
    });
  };

  const handleUpdate = async () => {
    if (!formData.productCode || !formData.productName || !formData.anchorRole || !formData.counterPartyRole || !formData.underlyingInstrument || !formData.effectiveDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all mandatory fields (Product Code, Name, Anchor Role, Counter-Party Role, Underlying Instrument, and Effective Date)',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.id || !editingId) return;

    try {
      const updatedProduct = await updateProduct(editingId, formData, user.id);
      setProducts(products.map(p => p.id === editingId ? updatedProduct : p));
      
      setEditingId(null);
      setFormData({
        productCode: '',
        productName: '',
        productDescription: '',
        anchorRole: '',
        counterPartyRole: '',
        borrowerRole: '',
        underlyingInstrument: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        isActive: true,
        authorizationRequired: false,
      });

      toast({
        title: 'Product Updated',
        description: 'Product definition has been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;

    try {
      await deleteProduct(id, user.id);
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: 'Product Deleted',
        description: 'Product definition has been removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      productCode: '',
      productName: '',
      productDescription: '',
      anchorRole: '',
      counterPartyRole: '',
      borrowerRole: '',
      underlyingInstrument: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      isActive: true,
      authorizationRequired: false,
    });
  };

  const handleToggleActive = async (id: string) => {
    if (!user?.id) return;

    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      const updatedProduct = await toggleProductActive(id, product.isActive, user.id);
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
      
      toast({
        title: product.isActive ? 'Product Deactivated' : 'Product Activated',
        description: `${product.productName} has been ${product.isActive ? 'deactivated' : 'activated'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle product status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleProgramMapping = (product: ProductDefinition) => {
    if (product.authorizationRequired) {
      toast({
        title: 'Authorization Pending',
        description: `Navigating to Program Configuration for ${product.productName}. Note: Authorization is pending for this product.`,
      });
    }
    
    if (onNavigateToProgramConfig) {
      onNavigateToProgramConfig(product.productCode);
    }
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="productCode">Product Code *</Label>
                  <Input
                    id="productCode"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    placeholder="e.g., RF001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g., Dynamic Discounting"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="productDescription">Product Description (Optional)</Label>
                  <Textarea
                    id="productDescription"
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    placeholder="Brief description of the product"
                    rows={2}
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
                  <Label htmlFor="borrowerRole">Borrower Role (Optional)</Label>
                  <Select
                    value={formData.borrowerRole || ''}
                    onValueChange={(value) => setFormData({ ...formData, borrowerRole: value })}
                  >
                    <SelectTrigger id="borrowerRole">
                      <SelectValue placeholder="Select borrower role" />
                    </SelectTrigger>
                    <SelectContent>
                      {borrowerRoles.map((role) => (
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

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Product Effective Date *</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Product Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer font-medium">
                    Active Product {formData.isActive ? '(Enabled)' : '(Disabled)'}
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Checkbox
                    id="authorizationRequired"
                    checked={formData.authorizationRequired}
                    onCheckedChange={(checked) => setFormData({ ...formData, authorizationRequired: checked as boolean })}
                  />
                  <Label htmlFor="authorizationRequired" className="cursor-pointer font-medium">
                    Authorization Required
                    <span className="block text-xs text-muted-foreground mt-1">
                      Product will require approval before linking with programs
                    </span>
                  </Label>
                </div>
              </div>

              <div className="flex gap-2">
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products defined yet. Click "Add Product" to create your first product.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Product Code</TableHead>
                      <TableHead className="font-bold">Product Name</TableHead>
                      <TableHead className="font-bold">Anchor Role</TableHead>
                      <TableHead className="font-bold">Counter-Party Role</TableHead>
                      <TableHead className="font-bold">Borrower Role</TableHead>
                    <TableHead className="font-bold">Underlying Instrument</TableHead>
                    <TableHead className="font-bold">Effective Date</TableHead>
                    <TableHead className="font-bold text-center">Status</TableHead>
                    <TableHead className="font-bold text-center">Auth Required</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-lg font-medium">No products defined yet</p>
                          <p className="text-sm">Click "Add Product" to create your first product definition</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-sm font-bold text-primary">
                          {product.productCode}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          <div>
                            {product.productName}
                            {product.productDescription && (
                              <p className="text-xs text-muted-foreground mt-1">{product.productDescription}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/10">
                            {product.anchorRole}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-secondary/10">
                            {product.counterPartyRole}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.borrowerRole ? (
                            <Badge variant="outline" className="bg-accent/10">
                              {product.borrowerRole}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-accent/10">
                            {product.underlyingInstrument}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            {new Date(product.effectiveDate).toLocaleDateString()}
                            {product.expiryDate && (
                              <p className="text-xs text-muted-foreground">to {new Date(product.expiryDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Switch
                              checked={product.isActive}
                              onCheckedChange={() => handleToggleActive(product.id)}
                              disabled={isAdding || editingId !== null}
                            />
                            <Badge 
                              variant={product.isActive ? "default" : "secondary"}
                              className={product.isActive ? "bg-green-500" : "bg-gray-400"}
                            >
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {product.authorizationRequired ? (
                            <CheckSquare className="w-5 h-5 text-primary mx-auto" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleProgramMapping(product)}
                              disabled={isAdding || editingId !== null}
                              className="hover:bg-primary/10 text-primary"
                              title="Program Mapping"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(product)}
                              disabled={isAdding || editingId !== null}
                              className="hover:bg-primary/10"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(product.id)}
                              disabled={isAdding || editingId !== null}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SCFProductDefinition;
