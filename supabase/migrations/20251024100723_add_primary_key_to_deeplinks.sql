-- Add id column and primary key to deeplinks table
-- This is required for Supabase to allow updates and deletes

-- 1. Add id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'deeplinks'
    AND column_name = 'id'
  ) THEN
    ALTER TABLE deeplinks
      ADD COLUMN id UUID DEFAULT gen_random_uuid() NOT NULL;
  END IF;
END $$;

-- 2. Add primary key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'deeplinks_pkey'
  ) THEN
    ALTER TABLE deeplinks
      ADD CONSTRAINT deeplinks_pkey PRIMARY KEY (id);
  END IF;
END $$;
