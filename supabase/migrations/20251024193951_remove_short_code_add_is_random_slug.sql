-- Remove short_code field and add is_random_slug field
-- This migration unifies URL routing to use slug only

-- ========================================
-- 1. Add is_random_slug column
-- ========================================
ALTER TABLE deeplinks
  ADD COLUMN is_random_slug BOOLEAN NOT NULL DEFAULT false;

-- ========================================
-- 2. Drop short_code unique constraint
-- ========================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'deeplinks_workspace_short_code_unique'
  ) THEN
    ALTER TABLE deeplinks
      DROP CONSTRAINT deeplinks_workspace_short_code_unique;
  END IF;
END $$;

-- ========================================
-- 3. Handle duplicate slugs before adding unique constraint
-- ========================================
-- Add suffix to duplicate slugs (e.g., slug-1, slug-2)
WITH duplicates AS (
  SELECT
    id,
    workspace_id,
    slug,
    ROW_NUMBER() OVER (PARTITION BY workspace_id, slug ORDER BY created_at) as rn
  FROM deeplinks
)
UPDATE deeplinks d
SET slug = d.slug || '-' || (dup.rn - 1)
FROM duplicates dup
WHERE d.id = dup.id AND dup.rn > 1;

-- ========================================
-- 4. Add unique constraint for (workspace_id, slug)
-- ========================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'deeplinks_workspace_slug_unique'
  ) THEN
    ALTER TABLE deeplinks
      ADD CONSTRAINT deeplinks_workspace_slug_unique
      UNIQUE (workspace_id, slug);
  END IF;
END $$;

-- ========================================
-- 5. Drop short_code column
-- ========================================
ALTER TABLE deeplinks
  DROP COLUMN IF EXISTS short_code;

-- ========================================
-- 6. Drop old increment_click_count function
-- ========================================
DROP FUNCTION IF EXISTS increment_click_count(UUID, VARCHAR);

-- ========================================
-- 7. Create new increment_click_count function with slug parameter
-- ========================================
CREATE FUNCTION increment_click_count(
  p_workspace_id UUID,
  p_slug VARCHAR
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE deeplinks
  SET
    click_count = click_count + 1,
    updated_at = NOW()
  WHERE workspace_id = p_workspace_id
    AND slug = p_slug;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_click_count(UUID, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_click_count(UUID, VARCHAR) TO anon;
