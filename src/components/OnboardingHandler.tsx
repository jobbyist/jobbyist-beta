import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingModal } from '@/components/OnboardingModal';

export const OnboardingHandler = () => {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (loading || !user) {
        setChecking(false);
        return;
      }

      try {
        // Check if user has completed onboarding by checking if they have a complete profile
        const { data, error } = await supabase
          .from('profiles')
          .select('location, experience_level, skills')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking onboarding status:', error);
          setChecking(false);
          return;
        }

        // If profile is incomplete (missing key fields), show onboarding
        const needsOnboarding = !data?.location || !data?.experience_level || !data?.skills || data.skills.length === 0;
        
        // Check if user has already seen onboarding in this session
        const onboardingShown = sessionStorage.getItem('onboardingShown');
        
        if (needsOnboarding && !onboardingShown) {
          setShowOnboarding(true);
          sessionStorage.setItem('onboardingShown', 'true');
        }
      } catch (error) {
        console.error('Error in onboarding check:', error);
      } finally {
        setChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [user, loading]);

  if (checking || !user) {
    return null;
  }

  return (
    <OnboardingModal
      open={showOnboarding}
      onOpenChange={setShowOnboarding}
      userId={user.id}
    />
  );
};
