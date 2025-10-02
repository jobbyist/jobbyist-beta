-- Add transcript field to audio_episodes table
ALTER TABLE public.audio_episodes 
ADD COLUMN IF NOT EXISTS transcript TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN public.audio_episodes.transcript IS 'Full transcript of the audio episode for SEO and accessibility';
