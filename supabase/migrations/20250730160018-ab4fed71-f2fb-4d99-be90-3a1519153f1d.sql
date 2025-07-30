-- Add work_experience_description column to profiles table for storing user's work experience
ALTER TABLE public.profiles 
ADD COLUMN work_experience_description TEXT;