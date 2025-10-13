import { useState, useCallback } from 'react';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
}

export interface InvoiceFormData {
  invoiceType: 'invoice' | 'credit-note' | 'debit-note';
  programId: string;
  programName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  purchaseOrderNumber: string;
  purchaseOrderCurrency: string;
  purchaseOrderAmount: number;
  purchaseOrderDate: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  currency: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentTerms: string;
  notes: string;
}

export type InvoiceFormStep = 'general' | 'items' | 'summary';

const useInvoiceForm = () => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceType: 'invoice',
    programId: '',
    programName: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    purchaseOrderNumber: '',
    purchaseOrderCurrency: '',
    purchaseOrderAmount: 0,
    purchaseOrderDate: '',
    buyerId: '',
    buyerName: '',
    sellerId: '',
    sellerName: '',
    currency: 'USD',
    lineItems: [],
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    paymentTerms: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState<InvoiceFormStep>('general');

  const updateField = useCallback((field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const searchPurchaseOrder = useCallback((poNumber: string) => {
    if (poNumber.trim()) {
      // Mock PO search - simulate auto-population
      const mockPOData = {
        purchaseOrderCurrency: 'USD',
        purchaseOrderAmount: 15000,
        purchaseOrderDate: '2024-06-01'
      };
      
      setFormData(prev => ({
        ...prev,
        purchaseOrderNumber: poNumber,
        ...mockPOData
      }));
    } else {
      // Clear PO fields if no PO number
      setFormData(prev => ({
        ...prev,
        purchaseOrderNumber: '',
        purchaseOrderCurrency: '',
        purchaseOrderAmount: 0,
        purchaseOrderDate: ''
      }));
    }
  }, []);

  const addLineItem = useCallback(() => {
    const newItem: InvoiceLineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      lineTotal: 0
    };
    
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  }, []);

  const updateLineItem = useCallback((id: string, updates: Partial<InvoiceLineItem>) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => 
        item.id === id 
          ? { 
              ...item, 
              ...updates,
              lineTotal: (updates.quantity ?? item.quantity) * (updates.unitPrice ?? item.unitPrice)
            }
          : item
      )
    }));
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  }, []);

  const calculateTotals = useCallback(() => {
    setFormData(prev => {
      const subtotal = prev.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const taxAmount = prev.lineItems.reduce((sum, item) => 
        sum + (item.lineTotal * item.taxRate / 100), 0
      );
      const totalAmount = subtotal + taxAmount - prev.discountAmount;

      return {
        ...prev,
        subtotal,
        taxAmount,
        totalAmount
      };
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      switch (prev) {
        case 'general': return 'items';
        case 'items': return 'summary';
        default: return prev;
      }
    });
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => {
      switch (prev) {
        case 'summary': return 'items';
        case 'items': return 'general';
        default: return prev;
      }
    });
  }, []);

  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 'general':
        return !!(formData.invoiceNumber && formData.invoiceDate && formData.buyerName && formData.sellerName);
      case 'items':
        return formData.lineItems.length > 0;
      case 'summary':
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const initializeForm = useCallback((invoiceType: InvoiceFormData['invoiceType']) => {
    setFormData(prev => ({
      ...prev,
      invoiceType,
      lineItems: prev.lineItems.length === 0 ? [{
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
        lineTotal: 0
      }] : prev.lineItems
    }));
    setCurrentStep('general');
  }, []);

  return {
    formData,
    currentStep,
    updateField,
    searchPurchaseOrder,
    addLineItem,
    updateLineItem,
    removeLineItem,
    calculateTotals,
    nextStep,
    previousStep,
    validateCurrentStep,
    initializeForm
  };
};

export default useInvoiceForm;
