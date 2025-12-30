import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImportLCFormData } from '@/types/importLC';
import { CheckCircle, AlertTriangle, XCircle, Shield, User, Building, Send } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

interface SanctionDetailsPaneProps {
  formData: ImportLCFormData;
}

const SanctionDetailsPane: React.FC<SanctionDetailsPaneProps> = ({ formData }) => {
  const [requestApproval, setRequestApproval] = useState(false);
  const [assignTo, setAssignTo] = useState<'department' | 'approver' | ''>('');
  const [email, setEmail] = useState('');

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

  // Mock sanction screening results with one hit for demo
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
      screeningStatus: 'hit' as const,
      hitType: 'OFAC - Potential Match',
      matchScore: 78,
      actionRequired: 'Manual Review'
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
  const hasHits = sanctionResults.some(r => r.screeningStatus === 'hit');

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
                <TableRow key={result.id} className={result.screeningStatus === 'hit' ? 'bg-red-50 dark:bg-red-900/10' : ''}>
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
                  <TableCell className={result.hitType ? 'text-red-600 font-medium' : ''}>{result.hitType || '-'}</TableCell>
                  <TableCell className={result.matchScore ? 'text-red-600 font-medium' : ''}>{result.matchScore ? `${result.matchScore}%` : '-'}</TableCell>
                  <TableCell className={result.actionRequired ? 'text-amber-600 font-medium' : ''}>{result.actionRequired || 'None'}</TableCell>
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
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-xs text-muted-foreground">OFAC</p>
              <div className="flex items-center gap-2 mt-1">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Hit Found</span>
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

      {/* Request Approval Option - only shown when there are hits */}
      {hasHits && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <Send className="h-4 w-4" />
              Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="request-sanction-approval" 
                checked={requestApproval}
                onCheckedChange={(checked) => {
                  setRequestApproval(checked === true);
                  if (!checked) {
                    setAssignTo('');
                    setEmail('');
                  }
                }}
              />
              <Label htmlFor="request-sanction-approval" className="text-sm font-medium cursor-pointer">
                Request Approval for Sanction Override
              </Label>
            </div>

            {requestApproval && (
              <div className="pl-6 space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">Assign to</Label>
                  <RadioGroup 
                    value={assignTo} 
                    onValueChange={(value) => {
                      setAssignTo(value as 'department' | 'approver');
                      setEmail('');
                    }}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="department" id="sanction-department" />
                      <Label htmlFor="sanction-department" className="cursor-pointer">Department</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="approver" id="sanction-approver" />
                      <Label htmlFor="sanction-approver" className="cursor-pointer">Approver</Label>
                    </div>
                  </RadioGroup>
                </div>

                {assignTo && (
                  <div className="space-y-2">
                    <Label htmlFor="sanction-email" className="text-sm text-muted-foreground">
                      {assignTo === 'department' ? 'Department Email' : 'Approver Email'}
                    </Label>
                    <Input
                      id="sanction-email"
                      type="email"
                      placeholder={`Enter ${assignTo} email address`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SanctionDetailsPane;
