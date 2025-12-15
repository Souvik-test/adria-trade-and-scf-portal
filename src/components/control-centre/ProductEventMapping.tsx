import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { customAuth } from "@/services/customAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit2, Map, Plus, Filter, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductEventDefinition {
  id: string;
  module_code: string;
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
  created_at: string;
  updated_at: string;
}

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

// Combined display row - either a definition or a mapping
interface DisplayRow {
  type: 'definition' | 'mapping';
  definition: ProductEventDefinition;
  mapping?: ProductEventMapping;
  // For display purposes
  displayProductName: string;
  displayEventName: string;
}

interface MappingFormData {
  product_name: string;
  event_name: string;
  target_audience: string[];
  business_application: string[];
}

const TARGET_AUDIENCES = ["Corporate", "Bank", "Agent"] as const;
const BUSINESS_APPLICATIONS = ["Adria TSCF Client", "Adria Process Orchestrator", "Adria TSCF Bank"] as const;

const MODULE_NAMES: Record<string, string> = {
  TF: "Trade Finance",
  SCF: "Supply Chain Finance",
};

interface ProductEventMappingProps {
  onNavigateToManagePanes?: () => void;
}

export const ProductEventMapping = ({ onNavigateToManagePanes }: ProductEventMappingProps) => {
  const [definitions, setDefinitions] = useState<ProductEventDefinition[]>([]);
  const [mappings, setMappings] = useState<ProductEventMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ProductEventDefinition | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<ProductEventMapping | null>(null);
  const [isNewMapping, setIsNewMapping] = useState(false);
  const [productFilter, setProductFilter] = useState<string>("all");
  const [formData, setFormData] = useState<MappingFormData>({
    product_name: "",
    event_name: "",
    target_audience: [],
    business_application: [],
  });

  // Get unique product codes for filter
  const uniqueProductCodes = Array.from(new Set(definitions.map(d => d.product_code))).sort();

  // Build display rows - show each mapping as a separate row
  const buildDisplayRows = (): DisplayRow[] => {
    const rows: DisplayRow[] = [];
    
    // Filter definitions by selected product
    const filteredDefs = productFilter === "all" 
      ? definitions 
      : definitions.filter(d => d.product_code === productFilter);

    for (const def of filteredDefs) {
      // Find all mappings for this definition
      const defMappings = mappings.filter(
        m => m.module_code === def.module_code && 
             m.product_code === def.product_code && 
             m.event_code === def.event_code
      );

      if (defMappings.length === 0) {
        // No mappings - show definition row
        rows.push({
          type: 'definition',
          definition: def,
          displayProductName: def.product_name,
          displayEventName: def.event_name,
        });
      } else {
        // Show each mapping as a separate row
        for (const mapping of defMappings) {
          rows.push({
            type: 'mapping',
            definition: def,
            mapping: mapping,
            displayProductName: mapping.product_name,
            displayEventName: mapping.event_name,
          });
        }
      }
    }

    return rows;
  };

  const displayRows = buildDisplayRows();

  // Check how many mappings exist for a definition
  const getMappingCount = (def: ProductEventDefinition): number => {
    return mappings.filter(
      m => m.module_code === def.module_code && 
           m.product_code === def.product_code && 
           m.event_code === def.event_code
    ).length;
  };

  // Get used business applications for a definition
  const getUsedBusinessApps = (def: ProductEventDefinition): string[] => {
    const defMappings = mappings.filter(
      m => m.module_code === def.module_code && 
           m.product_code === def.product_code && 
           m.event_code === def.event_code
    );
    return defMappings.flatMap(m => m.business_application || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch definitions
      const { data: defsData, error: defsError } = await supabase
        .from("product_event_definitions")
        .select("*")
        .order("module_code", { ascending: true })
        .order("product_code", { ascending: true })
        .order("event_code", { ascending: true });

      if (defsError) throw defsError;
      setDefinitions(defsData || []);

      // Fetch existing mappings (shared configurations - no user filtering)
      const { data: mappingsData, error: mappingsError } = await supabase.rpc('get_product_event_mappings');
      if (!mappingsError) {
        setMappings(mappingsData || []);
      }
    } catch (error: any) {
      toast.error("Failed to load data", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: DisplayRow) => {
    setSelectedDefinition(row.definition);
    setSelectedMapping(row.mapping || null);
    setIsNewMapping(false);
    setFormData({
      product_name: row.displayProductName,
      event_name: row.displayEventName,
      target_audience: row.mapping?.target_audience || [],
      business_application: row.mapping?.business_application || [],
    });
    setEditDialogOpen(true);
  };

  const handleAddMapping = (def: ProductEventDefinition) => {
    const usedApps = getUsedBusinessApps(def);
    const availableApps = BUSINESS_APPLICATIONS.filter(app => !usedApps.includes(app));
    
    if (availableApps.length === 0) {
      toast.error("Maximum mappings reached", { 
        description: "All 3 business applications already have mappings for this product-event" 
      });
      return;
    }

    setSelectedDefinition(def);
    setSelectedMapping(null);
    setIsNewMapping(true);
    setFormData({
      product_name: def.product_name,
      event_name: def.event_name,
      target_audience: [],
      business_application: [],
    });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedDefinition) return;

    // Validate at least one business application selected
    if (formData.business_application.length === 0) {
      toast.error("Please select at least one Business Application");
      return;
    }

    try {
      const session = customAuth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const moduleName = MODULE_NAMES[selectedDefinition.module_code] || selectedDefinition.module_code;

      if (selectedMapping && !isNewMapping) {
        // Update existing mapping
        const { error } = await supabase.rpc('update_product_event_mapping', {
          p_user_id: session.user.id,
          p_mapping_id: selectedMapping.id,
          p_module_code: selectedDefinition.module_code,
          p_module_name: moduleName,
          p_product_code: selectedDefinition.product_code,
          p_product_name: formData.product_name,
          p_event_code: selectedDefinition.event_code,
          p_event_name: formData.event_name,
          p_target_audience: formData.target_audience,
          p_business_application: formData.business_application
        });

        if (error) throw error;
        toast.success("Mapping updated successfully");
      } else {
        // Create new mapping
        const { error } = await supabase.rpc('insert_product_event_mapping', {
          p_user_id: session.user.id,
          p_module_code: selectedDefinition.module_code,
          p_module_name: moduleName,
          p_product_code: selectedDefinition.product_code,
          p_product_name: formData.product_name,
          p_event_code: selectedDefinition.event_code,
          p_event_name: formData.event_name,
          p_target_audience: formData.target_audience,
          p_business_application: formData.business_application
        });

        if (error) throw error;
        toast.success("Mapping created successfully");
      }

      setEditDialogOpen(false);
      setSelectedDefinition(null);
      setSelectedMapping(null);
      setIsNewMapping(false);
      fetchData();
    } catch (error: any) {
      toast.error("Failed to save mapping", { description: error.message });
    }
  };

  const handleDelete = async (mapping: ProductEventMapping) => {
    if (!confirm("Are you sure you want to delete this mapping?")) return;

    try {
      const { error } = await supabase
        .from('product_event_mapping')
        .delete()
        .eq('id', mapping.id);

      if (error) throw error;
      toast.success("Mapping deleted successfully");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete mapping", { description: error.message });
    }
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

  const handleMapToPanes = (def: ProductEventDefinition) => {
    if (onNavigateToManagePanes) {
      onNavigateToManagePanes();
    }
  };

  // Get available business applications for the edit dialog
  const getAvailableBusinessApps = (): string[] => {
    if (!selectedDefinition) return [...BUSINESS_APPLICATIONS];
    
    const usedApps = getUsedBusinessApps(selectedDefinition);
    // If editing existing mapping, include its current apps
    const currentApps = selectedMapping?.business_application || [];
    
    return BUSINESS_APPLICATIONS.filter(
      app => !usedApps.includes(app) || currentApps.includes(app)
    );
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
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Product Event Mappings</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {uniqueProductCodes.map((code) => (
                  <SelectItem key={code} value={code}>{code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
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
                {displayRows.map((row, index) => {
                  const mappingCount = getMappingCount(row.definition);
                  const canAddMore = mappingCount < 3;
                  const isDefinitionRow = row.type === 'definition';
                  
                  return (
                    <TableRow key={`${row.definition.id}-${row.mapping?.id || 'def'}-${index}`}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{row.definition.module_code}</span>
                          <span className="text-xs text-muted-foreground">
                            {MODULE_NAMES[row.definition.module_code]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{row.definition.product_code}</TableCell>
                      <TableCell>
                        <span className={isDefinitionRow ? "text-muted-foreground italic" : ""}>
                          {row.displayProductName}
                        </span>
                      </TableCell>
                      <TableCell>{row.definition.event_code}</TableCell>
                      <TableCell>
                        <span className={isDefinitionRow ? "text-muted-foreground italic" : ""}>
                          {row.displayEventName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {row.mapping?.target_audience?.map((audience) => (
                            <Badge 
                              key={audience} 
                              variant="outline" 
                              className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"
                            >
                              {audience}
                            </Badge>
                          ))}
                          {(!row.mapping?.target_audience || row.mapping.target_audience.length === 0) && (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {row.mapping?.business_application?.map((app) => (
                            <Badge 
                              key={app} 
                              variant="secondary"
                              className="text-xs"
                            >
                              {app.replace('Adria ', '')}
                            </Badge>
                          ))}
                          {(!row.mapping?.business_application || row.mapping.business_application.length === 0) && (
                            <span className="text-muted-foreground text-sm">Not configured</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {canAddMore && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAddMapping(row.definition)}
                              title="Add new mapping for different Business Application"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMapToPanes(row.definition)}
                            title="Map to Panes and Sections"
                          >
                            <Map className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(row)}
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {row.mapping && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(row.mapping!)}
                              title="Delete mapping"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isNewMapping ? "Add New Mapping" : "Edit Product Event Mapping"}
            </DialogTitle>
          </DialogHeader>
          {selectedDefinition && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Module Code</Label>
                  <p className="font-medium">{selectedDefinition.module_code}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Module Name</Label>
                  <p className="font-medium">{MODULE_NAMES[selectedDefinition.module_code]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Product Code</Label>
                  <p className="font-medium">{selectedDefinition.product_code}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Event Code</Label>
                  <p className="font-medium">{selectedDefinition.event_code}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="e.g., Import Documentary Credit"
                />
                <p className="text-xs text-muted-foreground">
                  Customize the product name for this business application
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_name">Event Name</Label>
                <Input
                  id="event_name"
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  placeholder="e.g., Create Credoc"
                />
                <p className="text-xs text-muted-foreground">
                  Customize the event name for this business application
                </p>
              </div>

              <div className="space-y-2">
                <Label>Customer Segment</Label>
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
                            className="text-sm font-medium leading-none cursor-pointer"
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
                <Label>Business Application <span className="text-destructive">*</span></Label>
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
                      {getAvailableBusinessApps().map((app) => (
                        <div key={app} className="flex items-center space-x-2">
                          <Checkbox
                            id={`app-${app}`}
                            checked={formData.business_application.includes(app)}
                            onCheckedChange={() => toggleBusinessApplication(app)}
                          />
                          <label
                            htmlFor={`app-${app}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {app}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Each business application can have its own product/event naming
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isNewMapping ? "Create Mapping" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
