import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createProductField, updateProductField, ProductField } from "@/services/productFieldService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFieldFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "view";
  field?: ProductField;
  onSuccess: () => void;
}

export const ProductFieldFormDialog = ({
  open,
  onOpenChange,
  mode,
  field,
  onSuccess,
}: ProductFieldFormDialogProps) => {
  const [formData, setFormData] = useState<Partial<ProductField>>({
    is_active_flag: true,
    effective_from_date: new Date().toISOString().split('T')[0],
    config_version: 1,
    channel_customer_portal_flag: false,
    channel_middle_office_flag: false,
    channel_back_office_flag: false,
    is_mandatory_portal: false,
    is_mandatory_mo: false,
    is_mandatory_bo: false,
    input_allowed_flag: true,
    edit_allowed_flag: true,
    view_allowed_flag: true,
    read_only_flag: false,
    group_repetition_flag: false,
    is_attachment_field: false,
    masking_flag: false,
    audit_track_changes_flag: false,
    swift_tag_required_flag: false,
    swift_tag_display_flag: false,
    sanction_check_required_flag: false,
    limit_check_required_flag: false,
    ui_row_span: 1,
    ui_column_span: 1,
  });
  const { toast } = useToast();
  const isReadOnly = mode === "view";

  useEffect(() => {
    if (field) {
      setFormData(field);
    } else {
      setFormData({
        is_active_flag: true,
        effective_from_date: new Date().toISOString().split('T')[0],
        config_version: 1,
        channel_customer_portal_flag: false,
        channel_middle_office_flag: false,
        channel_back_office_flag: false,
        is_mandatory_portal: false,
        is_mandatory_mo: false,
        is_mandatory_bo: false,
        input_allowed_flag: true,
        edit_allowed_flag: true,
        view_allowed_flag: true,
        read_only_flag: false,
        group_repetition_flag: false,
        is_attachment_field: false,
        masking_flag: false,
        audit_track_changes_flag: false,
        swift_tag_required_flag: false,
        swift_tag_display_flag: false,
        sanction_check_required_flag: false,
        limit_check_required_flag: false,
        ui_row_span: 1,
        ui_column_span: 1,
      });
    }
  }, [field, open]);

  const handleSubmit = async () => {
    try {
      if (!formData.field_id || !formData.product_code || !formData.effective_from_date) {
        toast({
          title: "Validation Error",
          description: "Field ID, Product Code, and Effective From Date are required",
          variant: "destructive",
        });
        return;
      }

      const userId = "temp-user-id"; // TODO: Get from auth context
      
      if (mode === "add") {
        await createProductField(formData as ProductField, userId);
        toast({
          title: "Success",
          description: "Field created successfully",
        });
      } else {
        await updateProductField(field!.id!, formData, userId);
        toast({
          title: "Success",
          description: "Field updated successfully",
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Field" : mode === "edit" ? "Edit Field" : "View Field"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="ui">UI & Layout</TabsTrigger>
            <TabsTrigger value="data">Data Props</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field_id">Field ID *</Label>
                <Input
                  id="field_id"
                  value={formData.field_id || ""}
                  onChange={(e) => setFormData({ ...formData, field_id: e.target.value })}
                  disabled={isReadOnly || mode === "edit"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_code">Field Code</Label>
                <Input
                  id="field_code"
                  value={formData.field_code || ""}
                  onChange={(e) => setFormData({ ...formData, field_code: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_code">Product Code *</Label>
                <Select
                  value={formData.product_code || ""}
                  onValueChange={(value) => setFormData({ ...formData, product_code: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ILC">Import LC</SelectItem>
                    <SelectItem value="ELC">Export LC</SelectItem>
                    <SelectItem value="OBG">Outward Bank Guarantee</SelectItem>
                    <SelectItem value="IBG">Inward Bank Guarantee</SelectItem>
                    <SelectItem value="DC">Documentary Collection</SelectItem>
                    <SelectItem value="SG">Shipping Guarantee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <Select
                  value={formData.event_type || ""}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ISSUE">Issue</SelectItem>
                    <SelectItem value="AMEND">Amendment</SelectItem>
                    <SelectItem value="CANCEL">Cancellation</SelectItem>
                    <SelectItem value="COMMON">Common</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Input
                  id="stage"
                  value={formData.stage || ""}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_label_key">Field Label Key</Label>
                <Input
                  id="field_label_key"
                  value={formData.field_label_key || ""}
                  onChange={(e) => setFormData({ ...formData, field_label_key: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="field_tooltip_key">Field Tooltip Key</Label>
                <Input
                  id="field_tooltip_key"
                  value={formData.field_tooltip_key || ""}
                  onChange={(e) => setFormData({ ...formData, field_tooltip_key: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Channel Flags</Label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.channel_customer_portal_flag}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, channel_customer_portal_flag: checked })
                    }
                    disabled={isReadOnly}
                  />
                  <Label>Customer Portal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.channel_middle_office_flag}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, channel_middle_office_flag: checked })
                    }
                    disabled={isReadOnly}
                  />
                  <Label>Middle Office</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.channel_back_office_flag}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, channel_back_office_flag: checked })
                    }
                    disabled={isReadOnly}
                  />
                  <Label>Back Office</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ui" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pane_code">Pane Code</Label>
                <Input
                  id="pane_code"
                  value={formData.pane_code || ""}
                  onChange={(e) => setFormData({ ...formData, pane_code: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section_code">Section Code</Label>
                <Input
                  id="section_code"
                  value={formData.section_code || ""}
                  onChange={(e) => setFormData({ ...formData, section_code: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pane_display_sequence">Pane Display Sequence</Label>
                <Input
                  id="pane_display_sequence"
                  type="number"
                  value={formData.pane_display_sequence || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, pane_display_sequence: parseInt(e.target.value) || 0 })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section_display_sequence">Section Display Sequence</Label>
                <Input
                  id="section_display_sequence"
                  type="number"
                  value={formData.section_display_sequence || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, section_display_sequence: parseInt(e.target.value) || 0 })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_display_sequence">Field Display Sequence</Label>
                <Input
                  id="field_display_sequence"
                  type="number"
                  value={formData.field_display_sequence || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, field_display_sequence: parseInt(e.target.value) || 0 })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ui_display_type">UI Display Type</Label>
                <Select
                  value={formData.ui_display_type || ""}
                  onValueChange={(value) => setFormData({ ...formData, ui_display_type: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select UI type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXTBOX">Text Box</SelectItem>
                    <SelectItem value="TEXTAREA">Text Area</SelectItem>
                    <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                    <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                    <SelectItem value="RADIO">Radio Button</SelectItem>
                    <SelectItem value="DATE">Date Picker</SelectItem>
                    <SelectItem value="NUMBER">Number</SelectItem>
                    <SelectItem value="FILE">File Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ui_row_span">UI Row Span</Label>
                <Input
                  id="ui_row_span"
                  type="number"
                  value={formData.ui_row_span || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, ui_row_span: parseInt(e.target.value) || 1 })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ui_column_span">UI Column Span</Label>
                <Input
                  id="ui_column_span"
                  type="number"
                  value={formData.ui_column_span || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, ui_column_span: parseInt(e.target.value) || 1 })
                  }
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_type">Data Type</Label>
                <Select
                  value={formData.data_type || ""}
                  onValueChange={(value) => setFormData({ ...formData, data_type: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STRING">String</SelectItem>
                    <SelectItem value="NUMERIC">Numeric</SelectItem>
                    <SelectItem value="DATE">Date</SelectItem>
                    <SelectItem value="BOOLEAN">Boolean</SelectItem>
                    <SelectItem value="ARRAY">Array</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lookup_code">Lookup Code</Label>
                <Input
                  id="lookup_code"
                  value={formData.lookup_code || ""}
                  onChange={(e) => setFormData({ ...formData, lookup_code: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length_min">Minimum Length</Label>
                <Input
                  id="length_min"
                  type="number"
                  value={formData.length_min || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, length_min: parseInt(e.target.value) || undefined })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length_max">Maximum Length</Label>
                <Input
                  id="length_max"
                  type="number"
                  value={formData.length_max || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, length_max: parseInt(e.target.value) || undefined })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decimal_places">Decimal Places</Label>
                <Input
                  id="decimal_places"
                  type="number"
                  value={formData.decimal_places || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, decimal_places: parseInt(e.target.value) || undefined })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size_standard_source">Size Standard Source</Label>
                <Select
                  value={formData.size_standard_source || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, size_standard_source: value })
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SWIFT">SWIFT</SelectItem>
                    <SelectItem value="INTERNAL">Internal</SelectItem>
                    <SelectItem value="ISO20022">ISO 20022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="default_value">Default Value</Label>
                <Input
                  id="default_value"
                  value={formData.default_value || ""}
                  onChange={(e) => setFormData({ ...formData, default_value: e.target.value })}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Mandatory Flags</Label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_mandatory_portal}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_mandatory_portal: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Portal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_mandatory_mo}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_mandatory_mo: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Middle Office</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_mandatory_bo}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_mandatory_bo: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Back Office</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Permission Flags</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.input_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, input_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Input Allowed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.edit_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, edit_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Edit Allowed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.view_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, view_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>View Allowed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.read_only_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, read_only_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Read Only</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effective_from_date">Effective From *</Label>
                <Input
                  id="effective_from_date"
                  type="date"
                  value={formData.effective_from_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, effective_from_date: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effective_to_date">Effective To</Label>
                <Input
                  id="effective_to_date"
                  type="date"
                  value={formData.effective_to_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, effective_to_date: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config_version">Config Version</Label>
                <Input
                  id="config_version"
                  type="number"
                  value={formData.config_version || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, config_version: parseInt(e.target.value) || 1 })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  checked={formData.is_active_flag}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active_flag: checked })
                  }
                  disabled={isReadOnly}
                />
                <Label>Is Active</Label>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="validation_rule_set_id">Validation Rule Set ID</Label>
                <Input
                  id="validation_rule_set_id"
                  value={formData.validation_rule_set_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, validation_rule_set_id: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="conditional_visibility_expr">Conditional Visibility Expression</Label>
                <Textarea
                  id="conditional_visibility_expr"
                  value={formData.conditional_visibility_expr || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, conditional_visibility_expr: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="computed_expression">Computed Expression</Label>
                <Textarea
                  id="computed_expression"
                  value={formData.computed_expression || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, computed_expression: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {!isReadOnly && (
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {mode === "add" ? "Create Field" : "Update Field"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
