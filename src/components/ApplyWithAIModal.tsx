import { useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface ApplyWithAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  company: string;
}

type FormStep = 'questions' | 'processing' | 'success';

export const ApplyWithAIModal = ({ 
  open, 
  onOpenChange, 
  jobTitle,
  company 
}: ApplyWithAIModalProps) => {
  const [step, setStep] = useState<FormStep>('questions');
  const [formData, setFormData] = useState({
    yearsOfExperience: '',
    whyInterested: '',
    availability: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    toast({
      title: "Application Submitted",
      description: "Your AI-powered application has been submitted successfully!",
    });

    setStep('success');
    
    // Close modal after showing success
    setTimeout(() => {
      onOpenChange(false);
      setStep('questions');
      setFormData({ yearsOfExperience: '', whyInterested: '', availability: '' });
    }, 2000);
  };

  const renderContent = () => {
    if (step === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">AI is working on your application</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>✓ Generating personalized cover letter...</p>
              <p>✓ Uploading your resume...</p>
              <p>✓ Answering application questions...</p>
              <p className="animate-pulse">→ Submitting your application...</p>
            </div>
          </div>
        </div>
      );
    }

    if (step === 'success') {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground">
              Your application for {jobTitle} at {company} has been submitted.
            </p>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="text"
            placeholder="e.g., 3 years"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest">Why are you interested in this role?</Label>
          <Textarea
            id="interest"
            placeholder="Tell us what excites you about this opportunity..."
            value={formData.whyInterested}
            onChange={(e) => setFormData(prev => ({ ...prev, whyInterested: e.target.value }))}
            required
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">When can you start?</Label>
          <Input
            id="availability"
            type="text"
            placeholder="e.g., Immediately, 2 weeks notice, 1 month"
            value={formData.availability}
            onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
            required
          />
        </div>

        <div className="bg-primary/10 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI will handle the rest
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Generate a personalized cover letter based on your profile</li>
            <li>• Upload your resume from your profile</li>
            <li>• Answer standard application questions</li>
            <li>• Submit your application directly to the employer</li>
          </ul>
        </div>

        <Button type="submit" className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Apply with AI
        </Button>
      </form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Apply with AI
          </DialogTitle>
          <DialogDescription>
            Answer a few questions and let AI handle your application for {jobTitle}
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
