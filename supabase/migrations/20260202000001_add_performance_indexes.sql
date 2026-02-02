-- Performance indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_workspaces_api_key ON workspaces(api_key);
CREATE INDEX IF NOT EXISTS idx_workspaces_client_key ON workspaces(client_key);
CREATE INDEX IF NOT EXISTS idx_apps_workspace_id ON apps(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_memberships_user_workspace
  ON workspace_memberships(user_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
