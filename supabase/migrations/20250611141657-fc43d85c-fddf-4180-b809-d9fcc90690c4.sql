
-- First, check if the enum types exist and create them if they don't
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('Maker', 'Checker', 'Viewer', 'All');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_type AS ENUM (
      'Import LC',
      'Export LC', 
      'Import Bills',
      'Export Bills',
      'Outward BG/SBLC',
      'Inward BG/SBLC',
      'Shipping Guarantee',
      'Import Loan',
      'Export Loan'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update user_profiles table to include the new columns if they don't exist
DO $$ BEGIN
    ALTER TABLE user_profiles ADD COLUMN corporate_id TEXT DEFAULT 'TC001';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE user_profiles ADD COLUMN user_login_id TEXT UNIQUE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE user_profiles ADD COLUMN role_type user_role_type DEFAULT 'Viewer';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE user_profiles ADD COLUMN product_linkage product_type[];
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;
