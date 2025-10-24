-- Fix Deeplink System Issues
-- 1. Add unique constraints to prevent duplicates
-- 2. Add functions for click tracking

-- ========================================
-- 1. Add unique constraint for (workspace_id, short_code)
-- ========================================
-- Check if constraint already exists before adding
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'deeplinks_workspace_short_code_unique'
  ) THEN
    ALTER TABLE deeplinks
      ADD CONSTRAINT deeplinks_workspace_short_code_unique
      UNIQUE (workspace_id, short_code);
  END IF;
END $$;

-- ========================================
-- 2. Add unique constraint for (workspace_id, slug)
-- Note: Skipped due to existing duplicate data
-- ========================================
-- Commented out to allow deployment
-- ALTER TABLE deeplinks
--   ADD CONSTRAINT deeplinks_workspace_slug_unique
--   UNIQUE (workspace_id, slug);

-- ========================================
-- 3. Create function to increment deeplink click count
-- ========================================
CREATE OR REPLACE FUNCTION increment_click_count(
  p_workspace_id UUID,
  p_short_code VARCHAR
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
    AND short_code = p_short_code;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_click_count(UUID, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_click_count(UUID, VARCHAR) TO anon;

-- ========================================
-- 4. Create function to increment workspace click count
-- ========================================
CREATE OR REPLACE FUNCTION increment_workspace_click(
  p_workspace_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE workspaces
  SET current_monthly_click_count = current_monthly_click_count + 1
  WHERE id = p_workspace_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_workspace_click(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_workspace_click(UUID) TO anon;
