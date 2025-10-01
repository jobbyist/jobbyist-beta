-- Add subscription fields to profiles table for Jobbyist Pro users
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_pro_user BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pro_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS pro_subscription_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS pro_subscription_plan VARCHAR(50), -- 'monthly' or 'yearly'
ADD COLUMN IF NOT EXISTS pro_subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pro_subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pro_payment_provider VARCHAR(50) DEFAULT 'paypal',
ADD COLUMN IF NOT EXISTS pro_last_payment_date TIMESTAMP WITH TIME ZONE;

-- Add index for quick lookup of pro users
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro_user ON public.profiles(is_pro_user);

-- Add comment
COMMENT ON COLUMN public.profiles.is_pro_user IS 'Whether the user has an active Jobbyist Pro subscription';
COMMENT ON COLUMN public.profiles.pro_subscription_status IS 'Status of subscription: active, cancelled, expired, suspended';
COMMENT ON COLUMN public.profiles.pro_subscription_plan IS 'Subscription plan: monthly ($4.99) or yearly ($49.99)';
