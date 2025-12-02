import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProductEventMapping {
  product_code: string;
  event_code: string;
  business_application: string[];
  target_audience: string[];
}

interface Section {
  id: string;
  name: string;
  sequence: number;
}

interface Pane {
  id: string;
  name: string;
  sequence: number;
  sections: Section[];
  isOpen: boolean;
}

const ManagePanesAndSections = () => {
  const [productMappings, setProductMappings] = useState<ProductEventMapping[]>([]);
  const [selectedBusinessApp, setSelectedBusinessApp] = useState('');
  const [selectedCustomerSegment, setSelectedCustomerSegment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedMapping, setSelectedMapping] = useState<ProductEventMapping | null>(null);
  const [panes, setPanes] = useState<Pane[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch product event mappings
  useEffect(() => {
    fetchProductMappings();
  }, []);

  const fetchProductMappings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_event_mapping')
        .select('product_code, event_code, business_application, target_audience');

      if (error) throw error;
      setProductMappings(data || []);
    } catch (error: any) {
      toast.error('Failed to load product mappings', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique business applications
  const uniqueBusinessApps = Array.from(
    new Set(productMappings.flatMap(m => m.business_application))
  ).sort();

  // Get unique customer segments for selected business application
  const availableCustomerSegments = selectedBusinessApp
    ? Array.from(
        new Set(
          productMappings
            .filter(m => m.business_application.includes(selectedBusinessApp))
            .flatMap(m => m.target_audience)
        )
      ).sort()
    : [];

  // Get unique products for selected business application and customer segment
  const availableProducts = selectedBusinessApp && selectedCustomerSegment
    ? Array.from(
        new Set(
          productMappings
            .filter(
              m =>
                m.business_application.includes(selectedBusinessApp) &&
                m.target_audience.includes(selectedCustomerSegment)
            )
            .map(m => m.product_code)
        )
      ).sort()
    : [];

  // Get events for selected business application, customer segment, and product
  const availableEvents = selectedBusinessApp && selectedCustomerSegment && selectedProduct
    ? productMappings.filter(
        m =>
          m.business_application.includes(selectedBusinessApp) &&
          m.target_audience.includes(selectedCustomerSegment) &&
          m.product_code === selectedProduct
      )
    : [];

  // Load existing pane/section mapping when all selections are made
  useEffect(() => {
    if (selectedBusinessApp && selectedCustomerSegment && selectedProduct && selectedEvent) {
      loadPaneSectionMapping();
    } else {
      setPanes([]);
      setSelectedMapping(null);
    }
  }, [selectedBusinessApp, selectedCustomerSegment, selectedProduct, selectedEvent]);

  const loadPaneSectionMapping = async () => {
    setLoading(true);
    try {
      // Find the selected mapping
      const mapping = productMappings.find(
        m =>
          m.business_application.includes(selectedBusinessApp) &&
          m.target_audience.includes(selectedCustomerSegment) &&
          m.product_code === selectedProduct &&
          m.event_code === selectedEvent
      );
      setSelectedMapping(mapping || null);

      // Load existing pane/section configuration if any
      // Filter by all 4 criteria to ensure proper isolation
      const { data, error } = await supabase
        .from('pane_section_mappings')
        .select('*')
        .eq('product_code', selectedProduct)
        .eq('event_code', selectedEvent)
        .contains('business_application', [selectedBusinessApp])
        .contains('customer_segment', [selectedCustomerSegment])
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.panes) {
        const loadedPanes = (data.panes as any[]).map(p => ({
          ...p,
          isOpen: false
        }));
        setPanes(loadedPanes);
      } else {
        setPanes([]);
      }
    } catch (error: any) {
      toast.error('Failed to load pane configuration', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const addPane = () => {
    const newPane: Pane = {
      id: `pane-${Date.now()}`,
      name: '',
      sequence: panes.length + 1,
      sections: [],
      isOpen: true
    };
    setPanes([...panes, newPane]);
  };

  const updatePaneName = (paneId: string, name: string) => {
    setPanes(panes.map(p => p.id === paneId ? { ...p, name } : p));
  };

  const deletePane = (paneId: string) => {
    const updatedPanes = panes.filter(p => p.id !== paneId);
    // Resequence
    setPanes(updatedPanes.map((p, idx) => ({ ...p, sequence: idx + 1 })));
  };

  const movePaneUp = (paneId: string) => {
    const index = panes.findIndex(p => p.id === paneId);
    if (index > 0) {
      const newPanes = [...panes];
      [newPanes[index - 1], newPanes[index]] = [newPanes[index], newPanes[index - 1]];
      setPanes(newPanes.map((p, idx) => ({ ...p, sequence: idx + 1 })));
    }
  };

  const movePaneDown = (paneId: string) => {
    const index = panes.findIndex(p => p.id === paneId);
    if (index < panes.length - 1) {
      const newPanes = [...panes];
      [newPanes[index], newPanes[index + 1]] = [newPanes[index + 1], newPanes[index]];
      setPanes(newPanes.map((p, idx) => ({ ...p, sequence: idx + 1 })));
    }
  };

  const togglePaneOpen = (paneId: string) => {
    setPanes(panes.map(p => p.id === paneId ? { ...p, isOpen: !p.isOpen } : p));
  };

  const addSection = (paneId: string) => {
    setPanes(panes.map(p => {
      if (p.id === paneId) {
        const newSection: Section = {
          id: `section-${Date.now()}`,
          name: '',
          sequence: p.sections.length + 1
        };
        return { ...p, sections: [...p.sections, newSection] };
      }
      return p;
    }));
  };

  const updateSectionName = (paneId: string, sectionId: string, name: string) => {
    setPanes(panes.map(p => {
      if (p.id === paneId) {
        return {
          ...p,
          sections: p.sections.map(s => s.id === sectionId ? { ...s, name } : s)
        };
      }
      return p;
    }));
  };

  const deleteSection = (paneId: string, sectionId: string) => {
    setPanes(panes.map(p => {
      if (p.id === paneId) {
        const updatedSections = p.sections.filter(s => s.id !== sectionId);
        return {
          ...p,
          sections: updatedSections.map((s, idx) => ({ ...s, sequence: idx + 1 }))
        };
      }
      return p;
    }));
  };

  const moveSectionUp = (paneId: string, sectionId: string) => {
    setPanes(panes.map(p => {
      if (p.id === paneId) {
        const index = p.sections.findIndex(s => s.id === sectionId);
        if (index > 0) {
          const newSections = [...p.sections];
          [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
          return {
            ...p,
            sections: newSections.map((s, idx) => ({ ...s, sequence: idx + 1 }))
          };
        }
      }
      return p;
    }));
  };

  const moveSectionDown = (paneId: string, sectionId: string) => {
    setPanes(panes.map(p => {
      if (p.id === paneId) {
        const index = p.sections.findIndex(s => s.id === sectionId);
        if (index < p.sections.length - 1) {
          const newSections = [...p.sections];
          [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
          return {
            ...p,
            sections: newSections.map((s, idx) => ({ ...s, sequence: idx + 1 }))
          };
        }
      }
      return p;
    }));
  };

  const handleSave = async () => {
    if (!selectedBusinessApp || !selectedCustomerSegment || !selectedProduct || !selectedEvent) {
      toast.error('Please select business application, customer segment, product, and event');
      return;
    }

    // Validate that all panes have names
    if (panes.some(p => !p.name.trim())) {
      toast.error('Please provide names for all panes');
      return;
    }

    // Validate that all sections have names
    for (const pane of panes) {
      if (pane.sections.some(s => !s.name.trim())) {
        toast.error(`Please provide names for all sections in "${pane.name}"`);
        return;
      }
    }

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('User not authenticated');

      const panesData = panes.map(({ isOpen, ...rest }) => rest);

      const recordData = {
        product_code: selectedProduct,
        event_code: selectedEvent,
        business_application: [selectedBusinessApp],
        customer_segment: [selectedCustomerSegment],
        panes: panesData as any,
        user_id: userData.user.id
      };

      // Check if record exists for this exact combination
      const { data: existing, error: selectError } = await supabase
        .from('pane_section_mappings')
        .select('id')
        .eq('product_code', selectedProduct)
        .eq('event_code', selectedEvent)
        .contains('business_application', [selectedBusinessApp])
        .contains('customer_segment', [selectedCustomerSegment])
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (selectError && selectError.code !== 'PGRST116') throw selectError;

      let error;
      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('pane_section_mappings')
          .update(recordData)
          .eq('id', existing.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('pane_section_mappings')
          .insert(recordData);
        error = insertError;
      }

      if (error) throw error;

      toast.success('Pane and section mapping saved successfully');
    } catch (error: any) {
      toast.error('Failed to save mapping', {
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Panes and Sections</h1>
          <p className="text-muted-foreground mt-2">
            Configure panes and sections for product events
          </p>
        </div>
      </div>

      {/* Header Section - Product and Event Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Product and Event</CardTitle>
          <CardDescription>
            Choose a product-event combination to configure its panes and sections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessApp">Business Application</Label>
              <Select
                value={selectedBusinessApp}
                onValueChange={(value) => {
                  setSelectedBusinessApp(value);
                  setSelectedCustomerSegment('');
                  setSelectedProduct('');
                  setSelectedEvent('');
                }}
              >
                <SelectTrigger id="businessApp">
                  <SelectValue placeholder="Select business application" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueBusinessApps.map(app => (
                    <SelectItem key={app} value={app}>
                      {app}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerSegment">Customer Segment</Label>
              <Select
                value={selectedCustomerSegment}
                onValueChange={(value) => {
                  setSelectedCustomerSegment(value);
                  setSelectedProduct('');
                  setSelectedEvent('');
                }}
                disabled={!selectedBusinessApp}
              >
                <SelectTrigger id="customerSegment">
                  <SelectValue placeholder="Select customer segment" />
                </SelectTrigger>
                <SelectContent>
                  {availableCustomerSegments.map(segment => (
                    <SelectItem key={segment} value={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={selectedProduct}
                onValueChange={(value) => {
                  setSelectedProduct(value);
                  setSelectedEvent('');
                }}
                disabled={!selectedBusinessApp || !selectedCustomerSegment}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map(product => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Event</Label>
              <Select
                value={selectedEvent}
                onValueChange={setSelectedEvent}
                disabled={!selectedBusinessApp || !selectedCustomerSegment || !selectedProduct}
              >
                <SelectTrigger id="event">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.map(mapping => (
                    <SelectItem key={mapping.event_code} value={mapping.event_code}>
                      {mapping.event_code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panes Section */}
      {selectedBusinessApp && selectedCustomerSegment && selectedProduct && selectedEvent && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Panes Configuration</CardTitle>
                <CardDescription>
                  Add and organize panes for {selectedBusinessApp} - {selectedCustomerSegment} - {selectedProduct} - {selectedEvent}
                </CardDescription>
              </div>
              <Button onClick={addPane} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Pane
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {panes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No panes configured. Click "Add Pane" to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {panes.map((pane, paneIndex) => (
                  <Card key={pane.id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => movePaneUp(pane.id)}
                            disabled={paneIndex === 0}
                            className="h-6 w-6 p-0"
                          >
                            <GripVertical className="w-4 h-4" />
                          </Button>
                          <span className="text-xs text-muted-foreground text-center">
                            {pane.sequence}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => movePaneDown(pane.id)}
                            disabled={paneIndex === panes.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <GripVertical className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Enter pane name (e.g., LC Basic Details)"
                              value={pane.name}
                              onChange={(e) => updatePaneName(pane.id, e.target.value)}
                              className="font-medium"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePaneOpen(pane.id)}
                              className="h-9 w-9 p-0"
                            >
                              {pane.isOpen ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePane(pane.id)}
                              className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    {pane.isOpen && (
                      <CardContent className="pt-0">
                        <div className="space-y-3 pl-12">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Sections</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addSection(pane.id)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Section
                            </Button>
                          </div>

                          {pane.sections.length === 0 ? (
                            <div className="text-sm text-muted-foreground py-4 text-center border-2 border-dashed rounded-md">
                              No sections. Click "Add Section" to add one.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {pane.sections.map((section, sectionIndex) => (
                                <div key={section.id} className="flex items-center gap-2">
                                  <div className="flex flex-col items-center gap-0.5">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => moveSectionUp(pane.id, section.id)}
                                      disabled={sectionIndex === 0}
                                      className="h-5 w-5 p-0"
                                    >
                                      <GripVertical className="w-3 h-3" />
                                    </Button>
                                    <span className="text-xs text-muted-foreground">
                                      {section.sequence}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => moveSectionDown(pane.id, section.id)}
                                      disabled={sectionIndex === pane.sections.length - 1}
                                      className="h-5 w-5 p-0"
                                    >
                                      <GripVertical className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <Input
                                    placeholder="Enter section name (e.g., Key Details)"
                                    value={section.name}
                                    onChange={(e) => updateSectionName(pane.id, section.id, e.target.value)}
                                    className="text-sm"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteSection(pane.id, section.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      {selectedBusinessApp && selectedCustomerSegment && selectedProduct && selectedEvent && panes.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedBusinessApp('');
              setSelectedCustomerSegment('');
              setSelectedProduct('');
              setSelectedEvent('');
              setPanes([]);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Pane and Section Mapping'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManagePanesAndSections;
