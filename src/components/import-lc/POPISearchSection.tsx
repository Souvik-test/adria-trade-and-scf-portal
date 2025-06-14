
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import POPISearchableSelect from './POPISearchableSelect';
import { ImportLCFormData } from '@/types/importLC';
import { populatePOPIData } from './POPIDataPopulator';
import { useToast } from '@/hooks/use-toast';

interface POPISearchSectionProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const POPISearchSection: React.FC<POPISearchSectionProps> = ({
  formData,
  updateField
}) => {
  const { toast } = useToast();

  const handlePopulatePOPI = async () => {
    if (!formData.popiType || !formData.popiNumber) {
      toast({
        title: "Error",
        description: "Please select PO/PI type and number first",
        variant: "destructive",
      });
      return;
    }

    console.log('Populating POPI data for:', formData.popiNumber);
    
    const result = await populatePOPIData(
      formData.popiType,
      formData.popiNumber,
      updateField
    );

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-600">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-corporate-teal-500 dark:text-corporate-teal-400">
          PO/PI Reference
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              PO/PI Type
            </Label>
            <Select 
              value={formData.popiType} 
              onValueChange={(value) => updateField('popiType', value as 'PO' | 'PI' | '')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select PO or PI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PO">Purchase Order (PO)</SelectItem>
                <SelectItem value="PI">Proforma Invoice (PI)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {formData.popiType ? `${formData.popiType} Number` : 'PO/PI Number'}
            </Label>
            {formData.popiType ? (
              <POPISearchableSelect
                type={formData.popiType}
                value={formData.popiNumber}
                onChange={(value) => updateField('popiNumber', value)}
              />
            ) : (
              <Input
                value={formData.popiNumber}
                onChange={(e) => updateField('popiNumber', e.target.value)}
                placeholder="Enter PO/PI number"
                disabled
              />
            )}
          </div>
        </div>

        {formData.popiNumber && formData.popiType && (
          <div className="flex justify-end">
            <Button 
              onClick={handlePopulatePOPI}
              className="bg-corporate-blue hover:bg-corporate-blue/90 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Populate from {formData.popiType}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default POPISearchSection;
