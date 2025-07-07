
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface InwardBGDemandSearchSectionProps {
  guaranteeReference: string;
  setGuaranteeReference: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const InwardBGDemandSearchSection: React.FC<InwardBGDemandSearchSectionProps> = ({
  guaranteeReference,
  setGuaranteeReference,
  onSearch,
  isSearching
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search Guarantee/SBLC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="guaranteeRef" className="text-sm font-medium">
              Guarantee/SBLC Reference Number
            </Label>
            <Input
              id="guaranteeRef"
              value={guaranteeReference}
              onChange={(e) => setGuaranteeReference(e.target.value)}
              placeholder="Enter guarantee/SBLC reference (e.g., IBG/2024/001234)"
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={onSearch}
              disabled={isSearching}
              className="bg-primary hover:bg-primary/90"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InwardBGDemandSearchSection;
