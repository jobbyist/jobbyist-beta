import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight, ChevronLeft, Sparkles, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

type OnboardingStep = 1 | 2 | 3 | 4;

const EXPERIENCE_LEVELS = ['entry', 'junior', 'mid', 'senior', 'executive'] as const;
const COUNTRIES = ['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Other'];

export const OnboardingModal = ({ open, onOpenChange, userId }: OnboardingModalProps) => {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    country: '',
    bio: '',
    experience_level: '' as typeof EXPERIENCE_LEVELS[number] | '',
    skills: [] as string[],
    skillInput: '',
  });

  useEffect(() => {
    // Pre-populate name if available from auth
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name && !formData.full_name) {
        setFormData(prev => ({ ...prev, full_name: user.user_metadata.full_name }));
      }
    };
    
    if (open) {
      fetchUserData();
    }
  }, [open]);

  const handleAddSkill = () => {
    if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.skillInput.trim()],
        skillInput: '',
      }));
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          location: `${formData.location}, ${formData.country}`,
          bio: formData.bio,
          experience_level: formData.experience_level,
          skills: formData.skills,
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Welcome to Jobbyist!",
        description: "Your profile has been created successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.full_name.trim() !== '';
      case 2:
        return formData.location.trim() !== '' && formData.country !== '';
      case 3:
        return formData.experience_level !== '' && formData.skills.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 py-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">👋 Welcome to Jobbyist!</h3>
              <p className="text-muted-foreground">Let's get to know you better</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-base">What's your name?</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="text-lg py-6"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 py-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">📍 Where are you located?</h3>
              <p className="text-muted-foreground">This helps us show you relevant opportunities</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-base">Country</Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 text-lg border rounded-md bg-background"
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-base">City</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Johannesburg, Lagos, Nairobi"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="text-lg py-6"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 py-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">💼 Tell us about your experience</h3>
              <p className="text-muted-foreground">This helps match you with the right jobs</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience_level" className="text-base">Experience Level</Label>
                <select
                  id="experience_level"
                  value={formData.experience_level}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    experience_level: e.target.value as typeof EXPERIENCE_LEVELS[number]
                  }))}
                  className="w-full px-4 py-3 text-lg border rounded-md bg-background"
                >
                  <option value="">Select your experience level</option>
                  <option value="entry">Entry Level (0-1 years)</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid-Level (3-5 years)</option>
                  <option value="senior">Senior (5-10 years)</option>
                  <option value="executive">Executive (10+ years)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-base">Your Top Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    type="text"
                    placeholder="e.g., React, Python, Marketing"
                    value={formData.skillInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, skillInput: e.target.value }))}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddSkill} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Add at least one skill to continue</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-base">About You (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell employers a bit about yourself and what you're looking for..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 py-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">🚀 Supercharge your job search</h3>
              <p className="text-muted-foreground">Get ahead with Jobbyist Pro</p>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-6 w-6 text-primary" />
                <h4 className="text-xl font-bold">Jobbyist Pro Benefits</h4>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Apply with AI</p>
                    <p className="text-sm text-muted-foreground">Auto-generate cover letters and submit applications</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Priority Support</p>
                    <p className="text-sm text-muted-foreground">Get help when you need it most</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Unlimited Applications</p>
                    <p className="text-sm text-muted-foreground">Apply to as many jobs as you want</p>
                  </div>
                </li>
              </ul>

              <div className="bg-background rounded-md p-4 mt-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">$4.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Or save with annual plan at $49.99/year</p>
                
                <Link to="/pro" className="block">
                  <Button className="w-full" size="lg">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleComplete}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Continue with Free Plan'}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Complete Your Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Let's set up your Jobbyist profile in a few easy steps
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        {step < 4 && (
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}

        {renderStep()}

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
                className="flex-1"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
