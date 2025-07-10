-- Create user rankings table
CREATE TABLE public.user_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_rank INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  rank_category TEXT NOT NULL DEFAULT 'overall',
  rank_tier TEXT NOT NULL DEFAULT 'bronze', -- bronze, silver, gold, platinum, diamond
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, rank_category)
);

-- Enable RLS
ALTER TABLE public.user_rankings ENABLE ROW LEVEL SECURITY;

-- Create policies for user rankings
CREATE POLICY "Users can view all rankings" 
ON public.user_rankings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own ranking" 
ON public.user_rankings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ranking" 
ON public.user_rankings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_rankings_updated_at
BEFORE UPDATE ON public.user_rankings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample ranking data for existing users
INSERT INTO public.user_rankings (user_id, current_rank, total_score, rank_category, rank_tier)
SELECT 
  id as user_id,
  FLOOR(RANDOM() * 1000) + 1 as current_rank,
  FLOOR(RANDOM() * 5000) + 1000 as total_score,
  'overall' as rank_category,
  CASE 
    WHEN RANDOM() < 0.1 THEN 'diamond'
    WHEN RANDOM() < 0.25 THEN 'platinum'
    WHEN RANDOM() < 0.45 THEN 'gold'
    WHEN RANDOM() < 0.75 THEN 'silver'
    ELSE 'bronze'
  END as rank_tier
FROM auth.users
ON CONFLICT (user_id, rank_category) DO NOTHING;