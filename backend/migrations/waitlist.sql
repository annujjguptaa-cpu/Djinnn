-- SQL Migration to create the waitlist table in Supabase

CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    wish_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a unique constraint so a user can't request the same wish multiple times
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_wish_idx ON public.waitlist (email, wish_name);

-- Row Level Security (optional but recommended)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (since users aren't logged in when they join the waitlist)
CREATE POLICY "Allow public inserts" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- Only allow service role to select (so people can't read the waitlist emails)
CREATE POLICY "Allow service role to read" ON public.waitlist
    FOR SELECT USING (auth.role() = 'service_role');
