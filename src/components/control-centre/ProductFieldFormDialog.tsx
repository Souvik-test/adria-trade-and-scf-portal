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
  const getInitialFormData = () => ({
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
  
  const [formData, setFormData] = useState<Partial<ProductField>>(getInitialFormData());
  const { toast } = useToast();
  const isReadOnly = mode === "view";

  useEffect(() => {
    if (field) {
      setFormData(field);
    } else {
      setFormData(getInitialFormData());
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
            <TabsTrigger value="ui">UI Layout</TabsTrigger>
            <TabsTrigger value="data">Data Props</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="more">More...</TabsTrigger>
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

          <TabsContent value="permissions" className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-6 gap-4 mb-3">
                  <div className="font-semibold">Channel</div>
                  <div className="text-center font-semibold">Mandatory</div>
                  <div className="text-center font-semibold">Input</div>
                  <div className="text-center font-semibold">Edit</div>
                  <div className="text-center font-semibold">View</div>
                  <div className="text-center font-semibold">Read Only</div>
                </div>
                
                {/* Customer Portal Row */}
                <div className="grid grid-cols-6 gap-4 items-center py-3 border-t">
                  <Label>Customer Portal</Label>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.is_mandatory_portal}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_mandatory_portal: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.input_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, input_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.edit_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, edit_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.view_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, view_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.read_only_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, read_only_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                {/* Middle Office Row */}
                <div className="grid grid-cols-6 gap-4 items-center py-3 border-t">
                  <Label>Middle Office</Label>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.is_mandatory_mo}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_mandatory_mo: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.input_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, input_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.edit_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, edit_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.view_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, view_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.read_only_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, read_only_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                {/* Back Office Row */}
                <div className="grid grid-cols-6 gap-4 items-center py-3 border-t">
                  <Label>Back Office</Label>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.is_mandatory_bo}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_mandatory_bo: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.input_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, input_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.edit_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, edit_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.view_allowed_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, view_allowed_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={formData.read_only_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, read_only_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Input, Edit, View, and Read Only permissions are currently global across all channels.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="more" className="space-y-4">
            <Tabs defaultValue="logic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="logic">Logic</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="swift">SWIFT</TabsTrigger>
                <TabsTrigger value="sanctions">Sanctions</TabsTrigger>
                <TabsTrigger value="config">Config</TabsTrigger>
              </TabsList>

              <TabsContent value="logic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conditional_mandatory_expr">Conditional Mandatory Expression</Label>
                    <Textarea
                      id="conditional_mandatory_expr"
                      value={formData.conditional_mandatory_expr || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, conditional_mandatory_expr: e.target.value })
                      }
                      disabled={isReadOnly}
                      placeholder="Expression to determine if field is mandatory"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conditional_visibility_expr">Conditional Visibility Expression</Label>
                    <Textarea
                      id="conditional_visibility_expr"
                      value={formData.conditional_visibility_expr || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, conditional_visibility_expr: e.target.value })
                      }
                      disabled={isReadOnly}
                      placeholder="Expression to determine if field is visible"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="computed_expression">Computed Expression</Label>
                    <Textarea
                      id="computed_expression"
                      value={formData.computed_expression || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, computed_expression: e.target.value })
                      }
                      disabled={isReadOnly}
                      placeholder="Expression to compute field value"
                    />
                  </div>
                  <div className="space-y-2">
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
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="group_id">Group ID</Label>
                    <Input
                      id="group_id"
                      value={formData.group_id || ""}
                      onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.group_repetition_flag}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, group_repetition_flag: checked })
                        }
                        disabled={isReadOnly}
                      />
                      <Label>Group Repetition</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_attachment_field}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_attachment_field: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Is Attachment Field</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.masking_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, masking_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Masking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.audit_track_changes_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, audit_track_changes_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Audit Track Changes</Label>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow_role_access">Workflow Role Access (JSON)</Label>
                    <Textarea
                      id="workflow_role_access"
                      value={
                        formData.workflow_role_access
                          ? JSON.stringify(formData.workflow_role_access, null, 2)
                          : ""
                      }
                      onChange={(e) => {
                        try {
                          const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                          setFormData({ ...formData, workflow_role_access: parsed });
                        } catch (err) {
                          // Invalid JSON, keep existing value
                        }
                      }}
                      disabled={isReadOnly}
                      placeholder='{"maker": true, "checker": true}'
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="swift" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="swift_mt_type">SWIFT MT Type</Label>
                    <Input
                      id="swift_mt_type"
                      value={formData.swift_mt_type || ""}
                      onChange={(e) => setFormData({ ...formData, swift_mt_type: e.target.value })}
                      disabled={isReadOnly}
                      placeholder="e.g., MT700, MT707"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swift_sequence">SWIFT Sequence</Label>
                    <Input
                      id="swift_sequence"
                      value={formData.swift_sequence || ""}
                      onChange={(e) => setFormData({ ...formData, swift_sequence: e.target.value })}
                      disabled={isReadOnly}
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swift_tag">SWIFT Tag</Label>
                    <Input
                      id="swift_tag"
                      value={formData.swift_tag || ""}
                      onChange={(e) => setFormData({ ...formData, swift_tag: e.target.value })}
                      disabled={isReadOnly}
                      placeholder="e.g., 40A, 50, 59"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swift_subfield_qualifier">SWIFT Subfield Qualifier</Label>
                    <Input
                      id="swift_subfield_qualifier"
                      value={formData.swift_subfield_qualifier || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, swift_subfield_qualifier: e.target.value })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="swift_format_pattern">SWIFT Format Pattern</Label>
                    <Input
                      id="swift_format_pattern"
                      value={formData.swift_format_pattern || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, swift_format_pattern: e.target.value })
                      }
                      disabled={isReadOnly}
                      placeholder="e.g., 3!a15d"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.swift_tag_required_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, swift_tag_required_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>SWIFT Tag Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.swift_tag_display_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, swift_tag_display_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>SWIFT Tag Display</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sanctions" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.sanction_check_required_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, sanction_check_required_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Sanction Check Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.limit_check_required_flag}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, limit_check_required_flag: checked })
                      }
                      disabled={isReadOnly}
                    />
                    <Label>Limit Check Required</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sanction_field_category">Sanction Field Category</Label>
                    <Select
                      value={formData.sanction_field_category || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, sanction_field_category: value })
                      }
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NAME">Name</SelectItem>
                        <SelectItem value="ADDRESS">Address</SelectItem>
                        <SelectItem value="COUNTRY">Country</SelectItem>
                        <SelectItem value="ACCOUNT">Account</SelectItem>
                        <SelectItem value="IDENTIFIER">Identifier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sanction_party_role">Sanction Party Role</Label>
                    <Select
                      value={formData.sanction_party_role || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, sanction_party_role: value })
                      }
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPLICANT">Applicant</SelectItem>
                        <SelectItem value="BENEFICIARY">Beneficiary</SelectItem>
                        <SelectItem value="ADVISING_BANK">Advising Bank</SelectItem>
                        <SelectItem value="ISSUING_BANK">Issuing Bank</SelectItem>
                        <SelectItem value="CONFIRMING_BANK">Confirming Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="sanction_engine_field_map">Sanction Engine Field Map</Label>
                    <Input
                      id="sanction_engine_field_map"
                      value={formData.sanction_engine_field_map || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, sanction_engine_field_map: e.target.value })
                      }
                      disabled={isReadOnly}
                      placeholder="Mapping key for sanction engine"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="limit_dimension_type">Limit Dimension Type</Label>
                    <Select
                      value={formData.limit_dimension_type || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, limit_dimension_type: value })
                      }
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dimension" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AMOUNT">Amount</SelectItem>
                        <SelectItem value="TENOR">Tenor</SelectItem>
                        <SelectItem value="COUNTRY">Country</SelectItem>
                        <SelectItem value="CURRENCY">Currency</SelectItem>
                        <SelectItem value="PARTY">Party</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="config" className="space-y-4 mt-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="error_message_key">Error Message Key</Label>
                    <Input
                      id="error_message_key"
                      value={formData.error_message_key || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, error_message_key: e.target.value })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="help_content_type">Help Content Type</Label>
                    <Select
                      value={formData.help_content_type || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, help_content_type: value })
                      }
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INLINE_TEXT">Inline Text</SelectItem>
                        <SelectItem value="LINK">Link</SelectItem>
                        <SelectItem value="DOC_ID">Document ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="help_content_ref">Help Content Reference</Label>
                    <Textarea
                      id="help_content_ref"
                      value={formData.help_content_ref || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, help_content_ref: e.target.value })
                      }
                      disabled={isReadOnly}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iso20022_element_code">ISO 20022 Element Code</Label>
                    <Input
                      id="iso20022_element_code"
                      value={formData.iso20022_element_code || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, iso20022_element_code: e.target.value })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iso_data_format_pattern">ISO Data Format Pattern</Label>
                    <Input
                      id="iso_data_format_pattern"
                      value={formData.iso_data_format_pattern || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, iso_data_format_pattern: e.target.value })
                      }
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="ai_mapping_key">AI Mapping Key</Label>
                    <Input
                      id="ai_mapping_key"
                      value={formData.ai_mapping_key || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, ai_mapping_key: e.target.value })
                      }
                      disabled={isReadOnly}
                      placeholder="Key for AI-based field mapping"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
