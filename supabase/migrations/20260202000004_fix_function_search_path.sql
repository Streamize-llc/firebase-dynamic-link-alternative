-- Fix search_path security warning on SECURITY DEFINER functions
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

CREATE OR REPLACE FUNCTION increment_click_count(
  p_workspace_id UUID,
  p_slug VARCHAR
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION increment_workspace_click(
  p_workspace_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
