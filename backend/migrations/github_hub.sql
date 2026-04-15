-- Unified GitHub Hub Migration

-- 1. Submissions Tracking
CREATE TABLE IF NOT EXISTS github_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES github_workflows(id),
    pusher_username TEXT NOT NULL,
    repo_url TEXT NOT NULL,
    pushed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    compliance_report JSONB, -- Stores findings from the Guardian Scanner
    status TEXT DEFAULT 'success'
);

-- 2. Team and Usage Limits
CREATE TABLE IF NOT EXISTS github_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL,
    name TEXT NOT NULL,
    usage_limit INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS github_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES github_teams(id),
    member_username TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    role TEXT DEFAULT 'member'
);

-- 3. White Labeling Branding
CREATE TABLE IF NOT EXISTS github_white_label (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES github_workflows(id) UNIQUE,
    custom_logo_url TEXT,
    portal_name TEXT DEFAULT 'Standard Engineering Portal',
    theme_color TEXT DEFAULT '#8b5cf6'
);

-- 4. Audit Logs
CREATE TABLE IF NOT EXISTS github_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL, -- 'push', 'workflow_created', 'security_block'
    user_id TEXT NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
