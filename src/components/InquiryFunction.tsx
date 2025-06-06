
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Download, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface InquiryFunctionProps {
  onBack: () => void;
}

const InquiryFunction: React.FC<InquiryFunctionProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('transaction');

  const transactionData = [
    {
      customerRef: 'ARAMPETRO199',
      bankRef: 'CIMBILCO0123',
      product: 'Import LC',
      operation: 'Issuance',
      ccy: 'USD',
      amount: '1,000,000',
      importer: 'Petronas Chemicals',
      exporter: 'Aramco',
      issueDate: '09-Apr-2025',
      expiryDate: '31-Dec-2025',
      status: 'Issued'
    },
    {
      customerRef: 'ARAMPETRO135',
      bankRef: 'CIMBILCO0121',
      product: 'Import LC',
      operation: 'Amendment',
      ccy: 'USD',
      amount: '500,000',
      importer: 'Petronas Chemicals',
      exporter: 'Aramco',
      issueDate: '26-Jan-2024',
      expiryDate: '30-Oct-2025',
      status: 'Issued'
    },
    {
      customerRef: 'BUFOPETRO003',
      bankRef: 'CIMBILCO0118',
      product: 'Import LC',
      operation: 'Cancel',
      ccy: 'MYR',
      amount: '1,020,000',
      importer: 'Petronas Chemicals',
      exporter: 'Bufori',
      issueDate: '20-Oct-2024',
      expiryDate: '19-Dec-2024',
      status: 'Cancelled'
    },
    {
      customerRef: 'HICOMPET53792',
      bankRef: 'CLMCIMB052',
      product: 'Import Bills under LC',
      operation: 'Bill Payment',
      ccy: 'MYR',
      amount: '100,000',
      importer: 'Petronas Chemicals',
      exporter: 'DRB-HICO',
      issueDate: '30-Aug-2024',
      expiryDate: '30-Nov-2024',
      status: 'Paid'
    },
    {
      customerRef: 'SHELLPETREUR17',
      bankRef: 'CLMCIMB674',
      product: 'Import Bills under Collection',
      operation: 'Bill Payment',
      ccy: 'EUR',
      amount: '1,200,000',
      importer: 'Petronas Chemicals',
      exporter: 'Shell Deutschela',
      issueDate: '15-Jan-2024',
      expiryDate: '31-Mar-2024',
      status: 'Paid'
    },
    {
      customerRef: 'ARAMPETRO197',
      bankRef: 'CIMBILCO0119',
      product: 'Import LC',
      operation: '-',
      ccy: 'USD',
      amount: '1,000,000',
      importer: 'Petronas Chemicals',
      exporter: 'Aramco',
      issueDate: '26-Mar-2023',
      expiryDate: '31-Dec-2024',
      status: 'Expired'
    }
  ];

  const swiftData = [
    {
      transactionRef: 'ARAMPETRO199',
      relatedRef: '-',
      direction: 'Outward',
      source: 'Portal',
      messageType: 'MT798<770>',
      messageDesc: 'ILC Issuance Notification',
      date: '26-Mar-2025',
      toFrom: 'CIBBMYKL Petronas Chemicals',
      status: 'ACK'
    },
    {
      transactionRef: 'CIMBILC0123',
      relatedRef: 'ARAMPETRO199',
      direction: 'Outward',
      source: 'Bank',
      messageType: 'MT 700',
      messageDesc: 'Issuance of Letter of Credit',
      date: '26-Mar-2025',
      toFrom: 'Petronas Chemicals CIBBMYKL',
      status: 'ACK'
    },
    {
      transactionRef: 'CLMILC6758',
      relatedRef: 'CIMBILC0123',
      direction: 'Inward',
      source: 'Bank',
      messageType: 'MT798<748> MT798<750>',
      messageDesc: 'Discrepancy Notification',
      date: '31-Mar-2025',
      toFrom: 'Petronas Chemicals CIBBMYKL',
      status: 'ACK'
    },
    {
      transactionRef: 'CLMILC6758',
      relatedRef: 'CIMBILC0123',
      direction: 'Outward',
      source: 'Portal',
      messageType: 'MT798<749>',
      messageDesc: 'Response to Discrepancy Notification',
      date: '31-Mar-2025',
      toFrom: 'CIBBMYKL Petronas Chemicals',
      status: 'ACK'
    }
  ];

  const documentsData = [
    {
      documentId: 'PO1234',
      docType: 'Purchase Order',
      uploadDate: '08-May-2025',
      uploadedBy: 'Portal',
      uploadedAt: 'Transaction',
      transactionRef: 'ILCREQ3456',
      productType: 'Import Letter of Credit',
      operation: 'Request Issuance'
    },
    {
      documentId: 'PI34567',
      docType: 'Proforma Invoice',
      uploadDate: '07-May-2025',
      uploadedBy: 'Bank',
      uploadedAt: 'Transaction',
      transactionRef: 'ILCAMD4567',
      productType: 'Import Letter of Credit',
      operation: 'Amendment'
    },
    {
      documentId: 'BOL9878',
      docType: 'Bill of Lading',
      uploadDate: '08-May-2025',
      uploadedBy: 'Portal',
      uploadedAt: 'Secured Communication',
      transactionRef: '-',
      productType: '-',
      operation: '-'
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'issued':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'expired':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'ack':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Inquiry Function</h2>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-12">
          <span className="hover:underline cursor-pointer">Home</span> &gt; Inquiry Function
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 mb-6">
          <TabsTrigger value="transaction" className="data-[state=active]:bg-corporate-peach-100 data-[state=active]:text-corporate-peach-800 dark:data-[state=active]:bg-corporate-peach-500/20 dark:data-[state=active]:text-corporate-peach-300">
            Transaction Inquiry
          </TabsTrigger>
          <TabsTrigger value="swift" className="data-[state=active]:bg-corporate-peach-100 data-[state=active]:text-corporate-peach-800 dark:data-[state=active]:bg-corporate-peach-500/20 dark:data-[state=active]:text-corporate-peach-300">
            SWIFT Inquiry
          </TabsTrigger>
          <TabsTrigger value="document" className="data-[state=active]:bg-corporate-peach-100 data-[state=active]:text-corporate-peach-800 dark:data-[state=active]:bg-corporate-peach-500/20 dark:data-[state=active]:text-corporate-peach-300">
            Document Attachment Inquiry
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {activeTab === 'transaction' && (
            <>
              <div className="md:col-span-4">
                <Input placeholder="Reference, Ccy, Amount, Importer, Exporter" className="w-full" />
              </div>
              <div className="md:col-span-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Product Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="lc">Letter of Credit</SelectItem>
                    <SelectItem value="bg">Bank Guarantee</SelectItem>
                    <SelectItem value="bills">Bills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="issued">Issued</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <div className="flex">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Issue Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="From-To Date" className="max-w-[150px] ml-2" />
                  <Button variant="ghost" size="icon" className="ml-1">
                    <Calendar className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'swift' && (
            <>
              <div className="md:col-span-4">
                <Input placeholder="Reference, Product" className="w-full" />
              </div>
              <div className="md:col-span-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Outward/Inward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="outward">Outward</SelectItem>
                    <SelectItem value="inward">Inward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ack">Acknowledged</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <div className="flex">
                  <Input placeholder="From-To Date" className="flex-grow" />
                  <Button variant="ghost" size="icon" className="ml-1">
                    <Calendar className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="md:col-span-1">
                <div className="flex items-center gap-2">
                  <Checkbox id="mt798" />
                  <label htmlFor="mt798" className="text-sm">Show only MT798</label>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'document' && (
            <>
              <div className="md:col-span-4">
                <Input placeholder="Reference, Product, Document ID, Type/Name" className="w-full" />
              </div>
              <div className="md:col-span-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Uploaded by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="portal">Portal</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Uploaded at" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="transaction">Transaction</SelectItem>
                    <SelectItem value="comm">Secured Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4">
                <div className="flex">
                  <Input placeholder="From-To Date" className="flex-grow" />
                  <Button variant="ghost" size="icon" className="ml-1">
                    <Calendar className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <TabsContent value="transaction" className="mt-0">
          <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Customer Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Bank Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Product Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Operation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">CCY</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Importer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Exporter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Issue Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Expiry Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {transactionData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.customerRef}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.bankRef}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.product}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.operation}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.ccy}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.importer}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.exporter}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.issueDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.expiryDate}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="swift" className="mt-0">
          <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Transaction Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Related Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Out/In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Message Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Message Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">To/From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {swiftData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.transactionRef}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.relatedRef}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.direction}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.source}</td>
                    <td className="px-4 py-3 text-sm text-corporate-peach-600 dark:text-corporate-peach-300 hover:underline cursor-pointer">{row.messageType}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.messageDesc}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.toFrom}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="document" className="mt-0">
          <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Document ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Document Type/Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Document Upload Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Uploaded By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Uploaded at</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Transaction Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Product Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Operation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {documentsData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.documentId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.docType}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.uploadDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.uploadedBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.uploadedAt}</td>
                    <td className="px-4 py-3 text-sm text-corporate-peach-600 dark:text-corporate-peach-300 hover:underline cursor-pointer">{row.transactionRef !== '-' ? row.transactionRef : '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.productType}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.operation}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          className="bg-white dark:bg-transparent border-corporate-peach-300 dark:border-gray-600 text-corporate-peach-800 dark:text-corporate-peach-300 hover:bg-corporate-peach-50 dark:hover:bg-corporate-peach-900/10"
          onClick={onBack}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default InquiryFunction;
