-- Add business_application column to product_event_mapping table
ALTER TABLE product_event_mapping
ADD COLUMN business_application text[] DEFAULT '{}';

COMMENT ON COLUMN product_event_mapping.business_application IS 'Multi-select array of business applications: Adria TSCF Client, Adria Process Orchestrator, Adria TSCF Bank';