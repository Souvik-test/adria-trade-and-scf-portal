
import React from "react";

interface Shipment {
  shipmentFrom: string;
  shipmentTo: string;
  partialShipments: string;
  transshipment: string;
  latestShipmentDate: string;
  presentationPeriod: string;
  description: string;
}
interface ShipmentPaneProps {
  expanded: boolean;
  togglePane: () => void;
  shipment: Shipment;
  PaneChevron: React.FC<{ open: boolean }>;
}

const ShipmentPane: React.FC<ShipmentPaneProps> = ({
  expanded,
  togglePane,
  shipment,
  PaneChevron,
}) => (
  <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
    <button
      className="flex items-center gap-2 w-full px-6 py-4 text-left"
      onClick={togglePane}
      aria-expanded={expanded}
      type="button"
    >
      <span className="text-blue-600 dark:text-blue-400 text-lg">🌐</span>
      <span className="font-semibold text-lg text-gray-800 dark:text-white">Shipment & Delivery</span>
      <div className="ml-auto"><PaneChevron open={expanded} /></div>
    </button>
    {expanded && (
      <div className="px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Shipment From</div>
            <div className="font-semibold text-gray-900 dark:text-white">{shipment.shipmentFrom}</div>
          </div>
          <div>
            <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Shipment To</div>
            <div className="font-semibold text-gray-900 dark:text-white">{shipment.shipmentTo}</div>
          </div>
          <div>
            <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Partial Shipments</div>
            <div className="font-semibold text-gray-900 dark:text-white">{shipment.partialShipments}</div>
          </div>
          <div>
            <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Transshipment</div>
            <div className="font-semibold text-gray-900 dark:text-white">{shipment.transshipment}</div>
          </div>
          <div>
            <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Latest Shipment Date</div>
            <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              <span role="img" aria-label="calendar">📅</span> {shipment.latestShipmentDate}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Presentation Period</div>
            <div className="font-semibold text-gray-900 dark:text-white">{shipment.presentationPeriod}</div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4">
          <div className="font-medium text-sm text-blue-900 dark:text-blue-200 mb-1">
            <span role="img" aria-label="cube">📦</span> Description of Goods/Services
          </div>
          <div className="text-gray-900 dark:text-gray-200">
            {shipment.description}
          </div>
        </div>
      </div>
    )}
  </section>
);

export default ShipmentPane;
