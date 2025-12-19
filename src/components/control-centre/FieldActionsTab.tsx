import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FieldActions, FieldActionTrigger } from '@/types/dynamicForm';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FieldActionsTabProps {
  fieldActions: FieldActions | null | undefined;
  onChange: (actions: FieldActions | null) => void;
  isReadOnly?: boolean;
  availableFields?: { code: string; label: string }[];
}

const FieldActionsTab: React.FC<FieldActionsTabProps> = ({
  fieldActions,
  onChange,
  isReadOnly = false,
  availableFields = [],
}) => {
  const [actions, setActions] = useState<FieldActions>(fieldActions || {});

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

  return (
    <div className="space-y-6">
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
                  <p>Enable this to make the field auto-calculate its value based on other fields. Use field codes in the formula (e.g., LC_AMOUNT + ADDITIONAL_AMOUNT).</p>
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
            <div className="space-y-2">
              <Label htmlFor="computed_formula">Computed Formula</Label>
              <Textarea
                id="computed_formula"
                placeholder="e.g., LC_AMOUNT + (TOLERANCE_PERCENT * LC_AMOUNT / 100) + ADDITIONAL_AMOUNT"
                value={actions.computed_formula || ''}
                onChange={(e) => updateActions({ computed_formula: e.target.value })}
                disabled={isReadOnly}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use field codes (e.g., LC_AMOUNT, TOLERANCE_PERCENT) separated by operators (+, -, *, /)
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
                    <p className="text-xs text-muted-foreground">Field codes, comma-separated</p>
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
                    <p className="text-xs text-muted-foreground">Field codes, comma-separated</p>
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
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldActionsTab;