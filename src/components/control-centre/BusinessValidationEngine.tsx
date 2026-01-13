import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from 'lucide-react';

// Types
interface ValidationCondition {
  id?: string;
  condition_id: string;
  field_code: string;
  operator: string;
  compare_value: string;
  compare_source: 'CONSTANT' | 'FIELD';
  join_type: 'AND' | 'OR' | null;
  sequence: number;
}

interface ValidationRule {
  id: string;
  rule_id: string;
  product_code: string;
  event_code: string;
  validation_type: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  priority: number;
  active_flag: boolean;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string | null;
  conditions: ValidationCondition[];
}

interface ProductEventOption {
  product_code: string;
  product_name: string;
  event_code: string;
  event_name: string;
}

interface FieldOption {
  field_code: string;
  field_label_key: string;
  data_type: string;
}

const OPERATORS = [
  { value: '=', label: 'Equals (=)' },
  { value: '<', label: 'Less Than (<)' },
  { value: '>', label: 'Greater Than (>)' },
  { value: '<=', label: 'Less Than or Equal (<=)' },
  { value: '>=', label: 'Greater Than or Equal (>=)' },
  { value: '<>', label: 'Not Equal (<>)' },
  { value: 'IN', label: 'In List (IN)' },
  { value: 'NOT IN', label: 'Not In List (NOT IN)' },
  { value: 'CONTAINS', label: 'Contains' },
  { value: 'NOT CONTAINS', label: 'Does Not Contain' },
  { value: 'IS NULL', label: 'Is Empty (IS NULL)' },
  { value: 'IS NOT NULL', label: 'Is Not Empty (IS NOT NULL)' },
];

const VALIDATION_TYPES = [
  { value: 'ERROR', label: 'Error', color: 'bg-destructive text-destructive-foreground' },
  { value: 'WARNING', label: 'Warning', color: 'bg-yellow-500 text-white' },
  { value: 'INFO', label: 'Information', color: 'bg-blue-500 text-white' },
];

export function BusinessValidationEngine() {
  const { user } = useAuth();
  
  // State
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [productEvents, setProductEvents] = useState<ProductEventOption[]>([]);
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ValidationRule | null>(null);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  
  // Filter state
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    product_code: '',
    event_code: '',
    validation_type: 'ERROR' as 'ERROR' | 'WARNING' | 'INFO',
    message: '',
    priority: 1,
    active_flag: true,
  });
  const [conditions, setConditions] = useState<ValidationCondition[]>([]);

  // Get unique products and events for filters
  const uniqueProducts = useMemo(() => {
    const products = new Map<string, string>();
    productEvents.forEach(pe => products.set(pe.product_code, pe.product_name));
    return Array.from(products.entries()).map(([code, name]) => ({ code, name }));
  }, [productEvents]);

  const filteredEvents = useMemo(() => {
    if (filterProduct === 'all') return [];
    return productEvents.filter(pe => pe.product_code === filterProduct);
  }, [productEvents, filterProduct]);

  const formFilteredEvents = useMemo(() => {
    if (!formData.product_code) return [];
    return productEvents.filter(pe => pe.product_code === formData.product_code);
  }, [productEvents, formData.product_code]);

  // Filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      if (filterProduct !== 'all' && rule.product_code !== filterProduct) return false;
      if (filterEvent !== 'all' && rule.event_code !== filterEvent) return false;
      if (filterType !== 'all' && rule.validation_type !== filterType) return false;
      if (filterStatus !== 'all') {
        const isActive = filterStatus === 'active';
        if (rule.active_flag !== isActive) return false;
      }
      return true;
    });
  }, [rules, filterProduct, filterEvent, filterType, filterStatus]);

  // Fetch data
  useEffect(() => {
    if (user?.id) {
      fetchRules();
      fetchProductEvents();
    }
  }, [user?.id]);

  // Fetch fields when product changes in form
  useEffect(() => {
    if (formData.product_code) {
      fetchFields(formData.product_code);
    }
  }, [formData.product_code]);

  const fetchRules = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_validation_rules_with_conditions', {
        p_user_id: user.id,
      });
      
      if (error) throw error;
      setRules((data || []) as unknown as ValidationRule[]);
    } catch (error: any) {
      console.error('Error fetching rules:', error);
      toast.error('Failed to fetch validation rules');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductEvents = async () => {
    try {
      const { data, error } = await supabase.rpc('get_product_event_mappings');
      
      if (error) throw error;
      
      const mapped: ProductEventOption[] = (data || []).map((item: any) => ({
        product_code: item.product_code,
        product_name: item.product_name || item.product_code,
        event_code: item.event_code,
        event_name: item.event_name || item.event_code,
      }));
      
      setProductEvents(mapped);
    } catch (error: any) {
      console.error('Error fetching product events:', error);
    }
  };

  const fetchFields = async (productCode: string) => {
    try {
      const { data, error } = await supabase
        .from('field_repository')
        .select('field_code, field_label_key, data_type')
        .eq('product_code', productCode)
        .eq('is_active_flag', true);
      
      if (error) throw error;
      setFields((data || []) as FieldOption[]);
    } catch (error: any) {
      console.error('Error fetching fields:', error);
    }
  };

  const handleCreateRule = () => {
    setSelectedRule(null);
    setFormData({
      product_code: '',
      event_code: '',
      validation_type: 'ERROR',
      message: '',
      priority: 1,
      active_flag: true,
    });
    setConditions([]);
    setIsDialogOpen(true);
  };

  const handleEditRule = (rule: ValidationRule) => {
    setSelectedRule(rule);
    setFormData({
      product_code: rule.product_code,
      event_code: rule.event_code,
      validation_type: rule.validation_type,
      message: rule.message,
      priority: rule.priority,
      active_flag: rule.active_flag,
    });
    setConditions(rule.conditions.map((c, i) => ({
      ...c,
      sequence: i + 1,
    })));
    setIsDialogOpen(true);
  };

  const handleDeleteRule = (rule: ValidationRule) => {
    setSelectedRule(rule);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!user?.id || !selectedRule) return;
    
    try {
      const { error } = await supabase.rpc('delete_validation_rule', {
        p_user_id: user.id,
        p_id: selectedRule.id,
      });
      
      if (error) throw error;
      
      toast.success('Validation rule deleted successfully');
      fetchRules();
    } catch (error: any) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete validation rule');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedRule(null);
    }
  };

  const handleToggleActive = async (rule: ValidationRule) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase.rpc('toggle_validation_rule_active', {
        p_user_id: user.id,
        p_id: rule.id,
        p_active: !rule.active_flag,
      });
      
      if (error) throw error;
      
      toast.success(`Rule ${!rule.active_flag ? 'activated' : 'deactivated'} successfully`);
      fetchRules();
    } catch (error: any) {
      console.error('Error toggling rule:', error);
      toast.error('Failed to update rule status');
    }
  };

  const handleSaveRule = async () => {
    if (!user?.id) return;
    
    // Validation
    if (!formData.product_code || !formData.event_code || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (conditions.length === 0) {
      toast.error('Please add at least one condition');
      return;
    }
    
    // Validate conditions
    for (const cond of conditions) {
      if (!cond.field_code || !cond.operator) {
        toast.error('Please complete all condition fields');
        return;
      }
      if (!['IS NULL', 'IS NOT NULL'].includes(cond.operator) && !cond.compare_value) {
        toast.error('Please provide a value for all conditions');
        return;
      }
    }
    
    try {
      const conditionsJson = conditions.map((c, i) => ({
        condition_id: c.condition_id || `COND_${Date.now()}_${i}`,
        field_code: c.field_code,
        operator: c.operator,
        compare_value: c.compare_value,
        compare_source: c.compare_source,
        join_type: i === 0 ? null : c.join_type,
        sequence: i + 1,
      }));
      
      if (selectedRule) {
        // Update existing rule
        const { error } = await supabase.rpc('update_validation_rule_with_conditions', {
          p_user_id: user.id,
          p_id: selectedRule.id,
          p_product_code: formData.product_code,
          p_event_code: formData.event_code,
          p_validation_type: formData.validation_type,
          p_message: formData.message,
          p_priority: formData.priority,
          p_active_flag: formData.active_flag,
          p_conditions: conditionsJson,
        });
        
        if (error) throw error;
        toast.success('Validation rule updated successfully');
      } else {
        // Create new rule
        const ruleId = `VR_${Date.now()}`;
        const { error } = await supabase.rpc('insert_validation_rule_with_conditions', {
          p_user_id: user.id,
          p_rule_id: ruleId,
          p_product_code: formData.product_code,
          p_event_code: formData.event_code,
          p_validation_type: formData.validation_type,
          p_message: formData.message,
          p_priority: formData.priority,
          p_active_flag: formData.active_flag,
          p_conditions: conditionsJson,
        });
        
        if (error) throw error;
        toast.success('Validation rule created successfully');
      }
      
      setIsDialogOpen(false);
      fetchRules();
    } catch (error: any) {
      console.error('Error saving rule:', error);
      toast.error('Failed to save validation rule');
    }
  };

  const addCondition = () => {
    const newCondition: ValidationCondition = {
      condition_id: `COND_${Date.now()}_${conditions.length}`,
      field_code: '',
      operator: '=',
      compare_value: '',
      compare_source: 'CONSTANT',
      join_type: conditions.length === 0 ? null : 'AND',
      sequence: conditions.length + 1,
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (index: number, updates: Partial<ValidationCondition>) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], ...updates };
    setConditions(updated);
  };

  const removeCondition = (index: number) => {
    const updated = conditions.filter((_, i) => i !== index);
    // Update join_type for first condition
    if (updated.length > 0 && index === 0) {
      updated[0] = { ...updated[0], join_type: null };
    }
    setConditions(updated);
  };

  const generateNarration = (): string => {
    if (conditions.length === 0) return 'No conditions defined';
    
    const parts: string[] = [];
    conditions.forEach((cond, i) => {
      const fieldLabel = fields.find(f => f.field_code === cond.field_code)?.field_label_key || cond.field_code;
      const operatorLabel = OPERATORS.find(o => o.value === cond.operator)?.label || cond.operator;
      
      let condText = `${fieldLabel} ${operatorLabel}`;
      
      if (!['IS NULL', 'IS NOT NULL'].includes(cond.operator)) {
        if (cond.compare_source === 'FIELD') {
          const compareFieldLabel = fields.find(f => f.field_code === cond.compare_value)?.field_label_key || cond.compare_value;
          condText += ` ${compareFieldLabel}`;
        } else {
          condText += ` "${cond.compare_value}"`;
        }
      }
      
      if (i > 0 && cond.join_type) {
        parts.push(cond.join_type);
      }
      parts.push(condText);
    });
    
    const typeConfig = VALIDATION_TYPES.find(t => t.value === formData.validation_type);
    return `When ${parts.join(' ')} → Show ${typeConfig?.label || formData.validation_type}: "${formData.message}"`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ERROR': return <AlertCircle className="h-4 w-4" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4" />;
      case 'INFO': return <Info className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'ERROR': return 'bg-destructive text-destructive-foreground';
      case 'WARNING': return 'bg-yellow-500 text-white';
      case 'INFO': return 'bg-blue-500 text-white';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Business Validation Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Define and manage validation rules for transaction processing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchRules} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreateRule}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Product</Label>
              <Select value={filterProduct} onValueChange={(v) => { setFilterProduct(v); setFilterEvent('all'); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {uniqueProducts.map(p => (
                    <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Event</Label>
              <Select value={filterEvent} onValueChange={setFilterEvent} disabled={filterProduct === 'all'}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {filteredEvents.map(e => (
                    <SelectItem key={e.event_code} value={e.event_code}>{e.event_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Validation Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {VALIDATION_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules Table */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Validation Rules</CardTitle>
            <CardDescription>
              {filteredRules.length} rule{filteredRules.length !== 1 ? 's' : ''} found
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="max-w-[300px]">Message</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No validation rules found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRules.map((rule) => (
                  <React.Fragment key={rule.id}>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setExpandedRuleId(expandedRuleId === rule.id ? null : rule.id)}
                        >
                          {expandedRuleId === rule.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {productEvents.find(p => p.product_code === rule.product_code)?.product_name || rule.product_code}
                      </TableCell>
                      <TableCell>
                        {productEvents.find(p => p.event_code === rule.event_code)?.event_name || rule.event_code}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeBadgeClass(rule.validation_type)} flex items-center gap-1 w-fit`}>
                          {getTypeIcon(rule.validation_type)}
                          {rule.validation_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate" title={rule.message}>
                        {rule.message}
                      </TableCell>
                      <TableCell className="text-center">{rule.priority}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={rule.active_flag}
                          onCheckedChange={() => handleToggleActive(rule)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRule(rule)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRule(rule)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRuleId === rule.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={8} className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Conditions:</h4>
                            <div className="space-y-1 text-sm">
                              {rule.conditions.map((cond, i) => (
                                <div key={cond.id || i} className="flex items-center gap-2">
                                  {i > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      {cond.join_type}
                                    </Badge>
                                  )}
                                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                    {cond.field_code} {cond.operator} {
                                      ['IS NULL', 'IS NOT NULL'].includes(cond.operator) 
                                        ? '' 
                                        : cond.compare_source === 'FIELD' 
                                          ? `[${cond.compare_value}]` 
                                          : `"${cond.compare_value}"`
                                    }
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? 'Edit Validation Rule' : 'Create Validation Rule'}
            </DialogTitle>
            <DialogDescription>
              Define the rule properties and conditions for transaction validation
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 py-4">
              {/* Rule Header Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                  Rule Configuration
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Product *</Label>
                    <Select
                      value={formData.product_code}
                      onValueChange={(v) => setFormData({ ...formData, product_code: v, event_code: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueProducts.map(p => (
                          <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs">Event *</Label>
                    <Select
                      value={formData.event_code}
                      onValueChange={(v) => setFormData({ ...formData, event_code: v })}
                      disabled={!formData.product_code}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        {formFilteredEvents.map(e => (
                          <SelectItem key={e.event_code} value={e.event_code}>{e.event_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Validation Type *</Label>
                    <Select
                      value={formData.validation_type}
                      onValueChange={(v) => setFormData({ ...formData, validation_type: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VALIDATION_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(t.value)}
                              {t.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs">Priority</Label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs">Active</Label>
                    <div className="flex items-center h-10">
                      <Switch
                        checked={formData.active_flag}
                        onCheckedChange={(v) => setFormData({ ...formData, active_flag: v })}
                      />
                      <span className="ml-2 text-sm text-muted-foreground">
                        {formData.active_flag ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs">Validation Message *</Label>
                  <Textarea
                    placeholder="Enter the message to display when validation fails..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Conditions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                    Conditions
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCondition}
                    disabled={!formData.product_code}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Condition
                  </Button>
                </div>
                
                {!formData.product_code && (
                  <p className="text-sm text-muted-foreground">
                    Please select a product first to add conditions
                  </p>
                )}
                
                {conditions.length > 0 && (
                  <div className="space-y-3">
                    {conditions.map((cond, index) => (
                      <div
                        key={cond.condition_id}
                        className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center pt-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        {/* Join Type */}
                        <div className="w-20">
                          {index > 0 ? (
                            <Select
                              value={cond.join_type || 'AND'}
                              onValueChange={(v) => updateCondition(index, { join_type: v as 'AND' | 'OR' })}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AND">AND</SelectItem>
                                <SelectItem value="OR">OR</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="h-9 flex items-center text-sm text-muted-foreground">
                              When
                            </div>
                          )}
                        </div>
                        
                        {/* Field */}
                        <div className="flex-1">
                          <Select
                            value={cond.field_code}
                            onValueChange={(v) => updateCondition(index, { field_code: v })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {fields.map(f => (
                                <SelectItem key={f.field_code} value={f.field_code}>
                                  {f.field_label_key || f.field_code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Operator */}
                        <div className="w-44">
                          <Select
                            value={cond.operator}
                            onValueChange={(v) => updateCondition(index, { operator: v })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {OPERATORS.map(o => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Value Type & Value */}
                        {!['IS NULL', 'IS NOT NULL'].includes(cond.operator) && (
                          <>
                            <div className="w-28">
                              <Select
                                value={cond.compare_source}
                                onValueChange={(v) => updateCondition(index, { compare_source: v as any, compare_value: '' })}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CONSTANT">Value</SelectItem>
                                  <SelectItem value="FIELD">Field</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex-1">
                              {cond.compare_source === 'FIELD' ? (
                                <Select
                                  value={cond.compare_value}
                                  onValueChange={(v) => updateCondition(index, { compare_value: v })}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fields.filter(f => f.field_code !== cond.field_code).map(f => (
                                      <SelectItem key={f.field_code} value={f.field_code}>
                                        {f.field_label_key || f.field_code}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  className="h-9"
                                  placeholder="Enter value"
                                  value={cond.compare_value}
                                  onChange={(e) => updateCondition(index, { compare_value: e.target.value })}
                                />
                              )}
                            </div>
                          </>
                        )}
                        
                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                          onClick={() => removeCondition(index)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Narration Panel */}
              {conditions.length > 0 && formData.message && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                      Rule Summary
                    </h3>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm italic text-muted-foreground">
                        {generateNarration()}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRule}>
              {selectedRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Validation Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this validation rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
