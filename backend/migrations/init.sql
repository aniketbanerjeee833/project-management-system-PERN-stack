-- ============================================================
--  PROJECT MANAGEMENT SYSTEM  —  PostgreSQL Schema
--  IDs: BIGSERIAL (1, 2, 3 …)  auto-increment integers
-- ============================================================


-- ────────────────────────────────────────────────────────────
--  ENUMS  (created once, safe to re-run)
-- ────────────────────────────────────────────────────────────

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workspace_role') THEN
        CREATE TYPE workspace_role AS ENUM ('admin', 'manager', 'employee');
    END IF;
END$$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitation_status') THEN
        CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');
    END IF;
END$$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('active', 'completed', 'on_hold', 'archived');
    END IF;
END$$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
    END IF;
END$$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
    END IF;
END$$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_type') THEN
        CREATE TYPE entity_type AS ENUM ('project', 'task', 'comment');
    END IF;
END$$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM (
            'task_assigned',
            'task_status_changed',
            'comment_added',
            'deadline_near',
            'project_created',
            'member_invited'
        );
    END IF;
END$$;


-- ────────────────────────────────────────────────────────────
--  USERS
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id                BIGSERIAL PRIMARY KEY,               -- 1, 2, 3 …
    name              VARCHAR(100)  NOT NULL,
    email             VARCHAR(255)  UNIQUE NOT NULL,
    password_hash     TEXT          NOT NULL,
    avatar_url        TEXT,
    is_email_verified BOOLEAN       DEFAULT false,
    created_at        TIMESTAMPTZ   DEFAULT now(),
    updated_at        TIMESTAMPTZ   DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  WORKSPACES
--  Only admin users create workspaces.
--  A workspace is the top-level container (= "company").
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workspaces (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(120) NOT NULL,
    slug       VARCHAR(80)  UNIQUE NOT NULL,       -- e.g. "acme-corp"  used in URLs
    owner_id   BIGINT       REFERENCES users(id) ON DELETE CASCADE,
    logo_url   TEXT,
    created_at TIMESTAMPTZ  DEFAULT now(),
    updated_at TIMESTAMPTZ  DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  WORKSPACE MEMBERS
--  Role lives HERE, not on users table.
--  Same user can be admin in workspace 1, employee in workspace 2.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workspace_members (
    id           BIGSERIAL    PRIMARY KEY,
    workspace_id BIGINT       NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id      BIGINT       NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
    role         workspace_role NOT NULL,
    joined_at    TIMESTAMPTZ  DEFAULT now(),

    UNIQUE (workspace_id, user_id)            -- one row per user per workspace
);


-- ────────────────────────────────────────────────────────────
--  INVITATIONS
--  Admin sends invite link by email.
--  Token is a random string embedded in the invite URL.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invitations (
    id           BIGSERIAL         PRIMARY KEY,
    workspace_id BIGINT            NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email        VARCHAR(255)      NOT NULL,
    role         workspace_role    NOT NULL,
    invited_by   BIGINT            REFERENCES users(id),
    token        TEXT              UNIQUE NOT NULL,       -- random secure token
    status       invitation_status DEFAULT 'pending',
    expires_at   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ       DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  PROJECTS
--  Belong to a workspace. Manager is assigned per project.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
    id           BIGSERIAL      PRIMARY KEY,
    workspace_id BIGINT         NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name         VARCHAR(200)   NOT NULL,
    description  TEXT,
    status       project_status DEFAULT 'active',
    created_by   BIGINT         REFERENCES users(id),
    manager_id   BIGINT         REFERENCES users(id),    -- manager responsible
    start_date   DATE,
    due_date     DATE,
    created_at   TIMESTAMPTZ    DEFAULT now(),
    updated_at   TIMESTAMPTZ    DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  TASKS
--  Belong to a project (and workspace for fast filtering).
--  parent_task_id enables sub-tasks.
--  position controls Kanban card order within a column.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tasks (
    id             BIGSERIAL      PRIMARY KEY,
    workspace_id   BIGINT         NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id     BIGINT         NOT NULL REFERENCES projects(id)   ON DELETE CASCADE,
    title          VARCHAR(300)   NOT NULL,
    description    TEXT,
    status         task_status    DEFAULT 'todo',
    priority       task_priority  DEFAULT 'medium',
    assignee_id    BIGINT         REFERENCES users(id),               -- nullable = unassigned
    created_by     BIGINT         REFERENCES users(id),
    due_date       DATE,
    position       INTEGER        DEFAULT 0,                          -- order within status column
    parent_task_id BIGINT         REFERENCES tasks(id),               -- nullable = top-level task
    created_at     TIMESTAMPTZ    DEFAULT now(),
    updated_at     TIMESTAMPTZ    DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  COMMENTS
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS comments (
    id         BIGSERIAL   PRIMARY KEY,
    task_id    BIGINT      NOT NULL REFERENCES tasks(id)  ON DELETE CASCADE,
    author_id  BIGINT      NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    body       TEXT        NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  ATTACHMENTS
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS attachments (
    id          BIGSERIAL    PRIMARY KEY,
    task_id     BIGINT       NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    uploaded_by BIGINT       REFERENCES users(id),
    file_name   VARCHAR(255),
    file_url    TEXT,
    file_size   INTEGER,                     -- bytes
    mime_type   VARCHAR(100),
    created_at  TIMESTAMPTZ  DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  TIME LOGS
--  Employees log minutes spent on a task per day.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS time_logs (
    id         BIGSERIAL   PRIMARY KEY,
    task_id    BIGINT      NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    minutes    INTEGER     NOT NULL CHECK (minutes > 0),
    note       TEXT,
    logged_at  DATE        NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  ACTIVITY LOGS
--  Full audit trail.  meta JSONB stores old/new values.
--  entity_id is a BIGINT matching the relevant table's PK.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_logs (
    id           BIGSERIAL   PRIMARY KEY,
    workspace_id BIGINT      NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    actor_id     BIGINT      REFERENCES users(id),
    entity_type  entity_type NOT NULL,
    entity_id    BIGINT      NOT NULL,
    action       VARCHAR(100) NOT NULL,   -- e.g. 'status_changed', 'assigned', 'commented'
    meta         JSONB,                   -- { "old": "todo", "new": "in_progress" }
    created_at   TIMESTAMPTZ DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  NOTIFICATIONS
--  In-app bell icon notifications per user.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
    id           BIGSERIAL          PRIMARY KEY,
    user_id      BIGINT             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id BIGINT             REFERENCES workspaces(id)     ON DELETE CASCADE,
    type         notification_type  NOT NULL,
    title        VARCHAR(200)       NOT NULL,
    body         TEXT,
    entity_type  entity_type,
    entity_id    BIGINT,                          -- links back to the task/project/comment
    is_read      BOOLEAN            DEFAULT false,
    created_at   TIMESTAMPTZ        DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
--  INDEXES  (query-pattern driven)
-- ────────────────────────────────────────────────────────────

-- workspace membership lookups
CREATE INDEX IF NOT EXISTS idx_wm_workspace   ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_wm_user        ON workspace_members(user_id);

-- project listings per workspace
CREATE INDEX IF NOT EXISTS idx_projects_ws    ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_mgr   ON projects(manager_id);

-- task queries (most frequent)
CREATE INDEX IF NOT EXISTS idx_tasks_ws       ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project  ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks(status);          -- Kanban filter
CREATE INDEX IF NOT EXISTS idx_tasks_parent   ON tasks(parent_task_id);  -- sub-task fetch

-- comments per task
CREATE INDEX IF NOT EXISTS idx_comments_task  ON comments(task_id);

-- time logs per task / user
CREATE INDEX IF NOT EXISTS idx_timelogs_task  ON time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_timelogs_user  ON time_logs(user_id);

-- activity feed per workspace (ordered by time)
CREATE INDEX IF NOT EXISTS idx_activity_ws    ON activity_logs(workspace_id, created_at DESC);

-- notifications per user (unread first)
CREATE INDEX IF NOT EXISTS idx_notif_user     ON notifications(user_id, is_read, created_at DESC);

-- invitation token lookup (used on accept-invite flow)
CREATE INDEX IF NOT EXISTS idx_invite_token   ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invite_ws      ON invitations(workspace_id);