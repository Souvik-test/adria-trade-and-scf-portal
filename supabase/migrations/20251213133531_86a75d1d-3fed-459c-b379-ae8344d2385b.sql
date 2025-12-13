-- Update the workflow template status to Active for ILC Issuance Manual
UPDATE workflow_templates
SET status = 'Active'
WHERE product_code = 'ILC'
  AND event_code = 'ISS'
  AND 'Manual' = ANY(trigger_types)
  AND status = 'draft';