import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Info, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FieldActions, FieldActionTrigger } from '@/types/dynamicForm';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FieldActionsTabProps {
  fieldActions: FieldActions | null | undefined;
  onChange: (actions: FieldActions | null) => void;
  isReadOnly?: boolean;
  availableFields?: { code: string; label: string }[];
}

// Helper to normalize field code to UPPERCASE_UNDERSCORE format
const normalizeFieldCode = (code: string): string => {
  return code.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
};

const OPERATORS = [
  { label: '+', value: ' + ' },
  { label: '-', value: ' - ' },
  { label: '×', value: ' * ' },
  { label: '÷', value: ' / ' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
];

const FieldActionsTab: React.FC<FieldActionsTabProps> = ({
  fieldActions,
  onChange,
  isReadOnly = false,
  availableFields = [],
}) => {
  const [actions, setActions] = useState<FieldActions>(fieldActions || {});
  const [showFieldPicker, setShowFieldPicker] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const formulaInputRef = useRef<HTMLInputElement>(null);

  const updateActions = (updates: Partial<FieldActions>) => {
    const newActions = { ...actions, ...updates };
    setActions(newActions);
    onChange(newActions);
  };

  const addTrigger = () => {
    const newTrigger: FieldActionTrigger = {
      when_value: [],
      show_fields: [],
      hide_fields: [],
      filter_dropdowns: {},
    };
    const triggers = [...(actions.triggers || []), newTrigger];
    updateActions({ triggers });
  };

  const updateTrigger = (index: number, updates: Partial<FieldActionTrigger>) => {
    const triggers = [...(actions.triggers || [])];
    triggers[index] = { ...triggers[index], ...updates };
    updateActions({ triggers });
  };

  const removeTrigger = (index: number) => {
    const triggers = (actions.triggers || []).filter((_, i) => i !== index);
    updateActions({ triggers });
  };

  const parseCommaSeparated = (value: string): string[] => {
    return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(normalizeFieldCode(code));
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Insert field code or operator at cursor position in formula
  const insertIntoFormula = (text: string) => {
    const currentFormula = actions.computed_formula || '';
    const input = formulaInputRef.current;
    
    if (input) {
      const start = input.selectionStart || currentFormula.length;
      const end = input.selectionEnd || currentFormula.length;
      const newFormula = currentFormula.slice(0, start) + text + currentFormula.slice(end);
      updateActions({ computed_formula: newFormula });
      
      // Set cursor position after inserted text
      setTimeout(() => {
        input.focus();
        const newPos = start + text.length;
        input.setSelectionRange(newPos, newPos);
      }, 0);
    } else {
      updateActions({ computed_formula: currentFormula + text });
    }
  };

  const handleFieldSelect = (fieldCode: string) => {
    const normalizedCode = normalizeFieldCode(fieldCode);
    insertIntoFormula(normalizedCode);
  };

  const clearFormula = () => {
    updateActions({ computed_formula: '' });
    formulaInputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Available Fields Reference */}
      {availableFields.length > 0 && (
        <Collapsible open={showFieldPicker} onOpenChange={setShowFieldPicker}>
          <Card className="border-dashed border-primary/30 bg-primary/5">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-2 cursor-pointer hover:bg-primary/10 transition-colors rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Available Field Codes ({availableFields.length} fields)
                  </CardTitle>
                  {showFieldPicker ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to {showFieldPicker ? 'hide' : 'show'} field codes you can use in formulas and triggers
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2">
                <ScrollArea className="h-48">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableFields.map((field) => (
                      <div
                        key={field.code}
                        className="flex items-center justify-between p-2 rounded-md bg-background border hover:border-primary/50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <code className="text-xs font-mono text-primary font-medium">
                            {field.code}
                          </code>
                          <p className="text-xs text-muted-foreground truncate">
                            {field.label}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(field.code)}
                        >
                          {copiedCode === field.code ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Computed Field Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Computed Field Configuration
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Enable this to make the field auto-calculate its value based on other fields. Select fields from dropdown and use operator buttons to build your formula.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              checked={actions.is_computed || false}
              onCheckedChange={(checked) => updateActions({ is_computed: checked })}
              disabled={isReadOnly}
            />
            <Label>Is Computed Field (Read-Only, Auto-Calculated)</Label>
          </div>

          {actions.is_computed && (
            <div className="space-y-4">
              <Label>Formula Builder</Label>
              
              {/* Field Selector and Operator Buttons */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border">
                {/* Field Dropdown */}
                <Select
                  onValueChange={handleFieldSelect}
                  disabled={isReadOnly || availableFields.length === 0}
                >
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue placeholder="Select field..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <ScrollArea className="h-[200px]">
                      {availableFields.map((field) => (
                        <SelectItem key={field.code} value={field.code}>
                          <div className="flex flex-col items-start">
                            <span className="font-mono text-xs text-primary">
                              {normalizeFieldCode(field.code)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {field.label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>

                <div className="h-6 w-px bg-border mx-1" />

                {/* Operator Buttons */}
                {OPERATORS.map((op) => (
                  <Button
                    key={op.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 font-mono text-base"
                    onClick={() => insertIntoFormula(op.value)}
                    disabled={isReadOnly}
                  >
                    {op.label}
                  </Button>
                ))}

                <div className="h-6 w-px bg-border mx-1" />

                {/* Clear Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={clearFormula}
                  disabled={isReadOnly}
                >
                  Clear
                </Button>
              </div>

              {/* Formula Input */}
              <div className="space-y-2">
                <Label htmlFor="computed_formula" className="text-xs text-muted-foreground">
                  Formula (you can also type directly)
                </Label>
                <Input
                  ref={formulaInputRef}
                  id="computed_formula"
                  placeholder="Select fields and operators above, or type directly..."
                  value={actions.computed_formula || ''}
                  onChange={(e) => updateActions({ computed_formula: e.target.value })}
                  disabled={isReadOnly}
                  className="font-mono text-sm h-10"
                />
              </div>

              {/* Formula Preview */}
              {actions.computed_formula && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Formula Preview:</p>
                  <code className="text-sm font-mono text-primary">
                    {actions.computed_formula}
                  </code>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                💡 Tip: Select a field from the dropdown to insert it, then click operators to build your formula.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditional Actions Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Conditional Field Actions
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Define actions that happen when THIS field has specific values. You can show/hide other fields or filter dropdown options in other fields.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            {!isReadOnly && (
              <Button variant="outline" size="sm" onClick={addTrigger}>
                <Plus className="h-4 w-4 mr-1" />
                Add Trigger
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(!actions.triggers || actions.triggers.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No conditional actions defined. Add a trigger to configure field interactions.
            </p>
          )}

          {actions.triggers?.map((trigger, index) => (
            <Card key={index} className="bg-muted/30">
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Trigger {index + 1}</Badge>
                  {!isReadOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrigger(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>When this field has value(s):</Label>
                  <Input
                    placeholder="e.g., Acceptance, Deferred (comma-separated)"
                    value={trigger.when_value?.join(', ') || ''}
                    onChange={(e) =>
                      updateTrigger(index, { when_value: parseCommaSeparated(e.target.value) })
                    }
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Show these fields:</Label>
                    <Input
                      placeholder="e.g., ACCEPTANCE_PERIOD, NARRATIVE"
                      value={trigger.show_fields?.join(', ') || ''}
                      onChange={(e) =>
                        updateTrigger(index, { show_fields: parseCommaSeparated(e.target.value) })
                      }
                      disabled={isReadOnly}
                    />
                    <p className="text-xs text-muted-foreground">
                      Field codes, comma-separated
                      {availableFields.length > 0 && ' (see list above)'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Hide these fields:</Label>
                    <Input
                      placeholder="e.g., SIGHT_PAYMENT_DETAILS"
                      value={trigger.hide_fields?.join(', ') || ''}
                      onChange={(e) =>
                        updateTrigger(index, { hide_fields: parseCommaSeparated(e.target.value) })
                      }
                      disabled={isReadOnly}
                    />
                    <p className="text-xs text-muted-foreground">
                      Field codes, comma-separated
                      {availableFields.length > 0 && ' (see list above)'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Filter dropdown options in other fields:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Target field code"
                      value={Object.keys(trigger.filter_dropdowns || {})[0] || ''}
                      onChange={(e) => {
                        const oldKey = Object.keys(trigger.filter_dropdowns || {})[0];
                        const oldValues = trigger.filter_dropdowns?.[oldKey] || [];
                        const newFilter: { [key: string]: string[] } = {};
                        if (e.target.value) {
                          newFilter[e.target.value] = oldValues;
                        }
                        updateTrigger(index, { filter_dropdowns: newFilter });
                      }}
                      disabled={isReadOnly}
                    />
                    <Input
                      placeholder="Allowed values (comma-separated)"
                      value={Object.values(trigger.filter_dropdowns || {})[0]?.join(', ') || ''}
                      onChange={(e) => {
                        const key = Object.keys(trigger.filter_dropdowns || {})[0];
                        if (key) {
                          const newFilter: { [key: string]: string[] } = {
                            [key]: parseCommaSeparated(e.target.value),
                          };
                          updateTrigger(index, { filter_dropdowns: newFilter });
                        }
                      }}
                      disabled={isReadOnly}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When this field's value matches, filter the target dropdown to show only allowed values
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Dropdown Filter Source Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Dropdown Filter Source
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>If this field's dropdown options should be filtered based on another field's value, specify the source field code here.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Source Field Code</Label>
            <Input
              placeholder="e.g., LC_TYPE (the field that controls this dropdown)"
              value={actions.dropdown_filter_source || ''}
              onChange={(e) => updateActions({ dropdown_filter_source: e.target.value || undefined })}
              disabled={isReadOnly}
            />
            <p className="text-xs text-muted-foreground">
              The source field must have triggers configured with filter_dropdowns pointing to this field
              {availableFields.length > 0 && '. See available field codes above.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldActionsTab;