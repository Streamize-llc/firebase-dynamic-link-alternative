-- Fix infinite recursion: workspaces policies query workspace_memberships,
-- whose policies query workspaces back, causing a loop.
-- Solution: SECURITY DEFINER helper that bypasses RLS when checking ownership.

-- ========================================
-- 1. Helper function to check workspace ownership (bypasses RLS)
-- ========================================
CREATE OR REPLACE FUNCTION is_workspace_owner(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces WHERE id = ws_id AND owner_id = (select auth.uid())
  );
$$;

GRANT EXECUTE ON FUNCTION is_workspace_owner(UUID) TO authenticated;

-- ========================================
-- 2. Helper function to check workspace membership (bypasses RLS)
-- ========================================
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_memberships
    WHERE workspace_id = ws_id
      AND user_id = (select auth.uid())
      AND status = 'ACCEPTED'
  );
$$;

GRANT EXECUTE ON FUNCTION is_workspace_member(UUID) TO authenticated;

-- ========================================
-- 3. Fix workspace_memberships policies (remove direct workspaces query)
-- ========================================
DROP POLICY IF EXISTS "memberships_auth_select" ON workspace_memberships;
CREATE POLICY "memberships_auth_select" ON workspace_memberships
  FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid())
    OR is_workspace_owner(workspace_id)
  );

DROP POLICY IF EXISTS "memberships_auth_update" ON workspace_memberships;
CREATE POLICY "memberships_auth_update" ON workspace_memberships
  FOR UPDATE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR is_workspace_owner(workspace_id)
  );

DROP POLICY IF EXISTS "memberships_auth_insert" ON workspace_memberships;
CREATE POLICY "memberships_auth_insert" ON workspace_memberships
  FOR INSERT TO authenticated
  WITH CHECK (
    is_workspace_owner(workspace_id)
  );

-- ========================================
-- 4. Fix subscriptions policy (also queries workspaces)
-- ========================================
DROP POLICY IF EXISTS "subscriptions_auth_owner_select" ON subscriptions;
CREATE POLICY "subscriptions_auth_owner_select" ON subscriptions
  FOR SELECT TO authenticated
  USING (
    is_workspace_owner(workspace_id)
  );

-- ========================================
-- 5. Fix workspaces policies (use helper for membership check)
-- ========================================
DROP POLICY IF EXISTS "workspaces_auth_member_select" ON workspaces;
CREATE POLICY "workspaces_auth_member_select" ON workspaces
  FOR SELECT TO authenticated
  USING (
    is_workspace_member(id)
  );
