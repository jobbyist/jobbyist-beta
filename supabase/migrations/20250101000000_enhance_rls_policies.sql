-- Enhance RLS policies for better security and functionality

-- Add missing DELETE policy for job_applications
CREATE POLICY "Users can delete their own applications" 
ON public.job_applications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add admin-only policies for audio_episodes management
CREATE POLICY "Admins can insert audio episodes" 
ON public.audio_episodes 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update audio episodes" 
ON public.audio_episodes 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can delete audio episodes" 
ON public.audio_episodes 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Add policy for job management (admin only)
CREATE POLICY "Admins can insert jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update jobs" 
ON public.jobs 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can delete jobs" 
ON public.jobs 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);