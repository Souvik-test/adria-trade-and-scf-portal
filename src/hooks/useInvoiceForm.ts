
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
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  currency: string;
  exchangeRate: number;
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
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    customerName: '',
    customerAddress: '',
    customerContact: '',
    currency: 'USD',
    exchangeRate: 1,
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
        return !!(formData.invoiceNumber && formData.invoiceDate && formData.customerName);
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
