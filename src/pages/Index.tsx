import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/JobCard';
import { JobFilters, type JobFilters as JobFiltersType } from '@/components/JobFilters';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Search, Briefcase, Users, TrendingUp, LogOut, User, Zap } from 'lucide-react';

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

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<JobFiltersType>({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    remoteOnly: false,
    skills: []
  });

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setJobs(data || []);
      
      // Extract unique skills
      const skills = new Set<string>();
      (data || []).forEach(job => {
        job.skills_required?.forEach((skill: string) => skills.add(skill));
      });
      setAvailableSkills(Array.from(skills).sort());
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchSavedJobs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedJobs(data?.map(item => item.job_id) || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const runScraper = async () => {
    setScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-scraper');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Successfully scraped ${data.jobsProcessed} jobs`,
      });
      
      fetchJobs(); // Refresh jobs after scraping
    } catch (error) {
      console.error('Error running scraper:', error);
      toast({
        title: "Error",
        description: "Failed to run job scraper",
        variant: "destructive",
      });
    } finally {
      setScraping(false);
    }
  };

  const handleSaveToggle = (jobId: string, saved: boolean) => {
    if (saved) {
      setSavedJobs(prev => [...prev, jobId]);
    } else {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...jobs];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.job_type === filters.jobType);
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.experience_level === filters.experienceLevel);
    }

    if (filters.remoteOnly) {
      filtered = filtered.filter(job => job.remote_allowed);
    }

    if (filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills.some(skill =>
          job.skills_required?.includes(skill)
        )
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Jobbyist</h1>
              <Badge variant="secondary" className="ml-2">Beta</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.email}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
              
              <Button 
                onClick={runScraper} 
                disabled={scraping}
                variant="outline"
                size="sm"
              >
                <Zap className="h-4 w-4 mr-2" />
                {scraping ? 'Scraping...' : 'Refresh Jobs'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Find Your Dream Job in South Africa
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover high-quality job opportunities from top employers across LinkedIn, Indeed, Glassdoor, and more.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="font-medium">{jobs.length}+ Active Jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Top SA Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-medium">Daily Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <JobFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableSkills={availableSkills}
            />
          </aside>

          {/* Jobs List */}
          <main className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
                </h3>
              </div>
            </div>

            {loadingJobs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => setFilters({
                  search: '',
                  location: '',
                  jobType: '',
                  experienceLevel: '',
                  remoteOnly: false,
                  skills: []
                })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.includes(job.id)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
