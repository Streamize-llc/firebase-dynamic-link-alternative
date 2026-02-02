-- ========================================
-- 1. Drop duplicate profiles SELECT policy (pre-existing)
-- ========================================
DROP POLICY IF EXISTS "Enable users to view their own data only" ON profiles;

-- ========================================
-- 2. Rewrite all RLS policies to use (select auth.uid()) for performance
--    See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
-- ========================================

-- profiles
DROP POLICY IF EXISTS "profiles_auth_insert" ON profiles;
CREATE POLICY "profiles_auth_insert" ON profiles
  FOR INSERT TO authenticated WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS "profiles_auth_update" ON profiles;
CREATE POLICY "profiles_auth_update" ON profiles
  FOR UPDATE TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- workspaces
DROP POLICY IF EXISTS "workspaces_auth_owner_all" ON workspaces;
CREATE POLICY "workspaces_auth_owner_all" ON workspaces
  FOR ALL TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "workspaces_auth_member_select" ON workspaces;
CREATE POLICY "workspaces_auth_member_select" ON workspaces
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = workspaces.id
        AND wm.user_id = (select auth.uid())
        AND wm.status = 'ACCEPTED'
    )
  );

-- deeplinks
DROP POLICY IF EXISTS "deeplinks_auth_select" ON deeplinks;
CREATE POLICY "deeplinks_auth_select" ON deeplinks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = deeplinks.workspace_id
        AND wm.user_id = (select auth.uid())
        AND wm.status = 'ACCEPTED'
    )
  );

DROP POLICY IF EXISTS "deeplinks_auth_insert" ON deeplinks;
CREATE POLICY "deeplinks_auth_insert" ON deeplinks
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = deeplinks.workspace_id
        AND wm.user_id = (select auth.uid())
        AND wm.status = 'ACCEPTED'
    )
  );

DROP POLICY IF EXISTS "deeplinks_auth_update" ON deeplinks;
CREATE POLICY "deeplinks_auth_update" ON deeplinks
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = deeplinks.workspace_id
        AND wm.user_id = (select auth.uid())
        AND wm.status = 'ACCEPTED'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = deeplinks.workspace_id
        AND wm.user_id = (select auth.uid())
        AND wm.status = 'ACCEPTED'
    )
  );

-- apps
DROP POLICY IF EXISTS "apps_auth_member_all" ON apps;
CREATE POLICY "apps_auth_member_all" ON apps
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = apps.workspace_id
        AND wm.user_id = (select auth.uid())
        AND wm.status = 'ACCEPTED'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = apps.workspace_id
        AND wm.user_id = (select auth.uid())
        AND wm.status = 'ACCEPTED'
    )
  );

-- workspace_memberships: merge duplicate SELECT into single policy with OR
DROP POLICY IF EXISTS "memberships_auth_own_select" ON workspace_memberships;
DROP POLICY IF EXISTS "memberships_auth_owner_select" ON workspace_memberships;
CREATE POLICY "memberships_auth_select" ON workspace_memberships
  FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_memberships.workspace_id
        AND w.owner_id = (select auth.uid())
    )
  );

-- workspace_memberships: merge duplicate UPDATE into single policy with OR
DROP POLICY IF EXISTS "memberships_auth_own_update" ON workspace_memberships;
DROP POLICY IF EXISTS "memberships_auth_owner_update" ON workspace_memberships;
CREATE POLICY "memberships_auth_update" ON workspace_memberships
  FOR UPDATE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_memberships.workspace_id
        AND w.owner_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "memberships_auth_owner_insert" ON workspace_memberships;
CREATE POLICY "memberships_auth_insert" ON workspace_memberships
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_memberships.workspace_id
        AND w.owner_id = (select auth.uid())
    )
  );

-- subscriptions
DROP POLICY IF EXISTS "subscriptions_auth_owner_select" ON subscriptions;
CREATE POLICY "subscriptions_auth_owner_select" ON subscriptions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = subscriptions.workspace_id
        AND w.owner_id = (select auth.uid())
    )
  );

-- ========================================
-- 3. Drop duplicate sub_domain constraint (legacy from projects rename)
-- ========================================
ALTER TABLE workspaces DROP CONSTRAINT IF EXISTS projects_sub_domain_key;

-- ========================================
-- 4. Add missing FK indexes on subscriptions
-- ========================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace_id ON subscriptions(workspace_id);

-- ========================================
-- 5. Add missing FK index on workspace_memberships(workspace_id)
-- ========================================
CREATE INDEX IF NOT EXISTS idx_workspace_memberships_workspace_id ON workspace_memberships(workspace_id);
