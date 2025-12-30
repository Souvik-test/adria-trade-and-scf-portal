import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImportLCFormData } from '@/types/importLC';
import { CheckCircle, AlertTriangle, XCircle, Shield, User, Building } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SanctionDetailsPaneProps {
  formData: ImportLCFormData;
}

const SanctionDetailsPane: React.FC<SanctionDetailsPaneProps> = ({ formData }) => {
  // Get party names from formData
  const getPartyName = (role: string) => {
    if (Array.isArray(formData.parties)) {
      const party = formData.parties.find(p => p.role === role);
      return party?.name || '';
    }
    if (role === 'applicant') return formData.applicantName;
    if (role === 'beneficiary') return formData.beneficiaryName;
    return '';
  };

  // Mock sanction screening results - in production, this would come from sanctions/AML system
  const sanctionResults = [
    {
      id: '1',
      partyName: getPartyName('applicant') || 'Applicant',
      partyRole: 'Applicant',
      screeningStatus: 'clear' as const,
      hitType: null,
      matchScore: null,
      actionRequired: null
    },
    {
      id: '2',
      partyName: getPartyName('beneficiary') || 'Beneficiary',
      partyRole: 'Beneficiary',
      screeningStatus: 'clear' as const,
      hitType: null,
      matchScore: null,
      actionRequired: null
    },
    {
      id: '3',
      partyName: formData.beneficiaryBankName || 'Advising Bank',
      partyRole: 'Advising Bank',
      screeningStatus: 'clear' as const,
      hitType: null,
      matchScore: null,
      actionRequired: null
    },
    {
      id: '4',
      partyName: formData.issuingBank || 'Issuing Bank',
      partyRole: 'Issuing Bank',
      screeningStatus: 'clear' as const,
      hitType: null,
      matchScore: null,
      actionRequired: null
    }
  ];

  const allClear = sanctionResults.every(r => r.screeningStatus === 'clear');
  const hasHits = sanctionResults.some(r => (r.screeningStatus as string) === 'hit');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clear':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'hit':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'clear':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Clear</Badge>;
      case 'hit':
        return <Badge variant="destructive">Hit</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Sanction & Compliance Screening</h3>
        <Badge variant={allClear ? 'default' : 'destructive'} className="gap-1">
          <Shield className="h-3 w-3" />
          {allClear ? 'All Clear' : hasHits ? 'Hits Found' : 'Review Required'}
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Party Screening Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Party Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hit Type</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sanctionResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {result.partyRole.includes('Bank') ? (
                        <Building className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                      {result.partyName || '-'}
                    </div>
                  </TableCell>
                  <TableCell>{result.partyRole}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.screeningStatus)}
                      {getStatusBadge(result.screeningStatus)}
                    </div>
                  </TableCell>
                  <TableCell>{result.hitType || '-'}</TableCell>
                  <TableCell>{result.matchScore ? `${result.matchScore}%` : '-'}</TableCell>
                  <TableCell>{result.actionRequired || 'None'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Screening Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Compliance Check Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">OFAC</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Clear</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">FATF</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Clear</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">EU Sanctions</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Clear</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">AML Check</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Clear</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Status */}
      <div className={`p-4 rounded-lg border ${allClear ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
        <div className="flex items-start gap-3">
          {allClear ? (
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${allClear ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {allClear ? 'All Compliance Checks Passed' : 'Compliance Review Required'}
            </p>
            <p className={`text-sm ${allClear ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {allClear 
                ? 'All parties have been screened against sanctions lists and no matches were found.'
                : 'One or more parties require manual review due to potential matches.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanctionDetailsPane;
