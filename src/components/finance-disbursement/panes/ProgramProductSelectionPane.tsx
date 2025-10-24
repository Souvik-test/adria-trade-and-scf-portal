import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProgramProductSelectionPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
  anchorType?: 'seller' | 'buyer';
}

const ProgramProductSelectionPane: React.FC<ProgramProductSelectionPaneProps> = ({
  formData,
  onFieldChange,
  anchorType = 'seller'
}) => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('custom_users')
          .select('user_id')
          .eq('id', user.id)
          .single();
        if (data) {
          setUserId(data.user_id);
        }
      }
    };
    fetchUserId();
  }, []);

  const { data: programs } = useQuery({
    queryKey: ['finance-programs', anchorType],
    queryFn: async () => {
      const { data } = await supabase
        .from('scf_program_configurations')
        .select('*')
        .eq('status', 'active');
      
      // Filter by anchor type
      return (data || []).filter((p: any) => {
        const anchorRole = p.anchor_party?.toUpperCase().replace(/\s+/g, '').replace(/\//g, '') || '';
        if (anchorType === 'seller') {
          return anchorRole.includes('SELLER') || anchorRole.includes('SUPPLIER');
        } else {
          return anchorRole.includes('BUYER');
        }
      });
    }
  });

  const handleProgramSelect = (programId: string) => {
    const program = programs?.find((p: any) => p.program_id === programId);
    if (program) {
      onFieldChange('programId', program.program_id);
      onFieldChange('programName', program.program_name);
      onFieldChange('financeCurrency', program.program_currency || 'USD');
      onFieldChange('autoRepaymentEnabled', program.auto_repayment || false);
      onFieldChange('repaymentMode', program.repayment_mode || 'auto');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program & Product Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="program">
            Program <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.programId} onValueChange={handleProgramSelect}>
            <SelectTrigger id="program">
              <SelectValue placeholder="Search and select program" />
            </SelectTrigger>
            <SelectContent>
              {programs?.length === 0 && (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No active {anchorType === 'seller' ? 'Seller/Supplier' : 'Buyer'} programs found
                </div>
              )}
              {programs?.map((program: any) => (
                <SelectItem key={program.program_id} value={program.program_id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{program.program_id}</span>
                    <span className="text-xs text-muted-foreground">{program.program_name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="programName">Program Name</Label>
          <Input
            id="programName"
            value={formData.programName}
            readOnly
            className="bg-muted cursor-not-allowed"
            placeholder="Auto-populated from program selection"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productCode">
            Product Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="productCode"
            value={formData.productCode}
            readOnly
            className="bg-muted cursor-not-allowed"
            placeholder="Pre-filled from product selection"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productName">
            Product Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="productName"
            value={formData.productName}
            readOnly
            className="bg-muted cursor-not-allowed"
            placeholder="Pre-filled from product selection"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramProductSelectionPane;