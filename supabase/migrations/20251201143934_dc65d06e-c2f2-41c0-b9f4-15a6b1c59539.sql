-- Modify target_audience column to support multiple audiences
ALTER TABLE product_event_mapping 
ALTER COLUMN target_audience TYPE text[] USING ARRAY[target_audience];