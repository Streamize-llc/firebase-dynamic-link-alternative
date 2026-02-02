-- Add input validation to increment functions
-- Keep SECURITY DEFINER and anon GRANT (needed for link visitor click tracking)

-- ========================================
-- 1. Replace increment_click_count with input validation
-- ========================================
CREATE OR REPLACE FUNCTION increment_click_count(
  p_workspace_id UUID,
  p_slug VARCHAR
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_workspace_id IS NULL OR p_slug IS NULL OR length(p_slug) = 0 THEN
    RETURN;
  END IF;

  UPDATE deeplinks
  SET
    click_count = click_count + 1,
    updated_at = NOW()
  WHERE workspace_id = p_workspace_id
    AND slug = p_slug;
END;
$$;

-- ========================================
-- 2. Replace increment_workspace_click with input validation
-- ========================================
CREATE OR REPLACE FUNCTION increment_workspace_click(
  p_workspace_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_workspace_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE workspaces
  SET current_monthly_click_count = current_monthly_click_count + 1
  WHERE id = p_workspace_id;
END;
$$;
