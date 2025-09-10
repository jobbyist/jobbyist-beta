-- Create audio episodes table
CREATE TABLE public.audio_episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- duration in seconds
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audio_episodes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Audio episodes are viewable by everyone" 
ON public.audio_episodes 
FOR SELECT 
USING (true);

-- Create episode stats table for likes/dislikes
CREATE TABLE public.audio_episode_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id UUID NOT NULL REFERENCES public.audio_episodes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  liked BOOLEAN DEFAULT NULL, -- NULL = no interaction, true = liked, false = disliked
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(episode_id, user_id)
);

-- Enable RLS on stats
ALTER TABLE public.audio_episode_stats ENABLE ROW LEVEL SECURITY;

-- Stats policies
CREATE POLICY "Users can view episode stats" 
ON public.audio_episode_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own episode stats" 
ON public.audio_episode_stats 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add admin role to profiles table
ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Create trigger for automatic timestamp updates on audio episodes
CREATE TRIGGER update_audio_episodes_updated_at
BEFORE UPDATE ON public.audio_episodes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on episode stats
CREATE TRIGGER update_audio_episode_stats_updated_at
BEFORE UPDATE ON public.audio_episode_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for audio files and thumbnails
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-episodes', 'audio-episodes', false);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('episode-thumbnails', 'episode-thumbnails', true);

-- Create storage policies for audio files (private)
CREATE POLICY "Authenticated users can view audio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-episodes' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can upload audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'audio-episodes' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create storage policies for thumbnails (public)
CREATE POLICY "Anyone can view episode thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'episode-thumbnails');

CREATE POLICY "Admins can upload episode thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'episode-thumbnails' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create admin user (will need to be done manually or via auth signup)
-- The user mykeynotyours with password Jobbyist101$ will need to sign up first
-- Then we'll update their profile to be admin via SQL or the dashboard