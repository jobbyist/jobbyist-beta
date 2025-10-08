-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  location TEXT,
  description TEXT,
  industry TEXT,
  size TEXT,
  website TEXT,
  founded TEXT,
  specialties TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on company name for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);

-- Add company_id foreign key to jobs table
ALTER TABLE public.jobs 
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id);

-- Create index on company_id in jobs table
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table (read-only for public)
CREATE POLICY "Companies are viewable by everyone" ON public.companies
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update (for admin purposes)
CREATE POLICY "Authenticated users can insert companies" ON public.companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update companies" ON public.companies
  FOR UPDATE USING (auth.role() = 'authenticated');
