import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Copy, Trash2, Eye, Power } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProductFields,
  deleteProductField,
  toggleFieldActive,
  copyProductField,
  ProductField,
} from "@/services/productFieldService";
import { ProductFieldFormDialog } from "./ProductFieldFormDialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductFieldDefinitionProps {
  onBack: () => void;
}

export const ProductFieldDefinition = ({ onBack }: ProductFieldDefinitionProps) => {
  const [fields, setFields] = useState<ProductField[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [filterEvent, setFilterEvent] = useState<string>("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("add");
  const [selectedField, setSelectedField] = useState<ProductField | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const loadFields = async () => {
    try {
      setLoading(true);
      const userId = "temp-user-id"; // TODO: Get from auth context
      const data = await fetchProductFields(userId);
      setFields(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleAdd = () => {
    setSelectedField(undefined);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEdit = (field: ProductField) => {
    setSelectedField(field);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleView = (field: ProductField) => {
    setSelectedField(field);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleCopy = async (field: ProductField) => {
    try {
      const userId = "temp-user-id"; // TODO: Get from auth context
      await copyProductField(field.id!, userId);
      toast({
        title: "Success",
        description: "Field copied successfully",
      });
      loadFields();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setFieldToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fieldToDelete) return;
    try {
      const userId = "temp-user-id"; // TODO: Get from auth context
      await deleteProductField(fieldToDelete, userId);
      toast({
        title: "Success",
        description: "Field deleted successfully",
      });
      loadFields();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setFieldToDelete(null);
    }
  };

  const handleToggleActive = async (field: ProductField) => {
    try {
      const userId = "temp-user-id"; // TODO: Get from auth context
      await toggleFieldActive(field.id!, !field.is_active_flag, userId);
      toast({
        title: "Success",
        description: `Field ${field.is_active_flag ? 'deactivated' : 'activated'} successfully`,
      });
      loadFields();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredFields = fields.filter((field) => {
    const matchesSearch =
      field.field_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.field_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = filterProduct === "all" || field.product_code === filterProduct;
    const matchesEvent = filterEvent === "all" || field.event_type === filterEvent;
    const matchesStage = filterStage === "all" || field.stage === filterStage;
    return matchesSearch && matchesProduct && matchesEvent && matchesStage;
  });

  const uniqueProducts = Array.from(new Set(fields.map((f) => f.product_code)));
  const uniqueEvents = Array.from(new Set(fields.map((f) => f.event_type).filter(Boolean)));
  const uniqueStages = Array.from(new Set(fields.map((f) => f.stage).filter(Boolean)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Product Field Definition</h2>
          <p className="text-sm text-muted-foreground">
            Configure field definitions for trade finance products
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterProduct} onValueChange={setFilterProduct}>
            <SelectTrigger>
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {uniqueProducts.map((product) => (
                <SelectItem key={product} value={product}>
                  {product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterEvent} onValueChange={setFilterEvent}>
            <SelectTrigger>
              <SelectValue placeholder="All Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {uniqueEvents.map((event) => (
                <SelectItem key={event} value={event!}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger>
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {uniqueStages.map((stage) => (
                <SelectItem key={stage} value={stage!}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field ID</TableHead>
                <TableHead>Field Code</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>UI Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredFields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No fields found. Click "Add Field" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{field.field_id}</TableCell>
                    <TableCell>{field.field_code || "-"}</TableCell>
                    <TableCell>{field.product_code}</TableCell>
                    <TableCell>{field.event_type || "-"}</TableCell>
                    <TableCell>{field.stage || "-"}</TableCell>
                    <TableCell>{field.ui_display_type || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={field.is_active_flag ? "default" : "secondary"}>
                        {field.is_active_flag ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(field)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(field)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(field)}
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(field)}
                          title={field.is_active_flag ? "Deactivate" : "Activate"}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(field.id!)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ProductFieldFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        field={selectedField}
        onSuccess={loadFields}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the field definition.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
