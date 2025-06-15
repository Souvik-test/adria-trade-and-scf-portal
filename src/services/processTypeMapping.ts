
// Map input data to the right product_type and process_type
export function getProductAndProcessType(actionArgs: {
  actionType: string;
  productType?: string;
  invoiceType?: string;
}): { product_type: string; process_type: string } {
  // Export LC
  if (actionArgs.productType === "Export LC" || actionArgs.productType === "LC Amendment") {
    switch (actionArgs.actionType) {
      case "record-amendment-consent":
        return { product_type: "Export LC", process_type: "Record Amendment Consent" };
      case "review-pre-adviced-lc":
        return { product_type: "Export LC", process_type: "Review Pre-Adviced LC" };
      case "request-transfer":
        return { product_type: "Export LC", process_type: "Request Transfer" };
      case "request-assignment":
        return { product_type: "Export LC", process_type: "Request Assignment" };
      default:
        return { product_type: "Export LC", process_type: "Record Amendment Consent" };
    }
  }
  // Import LC
  if (actionArgs.productType === "Import LC") {
    switch (actionArgs.actionType) {
      case "request-issuance":
        return { product_type: "Import LC", process_type: "Request Issuance" };
      case "request-amendment":
        return { product_type: "Import LC", process_type: "Request Amendment" };
      case "request-cancellation":
        return { product_type: "Import LC", process_type: "Request Cancellation" };
      default:
        return { product_type: "Import LC", process_type: "Request Issuance" };
    }
  }
  // PO/PI
  if (actionArgs.productType === "PO" || actionArgs.productType === "PI") {
    switch (actionArgs.actionType) {
      case "amend":
        return { product_type: actionArgs.productType, process_type: "Amend" };
      case "cancel":
        return { product_type: actionArgs.productType, process_type: "Cancel" };
      default:
        return { product_type: actionArgs.productType, process_type: "Create" };
    }
  }
  // Invoice, Credit Note, Debit Note
  if (actionArgs.invoiceType === "Credit Note") {
    switch (actionArgs.actionType) {
      case "amend":
        return { product_type: "Credit Note", process_type: "Amend" };
      case "cancel":
        return { product_type: "Credit Note", process_type: "Cancel" };
      default:
        return { product_type: "Credit Note", process_type: "Create" };
    }
  }
  if (actionArgs.invoiceType === "Debit Note") {
    switch (actionArgs.actionType) {
      case "amend":
        return { product_type: "Debit Note", process_type: "Amend" };
      case "cancel":
        return { product_type: "Debit Note", process_type: "Cancel" };
      default:
        return { product_type: "Debit Note", process_type: "Create" };
    }
  }
  if (actionArgs.invoiceType === "Invoice" || actionArgs.productType === "Invoice") {
    switch (actionArgs.actionType) {
      case "amend":
        return { product_type: "Invoice", process_type: "Amend" };
      case "cancel":
        return { product_type: "Invoice", process_type: "Cancel" };
      default:
        return { product_type: "Invoice", process_type: "Create" };
    }
  }
  // fallback
  return { product_type: actionArgs.productType || "Invoice", process_type: "Create" };
}
