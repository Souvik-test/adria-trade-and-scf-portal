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
}

const ProgramProductSelectionPane: React.FC<ProgramProductSelectionPaneProps> = ({
  formData,
  onFieldChange
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
    queryKey: ['finance-programs', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('scf_program_configurations')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');
      return data || [];
    },
    enabled: !!userId
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
          <Label htmlFor="program">Program *</Label>
          <Select value={formData.programId} onValueChange={handleProgramSelect}>
            <SelectTrigger id="program">
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {programs?.map((program: any) => (
                <SelectItem key={program.program_id} value={program.program_id}>
                  {program.program_name} ({program.program_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productCode">Product Code *</Label>
          <Input
            id="productCode"
            value={formData.productCode}
            onChange={(e) => onFieldChange('productCode', e.target.value)}
            placeholder="Enter product code"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productName">Product Name *</Label>
          <Input
            id="productName"
            value={formData.productName}
            onChange={(e) => onFieldChange('productName', e.target.value)}
            placeholder="Enter product name"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramProductSelectionPane;