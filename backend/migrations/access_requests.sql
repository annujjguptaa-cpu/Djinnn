-- SQL Migration to create access_requests table

CREATE TABLE IF NOT EXISTS public.access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    organisation TEXT NOT NULL,
    use_case_description TEXT NOT NULL,
    plan_interest TEXT NOT NULL,
    wish_name TEXT NOT NULL,
    wish_topic TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to access_requests" ON public.access_requests FOR ALL USING (true) WITH CHECK (true);
