-- Add field_actions JSONB column to field_repository for computed fields and conditional logic
ALTER TABLE public.field_repository 
ADD COLUMN IF NOT EXISTS field_actions JSONB DEFAULT NULL;

-- Add comment to describe the column structure
COMMENT ON COLUMN public.field_repository.field_actions IS 
'JSON structure for field actions: {
  "is_computed": boolean,
  "computed_formula": "formula_string",
  "triggers": [
    {
      "when_value": ["value1", "value2"],
      "show_fields": ["FIELD_CODE_1", "FIELD_CODE_2"],
      "hide_fields": ["FIELD_CODE_3"],
      "filter_dropdowns": { "TARGET_FIELD": ["allowed_value1", "allowed_value2"] }
    }
  ],
  "dropdown_filter_source": "SOURCE_FIELD_CODE"
}';