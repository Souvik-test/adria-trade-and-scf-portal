import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DynamicFieldDefinition } from '@/types/dynamicForm';

interface DynamicFieldRendererProps {
  field: DynamicFieldDefinition;
  value: any;
  onChange: (fieldCode: string, value: any) => void;
  disabled?: boolean;
  channel?: 'portal' | 'mo' | 'bo';
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  value,
  onChange,
  disabled = false,
  channel = 'portal',
}) => {
  // Check if field is mandatory based on channel
  const isMandatory = 
    (channel === 'portal' && field.is_mandatory_portal) ||
    (channel === 'mo' && field.is_mandatory_mo) ||
    (channel === 'bo' && field.is_mandatory_bo);

  const handleChange = (newValue: any) => {
    onChange(field.field_code, newValue);
  };

  const renderLabel = () => (
    <div className="flex items-center gap-1 mb-1">
      <Label htmlFor={field.field_code} className="text-sm font-medium">
        {field.field_label_key}
        {isMandatory && <span className="text-destructive ml-1">*</span>}
      </Label>
      {field.field_tooltip_key && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{field.field_tooltip_key}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  const renderField = () => {
    switch (field.ui_display_type) {
      case 'TEXTBOX':
        return (
          <Input
            id={field.field_code}
            value={value || field.default_value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder={field.field_label_key}
            maxLength={field.length_max || undefined}
            className="h-9"
          />
        );

      case 'TEXTAREA':
        return (
          <Textarea
            id={field.field_code}
            value={value || field.default_value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder={field.field_label_key}
            maxLength={field.length_max || undefined}
            className="min-h-[80px] resize-y"
          />
        );

      case 'NUMBER':
        return (
          <Input
            id={field.field_code}
            type="number"
            value={value ?? field.default_value ?? ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : null)}
            disabled={disabled}
            placeholder={field.field_label_key}
            step={field.decimal_places ? Math.pow(10, -field.decimal_places) : 1}
            className="h-9"
          />
        );

      case 'DROPDOWN':
      case 'ENUM':
        const options = field.dropdown_values || [];
        return (
          <Select
            value={value || field.default_value || ''}
            onValueChange={handleChange}
            disabled={disabled}
          >
            <SelectTrigger id={field.field_code} className="h-9">
              <SelectValue placeholder={`Select ${field.field_label_key}`} />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'DATEPICKER':
        const dateValue = value ? new Date(value) : undefined;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn(
                  'w-full justify-start text-left font-normal h-9',
                  !value && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, 'PPP') : field.field_label_key}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-50">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => handleChange(date?.toISOString().split('T')[0])}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'CHECKBOX':
        return (
          <div className="flex items-center space-x-2 h-9">
            <Checkbox
              id={field.field_code}
              checked={!!value}
              onCheckedChange={handleChange}
              disabled={disabled}
            />
            <label
              htmlFor={field.field_code}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.field_label_key}
            </label>
          </div>
        );

      case 'RADIO':
        const radioOptions = field.dropdown_values || [];
        return (
          <div className="flex flex-wrap gap-4">
            {radioOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.field_code}_${option}`}
                  name={field.field_code}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 text-primary"
                />
                <label
                  htmlFor={`${field.field_code}_${option}`}
                  className="text-sm"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            id={field.field_code}
            value={value || field.default_value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder={field.field_label_key}
            className="h-9"
          />
        );
    }
  };

  // Don't render label for checkbox (it's inline)
  if (field.ui_display_type === 'CHECKBOX') {
    return <div className="w-full">{renderField()}</div>;
  }

  return (
    <div className="w-full">
      {renderLabel()}
      {renderField()}
    </div>
  );
};

export default DynamicFieldRenderer;
