-- Add Factoring Configuration columns to scf_program_configurations
ALTER TABLE scf_program_configurations 
ADD COLUMN factoring_enabled boolean DEFAULT false;

ALTER TABLE scf_program_configurations 
ADD COLUMN factoring_geography text DEFAULT NULL;

ALTER TABLE scf_program_configurations 
ADD COLUMN factoring_recourse_type text DEFAULT NULL;

ALTER TABLE scf_program_configurations 
ADD COLUMN factoring_disclosure text DEFAULT NULL;

ALTER TABLE scf_program_configurations 
ADD COLUMN factoring_delivery_model text DEFAULT NULL;

ALTER TABLE scf_program_configurations 
ADD COLUMN factoring_risk_bearer text DEFAULT NULL;

-- Add Buyer's Acceptance Required column to scf_invoices
ALTER TABLE scf_invoices 
ADD COLUMN buyers_acceptance_required boolean DEFAULT false;