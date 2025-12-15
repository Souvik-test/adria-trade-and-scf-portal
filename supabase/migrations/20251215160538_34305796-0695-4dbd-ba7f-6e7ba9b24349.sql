-- Update field_order for Goods and Shipment pane to appear before LC Terms and Conditions in Approval stage
-- First, find fields for 'Goods and Shipment' pane in Approval stage and lower their field_order

-- Get the stage ID for 'Approval' stage in the ILC workflow template
WITH approval_stage AS (
  SELECT ws.id as stage_id
  FROM workflow_stages ws
  JOIN workflow_templates wt ON ws.template_id = wt.id
  WHERE wt.product_code = 'ILC' 
    AND wt.event_code = 'ISS'
    AND ws.stage_name = 'Approval'
  LIMIT 1
)
UPDATE workflow_stage_fields
SET field_order = field_order - 10
WHERE stage_id IN (SELECT stage_id FROM approval_stage)
  AND pane = 'Goods and Shipment';

-- Increase field_order for LC Terms and Conditions to ensure it appears after Goods
WITH approval_stage AS (
  SELECT ws.id as stage_id
  FROM workflow_stages ws
  JOIN workflow_templates wt ON ws.template_id = wt.id
  WHERE wt.product_code = 'ILC' 
    AND wt.event_code = 'ISS'
    AND ws.stage_name = 'Approval'
  LIMIT 1
)
UPDATE workflow_stage_fields
SET field_order = field_order + 10
WHERE stage_id IN (SELECT stage_id FROM approval_stage)
  AND pane = 'LC Terms and Conditions';