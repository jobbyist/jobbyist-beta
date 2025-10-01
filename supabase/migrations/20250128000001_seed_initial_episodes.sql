-- Seed audio episodes with Episode 1 and Episode 2

-- Note: These inserts use placeholder audio URLs. 
-- The actual audio files should be uploaded through the admin interface at /admin/audio-upload
-- Or you can manually upload to Supabase storage and update the URLs

-- Episode 1: Introducing Jobbyist
INSERT INTO public.audio_episodes (
  title,
  description,
  audio_url,
  thumbnail_url,
  duration,
  play_count,
  transcript
) VALUES (
  'Ep. 1 - Introducing Jobbyist - Niche Focused Tech Trojan Horse Strategy and the Fight Against Youth Unemployment In Africa',
  'In this inaugural episode, we introduce Jobbyist and discuss our innovative niche-focused tech strategy. Learn about our mission to combat youth unemployment in Africa through technology and targeted job opportunities.',
  '/audio/ep1-introducing-jobbyist.mp3',
  '/images/thumbnails/ep1-thumbnail.svg',
  163, -- Duration in seconds (2:43 - approximate based on 2.6MB file size)
  8769,
  'Episode 1 Transcript: Welcome to The Job Post podcast. In this episode, we introduce Jobbyist, a revolutionary platform designed to tackle youth unemployment in Africa...'
)
ON CONFLICT DO NOTHING;

-- Episode 2: Reclaim Your Worth
INSERT INTO public.audio_episodes (
  title,
  description,
  audio_url,
  thumbnail_url,
  duration,
  play_count,
  transcript
) VALUES (
  'Ep. 2 - Reclaim Your Worth: Dismantling the Gratitude Tax and Earning What You Deserve',
  'Explore how to break free from the "gratitude tax" - the expectation that you should accept less than you deserve simply because you have a job. Learn strategies to recognize your true worth and negotiate for what you deserve in your career.',
  '/audio/ep2-reclaim-your-worth.mp3',
  '/images/thumbnails/ep2-thumbnail.svg',
  172, -- Duration in seconds (2:52 - approximate based on 2.8MB file size)
  8769,
  'Episode 2 Transcript: In today''s episode, we tackle a critical issue affecting workers across Africa - the gratitude tax. This is the unspoken expectation that you should be grateful for any job, regardless of how it undervalues your skills...'
)
ON CONFLICT DO NOTHING;

-- Update play_count to ensure it starts from 8769 for all episodes
UPDATE public.audio_episodes 
SET play_count = GREATEST(play_count, 8769)
WHERE play_count < 8769;
