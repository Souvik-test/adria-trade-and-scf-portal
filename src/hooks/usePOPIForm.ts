
import { useState, useCallback } from 'react';

export interface POPIFormData {
  // Common fields
  instrumentType: 'purchase-order' | 'proforma-invoice';
  
  // PO specific fields
  poNumber?: string;
  poDate?: string;
  vendorSupplier?: string;
  expectedDeliveryDate?: string;
  
  // PI specific fields
  piNumber?: string;
  piDate?: string;
  validUntilDate?: string;
  buyerName?: string;
  buyerId?: string;
  
  // Common fields
  shippingAddress?: string;
  billingAddress?: string;
  sameAsShipping?: boolean;
  paymentTerms?: string;
  currency?: string;
  termsOfSale?: string;
  
  // Item details
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    lineTotal: number;
  }>;
  
  // Summary fields
  subtotal: number;
  totalTax: number;
  shippingCost: number;
  grandTotal: number;
  bankDetails?: string;
  notes?: string;
  attachments?: File[];
}

export type POPIFormStep = 'general' | 'items' | 'summary';

const usePOPIForm = () => {
  const [currentStep, setCurrentStep] = useState<POPIFormStep>('general');
  const [formData, setFormData] = useState<POPIFormData>({
    instrumentType: 'purchase-order',
    items: [],
    subtotal: 0,
    totalTax: 0,
    shippingCost: 0,
    grandTotal: 0,
    sameAsShipping: false
  });

  // Generate auto numbers
  const generatePONumber = useCallback(() => {
    const timestamp = Date.now();
    return `PO-${timestamp.toString().slice(-6)}`;
  }, []);

  const generatePINumber = useCallback(() => {
    const timestamp = Date.now();
    return `PI-${timestamp.toString().slice(-6)}`;
  }, []);

  // Initialize form with auto-generated number
  const initializeForm = useCallback((type: 'purchase-order' | 'proforma-invoice') => {
    const today = new Date().toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      instrumentType: type,
      ...(type === 'purchase-order' 
        ? { 
            poNumber: generatePONumber(),
            poDate: today,
            piNumber: undefined,
            piDate: undefined,
            validUntilDate: undefined,
            buyerName: undefined,
            buyerId: undefined
          }
        : { 
            piNumber: generatePINumber(),
            piDate: today,
            validUntilDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
            poNumber: undefined,
            poDate: undefined,
            vendorSupplier: undefined,
            expectedDeliveryDate: undefined
          })
    }));
  }, [generatePONumber, generatePINumber]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalTax = formData.items.reduce((sum, item) => sum + (item.lineTotal * item.taxRate / 100), 0);
    const grandTotal = subtotal + totalTax + formData.shippingCost;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      totalTax,
      grandTotal
    }));
  }, [formData.items, formData.shippingCost]);

  // Add new item
  const addItem = useCallback(() => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 0,
      lineTotal: 0
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  }, []);

  // Update item
  const updateItem = useCallback((id: string, updates: Partial<POPIFormData['items'][0]>) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // Calculate line total
          const discountAmount = updated.unitPrice * updated.quantity * (updated.discount / 100);
          updated.lineTotal = (updated.unitPrice * updated.quantity) - discountAmount;
          return updated;
        }
        return item;
      })
    }));
  }, []);

  // Remove item
  const removeItem = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  }, []);

  // Update form field
  const updateField = useCallback((field: keyof POPIFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Navigation
  const goToStep = useCallback((step: POPIFormStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    const steps: POPIFormStep[] = ['general', 'items', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const steps: POPIFormStep[] = ['general', 'items', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  // Form validation
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 'general':
        if (formData.instrumentType === 'purchase-order') {
          return !!(formData.poNumber && formData.poDate && formData.vendorSupplier);
        } else {
          return !!(formData.piNumber && formData.piDate && formData.buyerName);
        }
      case 'items':
        return formData.items.length > 0 && formData.items.every(item => 
          item.description && item.quantity > 0 && item.unitPrice > 0
        );
      case 'summary':
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    addItem,
    updateItem,
    removeItem,
    calculateTotals,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    initializeForm
  };
};

export default usePOPIForm;
