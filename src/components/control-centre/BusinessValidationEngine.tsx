import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { customAuth, CustomUser } from '@/services/customAuth';
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
  pane_code: string;
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
  pane_code?: string;
  data_type?: string;
}

interface PaneOption {
  pane_code: string;
  pane_name: string;
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
  const { user, loading: authLoading } = useAuth();
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  
  // Get effective user ID from either auth system
  const getEffectiveUserId = (): string | null => {
    if (customUser?.id) return customUser.id;
    if (user?.id) return user.id;
    return null;
  };
  
  // Load custom user session on mount
  useEffect(() => {
    const session = customAuth.getSession();
    if (session?.user) {
      setCustomUser(session.user);
    }
  }, []);
  
  // State
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [productEvents, setProductEvents] = useState<ProductEventOption[]>([]);
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [panes, setPanes] = useState<PaneOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // Refs to prevent refresh loops / setState on unmounted
  const isMountedRef = useRef(true);
  const isFetchingRulesRef = useRef(false);
  const isFetchingProductsRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch product + event definitions (does not depend on user)
  useEffect(() => {
    if (authLoading || isFetchingProductsRef.current) return;

    isFetchingProductsRef.current = true;
    fetchProductEvents().finally(() => {
      isFetchingProductsRef.current = false;
    });
  }, [authLoading]);

  // Fetch rules once auth is resolved
  useEffect(() => {
    if (authLoading) return;

    const userId = getEffectiveUserId();
    // If not signed in, don't keep the table in a perpetual spinner state
    if (!userId) {
      setIsLoading(false);
      return;
    }

    if (isFetchingRulesRef.current) return;

    isFetchingRulesRef.current = true;
    fetchRules().finally(() => {
      isFetchingRulesRef.current = false;
    });
  }, [authLoading, user?.id, customUser?.id]);

  // Fetch fields when product or event changes in form
  useEffect(() => {
    if (formData.product_code && formData.event_code) {
      fetchFields(formData.product_code, formData.event_code);
    } else {
      setFields([]);
    }
  }, [formData.product_code, formData.event_code]);

  const fetchRules = async () => {
    const userId = getEffectiveUserId();
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_validation_rules_with_conditions', {
        p_user_id: userId,
      });
      
      if (error) throw error;
      if (isMountedRef.current) {
        setRules((data || []) as unknown as ValidationRule[]);
      }
    } catch (error: any) {
      console.error('Error fetching rules:', error);
      toast.error('Failed to fetch validation rules');
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const fetchProductEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('product_event_definitions')
        .select('product_code, product_name, event_code, event_name, module_code')
        .order('module_code')
        .order('product_code')
        .order('event_code');
      
      if (error) throw error;
      
      if (isMountedRef.current) {
        const mapped: ProductEventOption[] = (data || []).map((item: any) => ({
          product_code: item.product_code,
          product_name: item.product_name || item.product_code,
          event_code: item.event_code,
          event_name: item.event_name || item.event_code,
        }));
        
        setProductEvents(mapped);
      }
    } catch (error: any) {
      console.error('Error fetching product events:', error);
      toast.error('Failed to fetch products');
    }
  };

  const fetchFields = async (productCode: string, eventCode: string) => {
    try {
      const { data, error } = await supabase.rpc('get_all_fields_for_mapping', {
        p_product_code: productCode,
        p_event_type: eventCode,
      });

      if (error) throw error;

      const mapped: FieldOption[] = (data || []).map((item: any) => ({
        field_code: item.field_code,
        field_label_key: item.field_label_key || item.field_code,
        pane_code: item.pane_code,
        data_type: item.data_type,
      }));

      // Sort defensively for stable UX
      mapped.sort((a, b) => (a.field_label_key || '').localeCompare(b.field_label_key || ''));

      setFields(mapped);
      
      // Extract unique panes from fields
      const paneMap = new Map<string, string>();
      mapped.forEach(f => {
        if (f.pane_code && !paneMap.has(f.pane_code)) {
          paneMap.set(f.pane_code, f.pane_code);
        }
      });
      const uniquePanes: PaneOption[] = Array.from(paneMap.keys()).map(code => ({
        pane_code: code,
        pane_name: code.replace(/_/g, ' '),
      }));
      setPanes(uniquePanes);
    } catch (error: any) {
      console.error('Error fetching fields:', error);
      setFields([]);
      setPanes([]);
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
    const userId = getEffectiveUserId();
    if (!userId || !selectedRule) return;
    
    try {
      const { error } = await supabase.rpc('delete_validation_rule', {
        p_user_id: userId,
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
    const userId = getEffectiveUserId();
    if (!userId) return;
    
    try {
      const { error } = await supabase.rpc('toggle_validation_rule_active', {
        p_user_id: userId,
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
    const userId = getEffectiveUserId();
    if (!userId) {
      toast.error('You must be logged in to create a rule');
      return;
    }
    
    // Validation
    if (!formData.product_code || !formData.event_code || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate conditions (only if any conditions exist)
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
        pane_code: c.pane_code,
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
          p_user_id: userId,
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
          p_user_id: userId,
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
      pane_code: '',
      field_code: '',
      operator: '=',
      compare_value: '',
      compare_source: 'CONSTANT',
      join_type: conditions.length === 0 ? null : 'AND',
      sequence: conditions.length + 1,
    };
    setConditions([...conditions, newCondition]);
  };

  // Get fields filtered by selected pane
  const getFieldsForPane = (paneCode: string): FieldOption[] => {
    if (!paneCode) return [];
    return fields.filter(f => f.pane_code === paneCode);
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
                        {productEvents.find(p => p.product_code === rule.product_code && p.event_code === rule.event_code)?.event_name || rule.event_code}
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
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {selectedRule ? 'Edit Validation Rule' : 'Create Validation Rule'}
            </DialogTitle>
            <DialogDescription>
              Define the rule properties and conditions for transaction validation
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 overflow-y-auto pr-4">
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent className="z-[200] bg-popover" position="popper" sideOffset={4}>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent className="z-[200] bg-popover" position="popper" sideOffset={4}>
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
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[200] bg-popover" position="popper" sideOffset={4}>
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
                        className="flex flex-wrap items-start gap-2 p-3 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center pt-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        {/* Join Type */}
                        <div className="w-20 flex-shrink-0">
                          {index > 0 ? (
                            <Select
                              value={cond.join_type || 'AND'}
                              onValueChange={(v) => updateCondition(index, { join_type: v as 'AND' | 'OR' })}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="z-[200] bg-popover" position="popper" sideOffset={4}>
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
                        
                        {/* Pane */}
                        <div className="w-40 flex-shrink-0">
                          <Select
                            value={cond.pane_code}
                            onValueChange={(v) => updateCondition(index, { pane_code: v, field_code: '' })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select pane" />
                            </SelectTrigger>
                            <SelectContent className="z-[200] bg-popover max-h-[200px]" position="popper" sideOffset={4}>
                              {panes.length === 0 ? (
                                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                  {formData.event_code ? 'No panes available' : 'Select product & event first'}
                                </div>
                              ) : (
                                panes.map(p => (
                                  <SelectItem key={p.pane_code} value={p.pane_code}>
                                    {p.pane_name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Field (filtered by pane) */}
                        <div className="flex-1 min-w-[150px]">
                          <Select
                            value={cond.field_code}
                            onValueChange={(v) => updateCondition(index, { field_code: v })}
                            disabled={!cond.pane_code}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder={cond.pane_code ? "Select field" : "Select pane first"} />
                            </SelectTrigger>
                            <SelectContent className="z-[200] bg-popover max-h-[200px]" position="popper" sideOffset={4}>
                              {getFieldsForPane(cond.pane_code).length === 0 ? (
                                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                  {cond.pane_code ? 'No fields in this pane' : 'Select a pane first'}
                                </div>
                              ) : (
                                getFieldsForPane(cond.pane_code).map(f => (
                                  <SelectItem key={f.field_code} value={f.field_code}>
                                    {f.field_label_key || f.field_code}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Operator */}
                        <div className="w-44 flex-shrink-0">
                          <Select
                            value={cond.operator}
                            onValueChange={(v) => updateCondition(index, { operator: v })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent className="z-[200] bg-popover max-h-[200px]" position="popper" sideOffset={4}>
                              {OPERATORS.map(o => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Value Type & Value */}
                        {!['IS NULL', 'IS NOT NULL'].includes(cond.operator) && (
                          <>
                            <div className="w-28 flex-shrink-0">
                              <Select
                                value={cond.compare_source}
                                onValueChange={(v) => updateCondition(index, { compare_source: v as any, compare_value: '' })}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-[200] bg-popover" position="popper" sideOffset={4}>
                                  <SelectItem value="CONSTANT">Value</SelectItem>
                                  <SelectItem value="FIELD">Field</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex-1 min-w-[120px]">
                              {cond.compare_source === 'FIELD' ? (
                                <Select
                                  value={cond.compare_value}
                                  onValueChange={(v) => updateCondition(index, { compare_value: v })}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[200] bg-popover max-h-[200px]" position="popper" sideOffset={4}>
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
          </div>
          
          <DialogFooter className="mt-4 flex-shrink-0">
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
