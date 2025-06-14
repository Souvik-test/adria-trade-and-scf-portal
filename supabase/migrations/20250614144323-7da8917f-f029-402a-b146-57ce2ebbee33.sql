
-- Create the storage bucket for LC supporting documents
insert into storage.buckets (id, name, public)
values ('lc-supporting-documents', 'lc-supporting-documents', false)
on conflict do nothing;

-- Grant full public permissions (for development, can refine later)
-- Read/Upload/Delete allowed for authenticated users
-- (You may want to restrict these further based on your auth model)

-- Policy: allow any authenticated user to upload, update, or delete objects in the bucket
create policy "Authenticated users can access LC supporting docs"
on storage.objects
for all
using (
  bucket_id = 'lc-supporting-documents' AND auth.role() = 'authenticated'
);
