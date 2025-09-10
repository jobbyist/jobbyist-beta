-- Create a function to automatically set admin status for specific user
CREATE OR REPLACE FUNCTION public.set_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user email contains mykeynotyours
  IF NEW.email = 'mykeynotyours@example.com' OR NEW.raw_user_meta_data->>'email' = 'mykeynotyours@example.com' THEN
    -- Update the profile to set admin status
    UPDATE public.profiles 
    SET is_admin = true 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;