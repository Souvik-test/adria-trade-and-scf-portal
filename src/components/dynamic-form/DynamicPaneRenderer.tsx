import React, { useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PaneFields, DynamicFormData, RepeatableGroupInstance, DynamicFieldDefinition } from '@/types/dynamicForm';
import DynamicSectionRenderer from './DynamicSectionRenderer';

interface DynamicPaneRendererProps {
  panes: PaneFields[];
  formData: DynamicFormData;
  repeatableGroups: { [groupId: string]: RepeatableGroupInstance[] };
  onFieldChange: (fieldCode: string, value: any) => void;
  onRepeatableFieldChange: (groupId: string, instanceId: string, fieldCode: string, value: any) => void;
  onAddRepeatableInstance: (groupId: string) => void;
  onRemoveRepeatableInstance: (groupId: string, instanceId: string) => void;
  disabled?: boolean;
  expandedPanes?: string[];
  onPaneToggle?: (paneCode: string) => void;
}

const DynamicPaneRenderer: React.FC<DynamicPaneRendererProps> = ({
  panes,
  formData,
  repeatableGroups,
  onFieldChange,
  onRepeatableFieldChange,
  onAddRepeatableInstance,
  onRemoveRepeatableInstance,
  disabled = false,
  expandedPanes,
  onPaneToggle,
}) => {
  // Default to all panes expanded
  const defaultExpanded = panes.map(p => p.paneCode);
  const expandedValue = expandedPanes || defaultExpanded;

  // Collect all fields from all panes for cross-field computed value evaluation
  const allFields: DynamicFieldDefinition[] = useMemo(() => {
    return panes.flatMap(pane => 
      pane.sections.flatMap(section => 
        section.groups.flatMap(group => group.fields)
      )
    );
  }, [panes]);

  return (
    <Accordion
      type="multiple"
      value={expandedValue}
      onValueChange={(value) => {
        // Handle individual pane toggles if callback provided
        if (onPaneToggle) {
          const changed = value.length > expandedValue.length
            ? value.find(v => !expandedValue.includes(v))
            : expandedValue.find(v => !value.includes(v));
          if (changed) onPaneToggle(changed);
        }
      }}
      className="space-y-4"
    >
      {panes.map((pane) => (
        <AccordionItem
          key={pane.paneCode}
          value={pane.paneCode}
          className="border rounded-lg bg-card overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted/70 hover:no-underline">
            <span className="text-base font-semibold">{pane.paneName}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-4 space-y-4">
            {pane.sections.map((section) => (
              <DynamicSectionRenderer
                key={section.sectionCode}
                section={section}
                formData={formData}
                repeatableGroups={repeatableGroups}
                onFieldChange={onFieldChange}
                onRepeatableFieldChange={onRepeatableFieldChange}
                onAddRepeatableInstance={onAddRepeatableInstance}
                onRemoveRepeatableInstance={onRemoveRepeatableInstance}
                disabled={disabled}
                allFields={allFields}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default DynamicPaneRenderer;
