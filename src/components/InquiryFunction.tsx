
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Search, Download, FileText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InquiryFunctionProps {
  onBack: () => void;
}

const InquiryFunction: React.FC<InquiryFunctionProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('transaction');
  
  // Transaction Inquiry States
  const [transactionFromDate, setTransactionFromDate] = useState<Date>();
  const [transactionToDate, setTransactionToDate] = useState<Date>();
  const [transactionReference, setTransactionReference] = useState('');
  const [transactionProduct, setTransactionProduct] = useState('');
  const [issueDateType, setIssueDateType] = useState('');
  const [productCategory, setProductCategory] = useState('');
  
  // SWIFT Inquiry States
  const [swiftFromDate, setSwiftFromDate] = useState<Date>();
  const [swiftToDate, setSwiftToDate] = useState<Date>();
  const [swiftReference, setSwiftReference] = useState('');
  const [swiftProduct, setSwiftProduct] = useState('');
  const [swiftSource, setSwiftSource] = useState('');
  const [messageType, setMessageType] = useState('');
  const [messageDescription, setMessageDescription] = useState('');
  const [swiftStatus, setSwiftStatus] = useState('');
  const [showOnlyMT798, setShowOnlyMT798] = useState(false);
  
  // Document Attachment Inquiry States
  const [docFromDate, setDocFromDate] = useState<Date>();
  const [docToDate, setDocToDate] = useState<Date>();
  const [docReference, setDocReference] = useState('');
  const [docProduct, setDocProduct] = useState('');

  const productCategories = [
    'Import Letter of Credit',
    'Export Letter of Credit',
    'Outward Bank Guarantee/SBLC',
    'Inward Bank Guarantee/SBLC',
    'Shipping Guarantee',
    'Import LC Bills',
    'Export LC Bills',
    'Outward Documentary Collection',
    'Inward Documentary Collection',
    'Import Trade Loan',
    'Export Trade Loan'
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Inquiry Functions</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transaction">Transaction Inquiry</TabsTrigger>
          <TabsTrigger value="swift">SWIFT Inquiry</TabsTrigger>
          <TabsTrigger value="document">Document Attachment Inquiry</TabsTrigger>
        </TabsList>

        <TabsContent value="transaction">
          <Card>
            <CardHeader>
              <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">Transaction Inquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !transactionFromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {transactionFromDate ? format(transactionFromDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={transactionFromDate}
                        onSelect={setTransactionFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !transactionToDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {transactionToDate ? format(transactionToDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={transactionToDate}
                        onSelect={setTransactionToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reference</label>
                  <Input
                    placeholder="Enter transaction reference"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Input
                    placeholder="Enter product"
                    value={transactionProduct}
                    onChange={(e) => setTransactionProduct(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Date</label>
                  <Select value={issueDateType} onValueChange={setIssueDateType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="issue">Issue Date</SelectItem>
                      <SelectItem value="expiry">Expiry Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Category</label>
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button className="bg-corporate-peach-500 hover:bg-corporate-peach-600 text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swift">
          <Card>
            <CardHeader>
              <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">SWIFT Inquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !swiftFromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {swiftFromDate ? format(swiftFromDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={swiftFromDate}
                        onSelect={setSwiftFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !swiftToDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {swiftToDate ? format(swiftToDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={swiftToDate}
                        onSelect={setSwiftToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Show Only MT 798</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showOnlyMT798}
                    onChange={(e) => setShowOnlyMT798(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Enable MT 798 filter</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-corporate-peach-600 dark:text-corporate-peach-400">Universal Search</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reference</label>
                    <Input
                      placeholder="Enter reference"
                      value={swiftReference}
                      onChange={(e) => setSwiftReference(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product</label>
                    <Input
                      placeholder="Enter product"
                      value={swiftProduct}
                      onChange={(e) => setSwiftProduct(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source</label>
                    <Input
                      placeholder="Enter source"
                      value={swiftSource}
                      onChange={(e) => setSwiftSource(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Type</label>
                    <Input
                      placeholder="Enter message type"
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Description</label>
                    <Input
                      placeholder="Enter description"
                      value={messageDescription}
                      onChange={(e) => setMessageDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={swiftStatus} onValueChange={setSwiftStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="ack">ACK</SelectItem>
                        <SelectItem value="nack">NACK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-corporate-peach-500 hover:bg-corporate-peach-600 text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="document">
          <Card>
            <CardHeader>
              <CardTitle className="text-corporate-peach-600 dark:text-corporate-peach-400">Document Attachment Inquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !docFromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {docFromDate ? format(docFromDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={docFromDate}
                        onSelect={setDocFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !docToDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {docToDate ? format(docToDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={docToDate}
                        onSelect={setDocToDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reference</label>
                  <Input
                    placeholder="Enter reference"
                    value={docReference}
                    onChange={(e) => setDocReference(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Input
                    placeholder="Enter product"
                    value={docProduct}
                    onChange={(e) => setDocProduct(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-corporate-peach-500 hover:bg-corporate-peach-600 text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InquiryFunction;
