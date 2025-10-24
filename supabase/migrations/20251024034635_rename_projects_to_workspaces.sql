-- 1. projects 테이블을 workspaces로 rename
ALTER TABLE projects RENAME TO workspaces;

-- 2. sub_domain을 필수 + unique로 변경
-- NULL인 경우 임시값 설정
UPDATE workspaces SET sub_domain = 'workspace-' || id WHERE sub_domain IS NULL;

ALTER TABLE workspaces
  ALTER COLUMN sub_domain SET NOT NULL,
  ADD CONSTRAINT workspaces_sub_domain_key UNIQUE (sub_domain);

-- 3. deeplinks에서 sub_domain 컬럼 제거
ALTER TABLE deeplinks DROP COLUMN sub_domain;

-- 4. 모든 테이블의 project_id를 workspace_id로 변경
ALTER TABLE deeplinks RENAME COLUMN project_id TO workspace_id;
ALTER TABLE apps RENAME COLUMN project_id TO workspace_id;
ALTER TABLE subscriptions RENAME COLUMN project_id TO workspace_id;

-- 5. project_memberships 테이블 rename
ALTER TABLE project_memberships RENAME TO workspace_memberships;
ALTER TABLE workspace_memberships RENAME COLUMN project_id TO workspace_id;

-- 6. Foreign Key constraint 이름 업데이트
ALTER TABLE deeplinks
  DROP CONSTRAINT deeplinks_project_id_fkey,
  ADD CONSTRAINT deeplinks_workspace_id_fkey
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE apps
  DROP CONSTRAINT apps_project_id_fkey,
  ADD CONSTRAINT apps_workspace_id_fkey
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE workspace_memberships
  DROP CONSTRAINT project_memberships_project_id_fkey,
  ADD CONSTRAINT workspace_memberships_workspace_id_fkey
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE subscriptions
  DROP CONSTRAINT subscriptions_project_id_fkey,
  ADD CONSTRAINT subscriptions_workspace_id_fkey
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE workspaces
  DROP CONSTRAINT projects_active_subscription_id_fkey,
  ADD CONSTRAINT workspaces_active_subscription_id_fkey
    FOREIGN KEY (active_subscription_id) REFERENCES subscriptions(id);

ALTER TABLE workspaces
  DROP CONSTRAINT projects_owner_id_fkey,
  ADD CONSTRAINT workspaces_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES profiles(id);
