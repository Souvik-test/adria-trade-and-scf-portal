
-- Remove automatic transaction trigger for export_lc_reviews, as trigger cannot access JWT/email
-- Now, transaction creation will be handled in the application code.

-- Drop the trigger that calls after_export_lc_review_submit on export_lc_reviews
DROP TRIGGER IF EXISTS trg_after_export_lc_review_submit ON public.export_lc_reviews;

-- Drop the after_export_lc_review_submit function itself (no longer needed)
DROP FUNCTION IF EXISTS public.after_export_lc_review_submit;
