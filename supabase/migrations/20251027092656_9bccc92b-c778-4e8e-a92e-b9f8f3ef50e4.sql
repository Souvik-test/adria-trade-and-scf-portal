-- Insert custom user record for souvik.chakraborty@adria-bt.com
INSERT INTO custom_users (
  id,
  user_id,
  user_login_id,
  full_name,
  corporate_id,
  password_hash,
  role_type,
  product_linkage
) VALUES (
  '82dbcebc-82dc-4db9-80d1-f0236eb75c14',
  'souvik.chakraborty@adria-bt.com',
  'souvik.chakraborty@adria-bt.com',
  'Souvik Chakraborty',
  'DEMO_CORP_001',
  'demo_password_hash',
  'All',
  ARRAY['Import LC', 'Export LC', 'Import Bills', 'Export Bills', 
        'Outward BG/SBLC', 'Inward BG/SBLC', 'Shipping Guarantee', 
        'Import Loan', 'Export Loan']::product_type[]
)
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  user_login_id = EXCLUDED.user_login_id,
  corporate_id = EXCLUDED.corporate_id;