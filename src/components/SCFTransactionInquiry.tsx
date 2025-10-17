import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Search, SlidersHorizontal, X, Columns3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { fetchSCFTransactions, exportToCSV, exportToExcel } from "@/services/scfTransactionInquiryService";
import { TransactionFilters, SCFTransactionRow, DEFAULT_COLUMNS, ColumnConfig } from "@/types/scfTransaction";
import { SCFTransactionInquiryTable } from "./SCFTransactionInquiryTable";
import { FilterColumnSelector } from "./FilterColumnSelector";
import { ColumnDisplaySelector } from "./ColumnDisplaySelector";

export default function SCFTransactionInquiry() {
  const [transactions, setTransactions] = useState<SCFTransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterSelector, setShowFilterSelector] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [wildcardSearch, setWildcardSearch] = useState("");
  const [selectedFilterColumns, setSelectedFilterColumns] = useState<string[]>([
    "productType",
    "transactionReference",
    "programId",
    "anchorId",
    "counterPartyId",
    "fromDate",
    "toDate",
    "status",
  ]);
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);

  const [filters, setFilters] = useState<TransactionFilters>({
    wildcardSearch: "",
    productType: "",
    transactionReference: "",
    programId: "",
    programName: "",
    anchorId: "",
    anchorName: "",
    counterPartyId: "",
    counterPartyName: "",
    status: "",
    currency: "",
    fromDate: "",
    toDate: "",
    minAmount: undefined,
    maxAmount: undefined,
  });

  const handleFilterChange = (field: keyof TransactionFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchFilters = wildcardSearch.trim() 
        ? { wildcardSearch: wildcardSearch.trim() }
        : filters;
      
      const data = await fetchSCFTransactions(searchFilters);
      setTransactions(data);
      toast({
        title: "Search Complete",
        description: `Found ${data.length} transaction(s)`,
      });
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setWildcardSearch("");
    setFilters({
      wildcardSearch: "",
      productType: "",
      transactionReference: "",
      programId: "",
      programName: "",
      anchorId: "",
      anchorName: "",
      counterPartyId: "",
      counterPartyName: "",
      status: "",
      currency: "",
      fromDate: "",
      toDate: "",
      minAmount: undefined,
      maxAmount: undefined,
    });
  };

  const handleRemoveFilter = (field: keyof TransactionFilters) => {
    handleFilterChange(field, "");
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast({
        title: "No Data",
        description: "No transactions to export",
        variant: "destructive",
      });
      return;
    }

    try {
      exportToCSV(transactions);
      toast({
        title: "Export Successful",
        description: "CSV file has been downloaded",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = async () => {
    if (transactions.length === 0) {
      toast({
        title: "No Data",
        description: "No transactions to export",
        variant: "destructive",
      });
      return;
    }

    try {
      await exportToExcel(transactions);
      toast({
        title: "Export Successful",
        description: "Excel file has been downloaded",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleApplyFilterColumns = (columns: string[]) => {
    setSelectedFilterColumns(columns);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    key !== 'wildcardSearch' && value !== "" && value !== undefined
  );

  const activeFilterLabels: Record<string, string> = {
    productType: "Product Type",
    transactionReference: "Transaction Ref",
    programId: "Program ID",
    programName: "Program Name",
    anchorId: "Anchor ID",
    anchorName: "Anchor Name",
    counterPartyId: "Counter Party ID",
    counterPartyName: "Counter Party Name",
    status: "Status",
    currency: "Currency",
    fromDate: "From Date",
    toDate: "To Date",
    minAmount: "Min Amount",
    maxAmount: "Max Amount",
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction Inquiry - Supply Chain Finance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wildcard Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={wildcardSearch}
              onChange={(e) => setWildcardSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilterSelector(true)}
            title="Select filter columns"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Active Filter Badges */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <Badge key={key} variant="secondary" className="gap-1">
                {activeFilterLabels[key]}: {String(value)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveFilter(key as keyof TransactionFilters)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Collapsible Filter Section */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {showFilters ? "▼" : "▶"} Advanced Filters
                {activeFilters.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground"
            >
              Clear Filters
            </Button>
          </div>

          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFilterColumns.includes("productType") && (
                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type</Label>
                  <Select value={filters.productType} onValueChange={(value) => handleFilterChange("productType", value)}>
                    <SelectTrigger id="productType">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Invoice">Invoice</SelectItem>
                      <SelectItem value="Credit Note">Credit Note</SelectItem>
                      <SelectItem value="Debit Note">Debit Note</SelectItem>
                      <SelectItem value="Finance Disbursement">Finance Disbursement</SelectItem>
                      <SelectItem value="Finance Repayment">Finance Repayment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedFilterColumns.includes("transactionReference") && (
                <div className="space-y-2">
                  <Label htmlFor="transactionReference">Transaction Reference</Label>
                  <Input
                    id="transactionReference"
                    placeholder="Enter reference"
                    value={filters.transactionReference}
                    onChange={(e) => handleFilterChange("transactionReference", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("programId") && (
                <div className="space-y-2">
                  <Label htmlFor="programId">Program ID</Label>
                  <Input
                    id="programId"
                    placeholder="Enter program ID"
                    value={filters.programId}
                    onChange={(e) => handleFilterChange("programId", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("programName") && (
                <div className="space-y-2">
                  <Label htmlFor="programName">Program Name</Label>
                  <Input
                    id="programName"
                    placeholder="Enter program name"
                    value={filters.programName}
                    onChange={(e) => handleFilterChange("programName", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("anchorId") && (
                <div className="space-y-2">
                  <Label htmlFor="anchorId">Anchor ID</Label>
                  <Input
                    id="anchorId"
                    placeholder="Enter anchor ID"
                    value={filters.anchorId}
                    onChange={(e) => handleFilterChange("anchorId", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("anchorName") && (
                <div className="space-y-2">
                  <Label htmlFor="anchorName">Anchor Name</Label>
                  <Input
                    id="anchorName"
                    placeholder="Enter anchor name"
                    value={filters.anchorName}
                    onChange={(e) => handleFilterChange("anchorName", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("counterPartyId") && (
                <div className="space-y-2">
                  <Label htmlFor="counterPartyId">Counter Party ID</Label>
                  <Input
                    id="counterPartyId"
                    placeholder="Enter counter party ID"
                    value={filters.counterPartyId}
                    onChange={(e) => handleFilterChange("counterPartyId", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("counterPartyName") && (
                <div className="space-y-2">
                  <Label htmlFor="counterPartyName">Counter Party Name</Label>
                  <Input
                    id="counterPartyName"
                    placeholder="Enter counter party name"
                    value={filters.counterPartyName}
                    onChange={(e) => handleFilterChange("counterPartyName", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("currency") && (
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    placeholder="e.g., USD"
                    value={filters.currency}
                    onChange={(e) => handleFilterChange("currency", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("fromDate") && (
                <div className="space-y-2">
                  <Label htmlFor="fromDate">From Date</Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("toDate") && (
                <div className="space-y-2">
                  <Label htmlFor="toDate">To Date</Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange("toDate", e.target.value)}
                  />
                </div>
              )}

              {selectedFilterColumns.includes("status") && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="Lodged">Lodged</SelectItem>
                      <SelectItem value="Financed">Financed</SelectItem>
                      <SelectItem value="Repaid">Repaid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedFilterColumns.includes("amountRange") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Min Amount</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      placeholder="0"
                      value={filters.minAmount || ""}
                      onChange={(e) => handleFilterChange("minAmount", e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Max Amount</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      placeholder="999999"
                      value={filters.maxAmount || ""}
                      onChange={(e) => handleFilterChange("maxAmount", e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Search Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
          >
            <Search className="mr-2 h-4 w-4" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Results and Export */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {transactions.length} transaction(s) found
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSelector(true)}
            >
              <Columns3 className="h-4 w-4 mr-2" />
              Columns
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={transactions.length === 0}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={transactions.length === 0}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* Transaction Table - Always Visible */}
        <SCFTransactionInquiryTable 
          transactions={transactions} 
          loading={loading} 
          columnConfig={columnConfig}
        />

        {/* Filter Column Selector Sheet */}
        <FilterColumnSelector
          open={showFilterSelector}
          onOpenChange={setShowFilterSelector}
          selectedColumns={selectedFilterColumns}
          onApply={handleApplyFilterColumns}
        />

        {/* Column Display Selector Sheet */}
        <ColumnDisplaySelector
          open={showColumnSelector}
          onOpenChange={setShowColumnSelector}
          columnConfig={columnConfig}
          onApply={setColumnConfig}
        />
      </CardContent>
    </Card>
  );
}
