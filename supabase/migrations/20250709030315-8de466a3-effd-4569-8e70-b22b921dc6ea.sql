
-- Remove the trigger that auto-generates documentary collection bill references
DROP TRIGGER IF EXISTS set_documentary_collection_bill_reference_trigger ON public.outward_documentary_collection_bills;

-- Drop the function that generates documentary collection bill references
DROP FUNCTION IF EXISTS public.set_documentary_collection_bill_reference();

-- Drop the function that generates documentary collection bill references
DROP FUNCTION IF EXISTS public.generate_documentary_collection_bill_ref();
