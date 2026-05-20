-- SQL Migration to create new tables for Topic 2 (Opportunities) and Topic 3 (Campaigns)

-- Table: opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    wish_type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    total_attempted INTEGER DEFAULT 0,
    total_successful INTEGER DEFAULT 0,
    results JSONB DEFAULT '[]'::jsonb
);

-- Table: applications
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    entity_name TEXT NOT NULL,
    position_name TEXT NOT NULL,
    platform TEXT NOT NULL,
    status TEXT NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cover_letter_used TEXT,
    notes TEXT
);

-- Table: campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    campaign_type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    total_prospects INTEGER DEFAULT 0,
    total_contacted INTEGER DEFAULT 0,
    results JSONB DEFAULT '[]'::jsonb
);

-- Table: campaign_contacts
CREATE TABLE IF NOT EXISTS public.campaign_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    prospect_name TEXT NOT NULL,
    prospect_role TEXT NOT NULL,
    prospect_company TEXT NOT NULL,
    platform TEXT NOT NULL,
    message_sent TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_received BOOLEAN DEFAULT FALSE,
    follow_up_count INTEGER DEFAULT 0
);

-- Enable RLS (Row Level Security) and allow public CRUD for simplicity in development (or restrict as needed)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to opportunities" ON public.opportunities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to campaigns" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to campaign_contacts" ON public.campaign_contacts FOR ALL USING (true) WITH CHECK (true);
