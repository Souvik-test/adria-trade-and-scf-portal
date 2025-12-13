import { useState, useEffect, useCallback } from 'react';
import {
  ProductEventMapping,
  fetchProductEventMappings,
  getProductNameByCode,
  getEventNameByCode,
  getEventsByProductCode,
  defaultProductNames,
  defaultEventNames
} from '@/services/productEventMappingService';

export const useProductEventMappings = () => {
  const [mappings, setMappings] = useState<ProductEventMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessCentre, setBusinessCentre] = useState<string>('Adria TSCF Client');

  useEffect(() => {
    const storedBusinessCentre = localStorage.getItem('businessCentre') || 'Adria TSCF Client';
    setBusinessCentre(storedBusinessCentre);

    const loadMappings = async () => {
      setLoading(true);
      const data = await fetchProductEventMappings(storedBusinessCentre);
      setMappings(data);
      setLoading(false);
    };

    loadMappings();
  }, []);

  const getProductName = useCallback((productCode: string): string => {
    const name = getProductNameByCode(mappings, productCode);
    return name || defaultProductNames[productCode] || productCode;
  }, [mappings]);

  const getEventName = useCallback((productCode: string, eventCode: string): string => {
    const name = getEventNameByCode(mappings, productCode, eventCode);
    return name || defaultEventNames[productCode]?.[eventCode] || eventCode;
  }, [mappings]);

  const getEventsForProduct = useCallback((productCode: string): ProductEventMapping[] => {
    return getEventsByProductCode(mappings, productCode);
  }, [mappings]);

  const isClientPortal = businessCentre === 'Adria TSCF Client';

  return {
    mappings,
    loading,
    businessCentre,
    isClientPortal,
    getProductName,
    getEventName,
    getEventsForProduct
  };
};
