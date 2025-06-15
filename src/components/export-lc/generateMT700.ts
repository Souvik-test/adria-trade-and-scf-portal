
/**
 * Utility function to generate a basic SWIFT MT 700 draft as plain text.
 * This is highly simplified and should be expanded for production use.
 */
export function generateMT700(data: any): string {
  // Compose the message as a text according to SWIFT MT 700 key fields
  // See: https://www2.swift.com/knowledgecenter/publications/us7_20230724/1.13?topic=reference-swift-message-types_700
  return [
    "{1:F01YOURBANKXXXXX1234567890}{2:I700RECEIVERXXXXN}{4:",
    `:20:${data.lcReference}`,
    `:31C:${data.issueDate}`,
    `:31D:${data.expiryDate}`,
    `:32B:${data.currency} ${data.amount}`,
    `:50:${data.parties?.find((p: any) => p.role.includes("Applicant"))?.name || ""}`,
    `:59:${data.parties?.find((p: any) => p.role.includes("Beneficiary"))?.name || ""}`,
    `:44A:${data.shipment?.shipmentFrom || ""}`,
    `:44E:${data.shipment?.shipmentTo || ""}`,
    `:44C:${data.shipment?.latestShipmentDate || ""}`,
    `:46A:${(data.documents || []).map((d: string) => d).join("; ")}`,
    `:47A:${data.additionalConditions || ""}`,
    "-}"
  ].join("\n");
}
