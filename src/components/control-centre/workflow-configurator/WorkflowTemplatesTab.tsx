import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Settings, Copy, Trash2, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { toast } from 'sonner';
import type { WorkflowTemplate } from '../NextGenWorkflowConfigurator';

interface WorkflowTemplatesTabProps {
  onTemplateSelect: (template: WorkflowTemplate, viewOnly?: boolean) => void;
}

const MODULE_OPTIONS = [
  { code: 'TF', name: 'Trade Finance' },
  { code: 'SCF', name: 'Supply Chain Finance' },
];

const PRODUCT_OPTIONS: Record<string, { code: string; name: string }[]> = {
  TF: [
    { code: 'ILC', name: 'Import Letter of Credit' },
    { code: 'ELC', name: 'Export Letter of Credit' },
    { code: 'IBG', name: 'Inward Bank Guarantee' },
    { code: 'OBG', name: 'Outward Bank Guarantee' },
    { code: 'IDC', name: 'Inward Documentary Collection' },
    { code: 'ODC', name: 'Outward Documentary Collection' },
    { code: 'SHG', name: 'Shipping Guarantee' },
  ],
  SCF: [
    { code: 'RF', name: 'Receivables Finance' },
    { code: 'PF', name: 'Payables Finance' },
    { code: 'DF', name: 'Dealer Finance' },
  ],
};

const EVENT_OPTIONS: Record<string, { code: string; name: string }[]> = {
  ILC: [
    { code: 'ISS', name: 'Issuance' },
    { code: 'AMD', name: 'Amendment' },
    { code: 'CAN', name: 'Cancellation' },
    { code: 'EXP', name: 'Expiry' },
  ],
  ELC: [
    { code: 'ADV', name: 'Advising' },
    { code: 'TRF', name: 'Transfer' },
    { code: 'ASG', name: 'Assignment' },
    { code: 'EXP', name: 'Expiry' },
  ],
  IBG: [
    { code: 'RCV', name: 'Receive' },
    { code: 'AMD', name: 'Amendment' },
    { code: 'CLM', name: 'Claim' },
    { code: 'EXP', name: 'Expiry' },
  ],
  OBG: [
    { code: 'ISS', name: 'Issuance' },
    { code: 'AMD', name: 'Amendment' },
    { code: 'CAN', name: 'Cancellation' },
    { code: 'EXP', name: 'Expiry' },
  ],
  IDC: [
    { code: 'RCV', name: 'Receive' },
    { code: 'ACC', name: 'Accept' },
    { code: 'PAY', name: 'Payment' },
    { code: 'EXP', name: 'Expiry' },
  ],
  ODC: [
    { code: 'SUB', name: 'Submission' },
    { code: 'UPD', name: 'Update' },
    { code: 'EXP', name: 'Expiry' },
  ],
  SHG: [
    { code: 'ISS', name: 'Issuance' },
    { code: 'CAN', name: 'Cancellation' },
    { code: 'EXP', name: 'Expiry' },
  ],
  RF: [
    { code: 'REQ', name: 'Request' },
    { code: 'DIS', name: 'Disbursement' },
    { code: 'REP', name: 'Repayment' },
  ],
  PF: [
    { code: 'REQ', name: 'Request' },
    { code: 'DIS', name: 'Disbursement' },
    { code: 'REP', name: 'Repayment' },
  ],
  DF: [
    { code: 'REQ', name: 'Request' },
    { code: 'DIS', name: 'Disbursement' },
    { code: 'REP', name: 'Repayment' },
  ],
};

const TRIGGER_TYPES = [
  { id: 'Manual', label: 'Manual (Middle Office/Back Office)' },
  { id: 'ClientPortal', label: 'Client Portal' },
  { id: 'AutoBatch', label: 'Auto Batch' },
  { id: 'InwardSWIFT', label: 'Inward SWIFT' },
];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export function WorkflowTemplatesTab({ onTemplateSelect }: WorkflowTemplatesTabProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [templateName, setTemplateName] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [productCode, setProductCode] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [triggerTypes, setTriggerTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as WorkflowTemplate[]);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateName || !moduleCode || !productCode || !eventCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    const session = customAuth.getSession();
    if (!session?.user?.id) {
      toast.error('Please log in to create templates');
      return;
    }

    const moduleName = MODULE_OPTIONS.find(m => m.code === moduleCode)?.name || '';
    const productName = PRODUCT_OPTIONS[moduleCode]?.find(p => p.code === productCode)?.name || '';
    const eventName = EVENT_OPTIONS[productCode]?.find(e => e.code === eventCode)?.name || '';

    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .insert({
          user_id: session.user.id,
          template_name: templateName,
          module_code: moduleCode,
          module_name: moduleName,
          product_code: productCode,
          product_name: productName,
          event_code: eventCode,
          event_name: eventName,
          trigger_types: triggerTypes,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Template created successfully');
      setTemplates(prev => [data as WorkflowTemplate, ...prev]);
      
      // Reset form
      setTemplateName('');
      setModuleCode('');
      setProductCode('');
      setEventCode('');
      setTriggerTypes([]);
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workflow_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Template deleted successfully');
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleCopyTemplate = async (template: WorkflowTemplate) => {
    const session = customAuth.getSession();
    if (!session?.user?.id) {
      toast.error('Please log in to copy templates');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .insert({
          user_id: session.user.id,
          template_name: `${template.template_name} (Copy)`,
          module_code: template.module_code,
          module_name: template.module_name,
          product_code: template.product_code,
          product_name: template.product_name,
          event_code: template.event_code,
          event_name: template.event_name,
          trigger_types: template.trigger_types,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Template copied successfully');
      setTemplates(prev => [data as WorkflowTemplate, ...prev]);
    } catch (error) {
      console.error('Error copying template:', error);
      toast.error('Failed to copy template');
    }
  };

  const handleToggleTrigger = (triggerId: string) => {
    setTriggerTypes(prev =>
      prev.includes(triggerId)
        ? prev.filter(t => t !== triggerId)
        : [...prev, triggerId]
    );
  };

  const filteredTemplates = templates.filter(t =>
    t.template_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.event_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableProducts = moduleCode ? PRODUCT_OPTIONS[moduleCode] || [] : [];
  const availableEvents = productCode ? EVENT_OPTIONS[productCode] || [] : [];

  return (
    <div className="h-full flex gap-6 p-6">
      {/* Left Panel - Create Template Form */}
      <Card className="w-96 flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              placeholder="Enter template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module">Module *</Label>
            <Select value={moduleCode} onValueChange={(val) => {
              setModuleCode(val);
              setProductCode('');
              setEventCode('');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {MODULE_OPTIONS.map(m => (
                  <SelectItem key={m.code} value={m.code}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select value={productCode} onValueChange={(val) => {
              setProductCode(val);
              setEventCode('');
            }} disabled={!moduleCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map(p => (
                  <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event">Event *</Label>
            <Select value={eventCode} onValueChange={setEventCode} disabled={!productCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {availableEvents.map(e => (
                  <SelectItem key={e.code} value={e.code}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="cursor-help underline decoration-dotted">Trigger Types</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Originating Channel and Origination Method</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="grid grid-cols-1 gap-2">
              {TRIGGER_TYPES.map(trigger => (
                <div key={trigger.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={trigger.id}
                    checked={triggerTypes.includes(trigger.id)}
                    onCheckedChange={() => handleToggleTrigger(trigger.id)}
                  />
                  <label htmlFor={trigger.id} className="text-sm cursor-pointer">
                    {trigger.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleCreateTemplate} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </CardContent>
      </Card>

      {/* Right Panel - Existing Templates */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            {searchQuery ? 'No templates match your search' : 'No templates created yet'}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground truncate flex-1">
                        {template.template_name}
                      </h3>
                      <Badge className={STATUS_COLORS[template.status] || STATUS_COLORS.draft}>
                        {template.status}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1 mb-3">
                      <p>{template.product_name} • {template.event_name}</p>
                      <p className="text-xs">
                        {template.trigger_types?.join(', ') || 'No triggers'}
                      </p>
                      <p className="text-xs">
                        Created: {new Date(template.created_at).toLocaleDateString()}
                      </p>
                    </div>

                      <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTemplateSelect(template, false)}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onTemplateSelect(template, true)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Template</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyTemplate(template)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
