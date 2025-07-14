
-- Create a table for blogs
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_name TEXT DEFAULT 'Vireia AI Team',
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_blogs_published ON public.blogs (is_published, published_at DESC);
CREATE INDEX idx_blogs_category ON public.blogs (category);
CREATE INDEX idx_blogs_featured ON public.blogs (is_featured);

-- Enable RLS but allow public read access (since blogs are public)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read published blogs
CREATE POLICY "Anyone can view published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (is_published = true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
