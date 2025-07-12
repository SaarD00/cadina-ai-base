-- Remove sample data and create proper ranking calculation function
DELETE FROM public.user_rankings;

-- Create function to calculate resume score
CREATE OR REPLACE FUNCTION public.calculate_resume_score(resume_content jsonb)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  score integer := 0;
  experience_count integer;
  education_count integer;
  skills_count integer;
  projects_count integer;
BEGIN
  -- Personal info completeness (20 points max)
  IF resume_content->'personal'->>'name' IS NOT NULL AND resume_content->'personal'->>'name' != '' THEN
    score := score + 5;
  END IF;
  IF resume_content->'personal'->>'email' IS NOT NULL AND resume_content->'personal'->>'email' != '' THEN
    score := score + 3;
  END IF;
  IF resume_content->'personal'->>'phone' IS NOT NULL AND resume_content->'personal'->>'phone' != '' THEN
    score := score + 3;
  END IF;
  IF resume_content->'personal'->>'title' IS NOT NULL AND resume_content->'personal'->>'title' != '' THEN
    score := score + 5;
  END IF;
  IF resume_content->'personal'->>'linkedin' IS NOT NULL AND resume_content->'personal'->>'linkedin' != '' THEN
    score := score + 2;
  END IF;
  IF resume_content->'personal'->>'website' IS NOT NULL AND resume_content->'personal'->>'website' != '' THEN
    score := score + 2;
  END IF;

  -- Summary (15 points max)
  IF resume_content->>'summary' IS NOT NULL AND LENGTH(resume_content->>'summary') > 50 THEN
    score := score + 15;
  ELSIF resume_content->>'summary' IS NOT NULL AND LENGTH(resume_content->>'summary') > 20 THEN
    score := score + 8;
  END IF;

  -- Experience (30 points max)
  experience_count := jsonb_array_length(COALESCE(resume_content->'experience', '[]'::jsonb));
  IF experience_count >= 3 THEN
    score := score + 30;
  ELSIF experience_count = 2 THEN
    score := score + 20;
  ELSIF experience_count = 1 THEN
    score := score + 10;
  END IF;

  -- Education (15 points max)
  education_count := jsonb_array_length(COALESCE(resume_content->'education', '[]'::jsonb));
  IF education_count >= 2 THEN
    score := score + 15;
  ELSIF education_count = 1 THEN
    score := score + 10;
  END IF;

  -- Projects (15 points max)
  projects_count := jsonb_array_length(COALESCE(resume_content->'projects', '[]'::jsonb));
  IF projects_count >= 3 THEN
    score := score + 15;
  ELSIF projects_count = 2 THEN
    score := score + 10;
  ELSIF projects_count = 1 THEN
    score := score + 5;
  END IF;

  -- Skills (5 points max)
  skills_count := jsonb_array_length(COALESCE(resume_content->'skills'->'technical', '[]'::jsonb)) + 
                  jsonb_array_length(COALESCE(resume_content->'skills'->'soft', '[]'::jsonb));
  IF skills_count >= 10 THEN
    score := score + 5;
  ELSIF skills_count >= 5 THEN
    score := score + 3;
  ELSIF skills_count >= 2 THEN
    score := score + 1;
  END IF;

  RETURN score;
END;
$$;

-- Create function to determine rank tier based on score
CREATE OR REPLACE FUNCTION public.get_rank_tier(score integer)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  IF score >= 80 THEN
    RETURN 'diamond';
  ELSIF score >= 65 THEN
    RETURN 'platinum';
  ELSIF score >= 50 THEN
    RETURN 'gold';
  ELSIF score >= 30 THEN
    RETURN 'silver';
  ELSE
    RETURN 'bronze';
  END IF;
END;
$$;

-- Create function to update user ranking
CREATE OR REPLACE FUNCTION public.update_user_ranking(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  best_score integer := 0;
  user_score integer;
  user_tier text;
  user_rank integer;
BEGIN
  -- Calculate best score from all user's resumes
  SELECT COALESCE(MAX(public.calculate_resume_score(content)), 0)
  INTO best_score
  FROM public.resumes
  WHERE user_id = user_uuid;

  -- Get rank tier
  user_tier := public.get_rank_tier(best_score);

  -- Calculate rank (position among all users)
  WITH ranked_users AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY COALESCE(MAX(public.calculate_resume_score(content)), 0) DESC) as rank
    FROM public.resumes
    GROUP BY user_id
  )
  SELECT rank INTO user_rank
  FROM ranked_users
  WHERE user_id = user_uuid;

  -- If user has no resumes, set default values
  IF user_rank IS NULL THEN
    user_rank := (SELECT COUNT(*) FROM public.user_rankings) + 1;
  END IF;

  -- Insert or update user ranking
  INSERT INTO public.user_rankings (user_id, current_rank, total_score, rank_tier)
  VALUES (user_uuid, user_rank, best_score, user_tier)
  ON CONFLICT (user_id, rank_category)
  DO UPDATE SET
    current_rank = EXCLUDED.current_rank,
    total_score = EXCLUDED.total_score,
    rank_tier = EXCLUDED.rank_tier,
    last_updated = now(),
    updated_at = now();
END;
$$;

-- Create trigger function to update rankings when resumes change
CREATE OR REPLACE FUNCTION public.handle_resume_ranking_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update ranking for the user whose resume was modified
  PERFORM public.update_user_ranking(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for resume changes
DROP TRIGGER IF EXISTS update_rankings_on_resume_insert ON public.resumes;
DROP TRIGGER IF EXISTS update_rankings_on_resume_update ON public.resumes;
DROP TRIGGER IF EXISTS update_rankings_on_resume_delete ON public.resumes;

CREATE TRIGGER update_rankings_on_resume_insert
  AFTER INSERT ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_resume_ranking_update();

CREATE TRIGGER update_rankings_on_resume_update
  AFTER UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_resume_ranking_update();

CREATE TRIGGER update_rankings_on_resume_delete
  AFTER DELETE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_resume_ranking_update();