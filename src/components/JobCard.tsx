import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Clock, DollarSign, Heart, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  description: string;
  skills_required: string[];
  experience_level: string;
  remote_allowed: boolean;
  application_url: string;
  source_website: string;
  created_at: string;
}

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSaveToggle?: (jobId: string, saved: boolean) => void;
}

export const JobCard = ({ job, isSaved = false, onSaveToggle }: JobCardProps) => {
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const formatSalary = (min?: number, max?: number, currency = 'ZAR') => {
    if (!min && !max) return null;
    const formatter = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return formatter.format(min || max || 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save jobs",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', job.id);

        if (error) throw error;
        
        toast({
          title: "Job removed",
          description: "Job removed from your saved list",
        });
        onSaveToggle?.(job.id, false);
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: job.id,
          });

        if (error) throw error;
        
        toast({
          title: "Job saved",
          description: "Job added to your saved list",
        });
        onSaveToggle?.(job.id, true);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(job.created_at)}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSaveJob}
            disabled={saving}
            className="shrink-0"
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{job.job_type}</Badge>
          <Badge variant="outline">{job.experience_level}</Badge>
          {job.remote_allowed && <Badge variant="outline">Remote OK</Badge>}
          <Badge variant="outline">{job.source_website}</Badge>
        </div>
        
        {formatSalary(job.salary_min, job.salary_max, job.currency) && (
          <div className="flex items-center gap-1 text-sm font-medium text-green-600 mb-3">
            <DollarSign className="h-4 w-4" />
            <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {job.description}
        </p>

        {job.skills_required && job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills_required.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills_required.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills_required.length - 5} more
              </Badge>
            )}
          </div>
        )}

        <Button asChild className="w-full">
          <a 
            href={job.application_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};