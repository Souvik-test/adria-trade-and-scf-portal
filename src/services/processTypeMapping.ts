
export const getProductAndProcessType = (params: {
  actionType?: string;
  productType?: string;
  invoiceType?: string;
}) => {
  const { actionType, productType, invoiceType } = params;

  // Purchase Order mappings
  if (productType === "PO") {
    switch (actionType) {
      case "create":
        return { product_type: "PO", process_type: "Create" };
      default:
        return { product_type: "PO", process_type: "Create" };
    }
  }

  // Proforma Invoice mappings
  if (productType === "PI") {
    switch (actionType) {
      case "create":
        return { product_type: "PI", process_type: "Create" };
      default:
        return { product_type: "PI", process_type: "Create" };
    }
  }

  // Invoice mappings
  if (productType === "Invoice") {
    switch (invoiceType) {
      case "Credit Note":
        return { product_type: "Credit Note", process_type: "Create" };
      case "Debit Note":
        return { product_type: "Debit Note", process_type: "Create" };
      default:
        return { product_type: "Invoice", process_type: "Create" };
    }
  }

  // Import LC mappings
  if (productType === "Import LC") {
    switch (actionType) {
      case "create":
      case "issuance":
        return { product_type: "Import LC", process_type: "Issuance" };
      case "amendment":
        return { product_type: "Import LC", process_type: "Amendment" };
      case "cancellation":
        return { product_type: "Import LC", process_type: "Cancellation" };
      default:
        return { product_type: "Import LC", process_type: "Create" };
    }
  }

  // Export LC mappings
  if (productType === "Export LC") {
    switch (actionType) {
      case "record-manual-review":
        return { product_type: "Export LC", process_type: "Manual Review" };
      case "record-amendment-consent":
        return { product_type: "Export LC", process_type: "Amendment Response" };
      case "request-lc-transfer":
        return { product_type: "Export LC", process_type: "LC Transfer" };
      case "request-assignment":
        return { product_type: "Export LC", process_type: "Assignment Request" };
      default:
        return { product_type: "Export LC", process_type: "Review" };
    }
  }

  // Export LC Bills mappings
  if (productType === "EXPORT LC BILLS" || productType === "Export LC Bills") {
    switch (actionType) {
      case "resolve-discrepancies":
        return { product_type: "EXPORT LC BILLS", process_type: "RESOLVE DISCREPANCIES" };
      default:
        return { product_type: "EXPORT LC BILLS", process_type: "RESOLVE DISCREPANCIES" };
    }
  }

  // Bank Guarantee mappings
  if (productType === "BG") {
    switch (actionType) {
      case "create":
        return { product_type: "BG", process_type: "Create" };
      default:
        return { product_type: "BG", process_type: "Create" };
    }
  }

  // Default fallback
  return { product_type: productType || "Unknown", process_type: "Create" };
};
