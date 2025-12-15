import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { customAuth } from "@/services/customAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, Map } from "lucide-react";

interface ProductEventMapping {
  id: string;
  module_code: string;
  module_name: string;
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
  target_audience: string[];
  business_application: string[];
  created_at: string;
  updated_at: string;
}

interface ProductEventDefinition {
  id: string;
  module_code: string;
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
}

const TARGET_AUDIENCES = ["Corporate", "Bank", "Agent"] as const;
const BUSINESS_APPLICATIONS = ["Adria TSCF Client", "Adria Process Orchestrator", "Adria TSCF Bank"] as const;

interface ProductEventMappingProps {
  onNavigateToManagePanes?: () => void;
}

export const ProductEventMapping = ({ onNavigateToManagePanes }: ProductEventMappingProps) => {
  const [mappings, setMappings] = useState<ProductEventMapping[]>([]);
  const [definitions, setDefinitions] = useState<ProductEventDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    module_code: "",
    module_name: "",
    product_code: "",
    product_name: "",
    event_code: "",
    event_name: "",
    target_audience: [] as string[],
    business_application: [] as string[],
  });

  const handleModuleCodeChange = (value: string) => {
    const moduleName = value === "TF" ? "Trade Finance" : value === "SCF" ? "Supply Chain Finance" : "";
    setFormData({ 
      ...formData, 
      module_code: value, 
      module_name: moduleName,
      product_code: "",
      product_name: "",
      event_code: "",
      event_name: ""
    });
  };

  const handleProductCodeChange = (value: string) => {
    const definition = definitions.find(
      d => d.module_code === formData.module_code && d.product_code === value
    );
    setFormData({
      ...formData,
      product_code: value,
      product_name: definition?.product_name || "",
      event_code: "",
      event_name: ""
    });
  };

  const handleEventCodeChange = (value: string) => {
    const definition = definitions.find(
      d => d.module_code === formData.module_code && 
           d.product_code === formData.product_code && 
           d.event_code === value
    );
    setFormData({
      ...formData,
      event_code: value,
      event_name: definition?.event_name || ""
    });
  };

  // Get unique product codes for selected module
  const availableProductCodes = Array.from(
    new Set(
      definitions
        .filter(d => d.module_code === formData.module_code)
        .map(d => d.product_code)
    )
  );

  // Get event codes for selected module and product
  const availableEventCodes = definitions
    .filter(
      d => d.module_code === formData.module_code && 
           d.product_code === formData.product_code
    )
    .map(d => ({ code: d.event_code, name: d.event_name }));

  useEffect(() => {
    fetchMappings();
    fetchDefinitions();
  }, []);

  const fetchMappings = async () => {
    try {
      const session = customAuth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc('get_product_event_mappings', {
        p_user_id: session.user.id
      });

      if (error) throw error;
      setMappings(data || []);
    } catch (error: any) {
      toast.error("Failed to load product event mappings", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDefinitions = async () => {
    try {
      const { data, error } = await supabase
        .from("product_event_definitions")
        .select("*")
        .order("product_code", { ascending: true });

      if (error) throw error;
      setDefinitions(data || []);
    } catch (error: any) {
      toast.error("Failed to load product event definitions", {
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use custom auth instead of supabase auth
      const session = customAuth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      if (editingId) {
        const { error } = await supabase.rpc('update_product_event_mapping', {
          p_user_id: session.user.id,
          p_mapping_id: editingId,
          p_module_code: formData.module_code,
          p_module_name: formData.module_name,
          p_product_code: formData.product_code,
          p_product_name: formData.product_name,
          p_event_code: formData.event_code,
          p_event_name: formData.event_name,
          p_target_audience: formData.target_audience,
          p_business_application: formData.business_application
        });

        if (error) throw error;
        toast.success("Product event mapping updated successfully");
      } else {
        const { error } = await supabase.rpc('insert_product_event_mapping', {
          p_user_id: session.user.id,
          p_module_code: formData.module_code,
          p_module_name: formData.module_name,
          p_product_code: formData.product_code,
          p_product_name: formData.product_name,
          p_event_code: formData.event_code,
          p_event_name: formData.event_name,
          p_target_audience: formData.target_audience,
          p_business_application: formData.business_application
        });

        if (error) throw error;
        toast.success("Product event mapping created successfully");
      }

      resetForm();
      fetchMappings();
    } catch (error: any) {
      toast.error("Failed to save product event mapping", {
        description: error.message,
      });
    }
  };

  const handleEdit = (mapping: ProductEventMapping) => {
    setFormData({
      module_code: mapping.module_code,
      module_name: mapping.module_name,
      product_code: mapping.product_code,
      product_name: mapping.product_name,
      event_code: mapping.event_code,
      event_name: mapping.event_name,
      target_audience: mapping.target_audience,
      business_application: mapping.business_application || [],
    });
    setEditingId(mapping.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mapping?")) return;

    try {
      const session = customAuth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const { error } = await supabase.rpc('delete_product_event_mapping', {
        p_user_id: session.user.id,
        p_mapping_id: id
      });

      if (error) throw error;
      toast.success("Product event mapping deleted successfully");
      fetchMappings();
    } catch (error: any) {
      toast.error("Failed to delete product event mapping", {
        description: error.message,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      module_code: "",
      module_name: "",
      product_code: "",
      product_name: "",
      event_code: "",
      event_name: "",
      target_audience: [],
      business_application: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleAudience = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      target_audience: prev.target_audience.includes(audience)
        ? prev.target_audience.filter(a => a !== audience)
        : [...prev.target_audience, audience]
    }));
  };

  const toggleBusinessApplication = (app: string) => {
    setFormData(prev => ({
      ...prev,
      business_application: prev.business_application.includes(app)
        ? prev.business_application.filter(a => a !== app)
        : [...prev.business_application, app]
    }));
  };

  const handleMapToPanes = (mapping: ProductEventMapping) => {
    // Navigate to Manage Panes and Sections
    if (onNavigateToManagePanes) {
      onNavigateToManagePanes();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Event Mapping</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Mapping
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingId ? "Edit" : "Add"} Product Event Mapping
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="module_code">Module Code</Label>
                  <Select
                    value={formData.module_code}
                    onValueChange={handleModuleCodeChange}
                  >
                    <SelectTrigger id="module_code">
                      <SelectValue placeholder="Select module code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TF">TF</SelectItem>
                      <SelectItem value="SCF">SCF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module_name">Module Name</Label>
                  <Input
                    id="module_name"
                    value={formData.module_name}
                    readOnly
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_code">Product Code</Label>
                  <Select
                    value={formData.product_code}
                    onValueChange={handleProductCodeChange}
                    disabled={!formData.module_code}
                  >
                    <SelectTrigger id="product_code">
                      <SelectValue placeholder="Select product code" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProductCodes.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_name">Product Name</Label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_code">Event Code</Label>
                  <Select
                    value={formData.event_code}
                    onValueChange={handleEventCodeChange}
                    disabled={!formData.product_code}
                  >
                    <SelectTrigger id="event_code">
                      <SelectValue placeholder="Select event code" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEventCodes.map((event) => (
                        <SelectItem key={event.code} value={event.code}>
                          {event.code} - {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_name">Event Name</Label>
                  <Input
                    id="event_name"
                    value={formData.event_name}
                    onChange={(e) =>
                      setFormData({ ...formData, event_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_segment">Customer Segment</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.target_audience.length > 0
                          ? formData.target_audience.join(", ")
                          : "Select customer segments"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-4 bg-background" align="start">
                      <div className="space-y-2">
                        {TARGET_AUDIENCES.map((audience) => (
                          <div key={audience} className="flex items-center space-x-2">
                            <Checkbox
                              id={`audience-${audience}`}
                              checked={formData.target_audience.includes(audience)}
                              onCheckedChange={() => toggleAudience(audience)}
                            />
                            <label
                              htmlFor={`audience-${audience}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {audience}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_application">Business Application</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.business_application.length > 0
                          ? formData.business_application.join(", ")
                          : "Select business applications"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-4 bg-background" align="start">
                      <div className="space-y-2">
                        {BUSINESS_APPLICATIONS.map((app) => (
                          <div key={app} className="flex items-center space-x-2">
                            <Checkbox
                              id={`app-${app}`}
                              checked={formData.business_application.includes(app)}
                              onCheckedChange={() => toggleBusinessApplication(app)}
                            />
                            <label
                              htmlFor={`app-${app}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {app}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update" : "Create"} Mapping
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Event Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module Code</TableHead>
                  <TableHead>Module Name</TableHead>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Event Code</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Customer Segment</TableHead>
                  <TableHead>Business Application</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No product event mappings found. Click "Add Mapping" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  mappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">
                        {mapping.module_code}
                      </TableCell>
                      <TableCell>{mapping.module_name}</TableCell>
                      <TableCell>{mapping.product_code}</TableCell>
                      <TableCell>{mapping.product_name}</TableCell>
                      <TableCell>{mapping.event_code}</TableCell>
                      <TableCell>{mapping.event_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {mapping.target_audience?.map((audience) => (
                            <span
                              key={audience}
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary"
                            >
                              {audience}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {mapping.business_application?.map((app) => (
                            <span
                              key={app}
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary/10 text-secondary-foreground"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMapToPanes(mapping)}
                            title="Map to Panes and Sections"
                          >
                            <Map className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(mapping)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(mapping.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};
