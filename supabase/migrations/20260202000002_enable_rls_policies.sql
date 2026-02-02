-- ========================================
-- Enable RLS on all tables
-- ========================================
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE deeplinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
-- profiles already has RLS enabled

-- ========================================
-- profiles policies
-- ========================================
-- anon: allow SELECT for public profile lookups
CREATE POLICY "profiles_anon_select" ON profiles
  FOR SELECT TO anon USING (true);

-- authenticated: users can read all profiles
CREATE POLICY "profiles_auth_select" ON profiles
  FOR SELECT TO authenticated USING (true);

-- authenticated: users can insert their own profile
CREATE POLICY "profiles_auth_insert" ON profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- authenticated: users can update their own profile
CREATE POLICY "profiles_auth_update" ON profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ========================================
-- workspaces policies
-- ========================================
-- anon: allow SELECT for API endpoints (client_key/api_key lookups) and link redirects
CREATE POLICY "workspaces_anon_select" ON workspaces
  FOR SELECT TO anon USING (true);

-- authenticated: owners can do everything
CREATE POLICY "workspaces_auth_owner_all" ON workspaces
  FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- authenticated: members can read workspaces they belong to
CREATE POLICY "workspaces_auth_member_select" ON workspaces
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = workspaces.id
        AND wm.user_id = auth.uid()
        AND wm.status = 'ACCEPTED'
    )
  );

-- ========================================
-- deeplinks policies
-- ========================================
-- anon: allow SELECT for link redirects and GET /api/deeplink
CREATE POLICY "deeplinks_anon_select" ON deeplinks
  FOR SELECT TO anon USING (true);

-- anon: allow INSERT for POST /api/deeplink (API key validated in app code)
CREATE POLICY "deeplinks_anon_insert" ON deeplinks
  FOR INSERT TO anon WITH CHECK (true);

-- authenticated: members can read deeplinks in their workspaces
CREATE POLICY "deeplinks_auth_select" ON deeplinks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = deeplinks.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'ACCEPTED'
    )
  );

-- authenticated: members can insert deeplinks in their workspaces
CREATE POLICY "deeplinks_auth_insert" ON deeplinks
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = deeplinks.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'ACCEPTED'
    )
  );

-- authenticated: members can update deeplinks in their workspaces
CREATE POLICY "deeplinks_auth_update" ON deeplinks
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = deeplinks.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'ACCEPTED'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = deeplinks.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'ACCEPTED'
    )
  );

-- ========================================
-- apps policies
-- ========================================
-- anon: allow SELECT for link redirects (need app config for platform detection)
CREATE POLICY "apps_anon_select" ON apps
  FOR SELECT TO anon USING (true);

-- authenticated: members can do everything with apps in their workspaces
CREATE POLICY "apps_auth_member_all" ON apps
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = apps.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'ACCEPTED'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_memberships wm
      WHERE wm.workspace_id = apps.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.status = 'ACCEPTED'
    )
  );

-- ========================================
-- workspace_memberships policies
-- ========================================
-- authenticated: users can see their own memberships
CREATE POLICY "memberships_auth_own_select" ON workspace_memberships
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- authenticated: workspace owners can see all memberships in their workspaces
CREATE POLICY "memberships_auth_owner_select" ON workspace_memberships
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_memberships.workspace_id
        AND w.owner_id = auth.uid()
    )
  );

-- authenticated: workspace owners can insert memberships (invite)
CREATE POLICY "memberships_auth_owner_insert" ON workspace_memberships
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_memberships.workspace_id
        AND w.owner_id = auth.uid()
    )
  );

-- authenticated: workspace owners can update memberships in their workspaces
CREATE POLICY "memberships_auth_owner_update" ON workspace_memberships
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_memberships.workspace_id
        AND w.owner_id = auth.uid()
    )
  );

-- authenticated: users can update their own membership (accept invitation)
CREATE POLICY "memberships_auth_own_update" ON workspace_memberships
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ========================================
-- subscriptions policies
-- ========================================
-- authenticated: workspace owners can read subscriptions
CREATE POLICY "subscriptions_auth_owner_select" ON subscriptions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = subscriptions.workspace_id
        AND w.owner_id = auth.uid()
    )
  );
