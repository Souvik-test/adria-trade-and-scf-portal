import { useState, useEffect } from 'react';
import { fetchStaticUIRegistry, StaticUIRegistryEntry } from '@/services/staticUiRegistryService';

export interface PaneOption {
  value: string;
  label: string;
}

export function useStaticUIPanes(productCode: string, eventCode?: string) {
  const [panes, setPanes] = useState<PaneOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPanes = async () => {
      if (!productCode) {
        setPanes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await fetchStaticUIRegistry(productCode, eventCode);
      
      if (result.success && result.data) {
        // Create unique pane options from registry entries
        const paneOptions = result.data.map(entry => ({
          value: entry.pane_name,
          label: entry.pane_name
        }));
        setPanes(paneOptions);
      } else {
        setPanes([]);
      }
      setLoading(false);
    };

    loadPanes();
  }, [productCode, eventCode]);

  return { panes, loading };
}
