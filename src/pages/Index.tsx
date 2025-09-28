import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/JobCard';
import { JobFilters, type JobFilters as JobFiltersType } from '@/components/JobFilters';
import { AudioPlayer } from '@/components/AudioPlayer';
import AdPlaceholder from '@/components/AdPlaceholder';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Search, Briefcase, Users, TrendingUp, LogOut, User, Zap, Crown, FileText, Clock, CheckCircle, ArrowRight, Calendar, Eye, Building2, Target, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '@/components/Footer';
import RecruitmentSuiteModal from '@/components/RecruitmentSuiteModal';

interface AudioEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  initialPlayCount?: number;
}
   
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
  const isMobile = useIsMobile();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [audioEpisodes, setAudioEpisodes] = useState<AudioEpisode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);
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

  const fetchAudioEpisodes = async () => {
    setLoadingEpisodes(true);
    try {
      const { data, error } = await supabase
        .from('audio_episodes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If database has episodes, use those, otherwise use fallback with our new episode
      const episodes = data && data.length > 0 ? data : [{
        id: 'fallback-s1e1',
        title: 'S1E1 - Reclaim Your Worth: Dismantling the Gratitude Tax and Earning What You Deserve',
        description: 'Explore how to break free from the "gratitude tax" - the expectation that you should accept less than you deserve simply because you have a job. Learn strategies to recognize your true worth and negotiate for what you deserve in your career.',
        audio_url: '/audio/s1e1-reclaim-your-worth.mp3',
        thumbnail_url: '/images/thumbnails/s1e1-thumbnail.png',
        duration: 1800, // 30 minutes placeholder
        play_count: 0,
        created_at: new Date().toISOString()
      }];
      
      setAudioEpisodes(episodes);
    } catch (error) {
      console.error('Error fetching audio episodes:', error);
      // Provide fallback episodes if database fails
      setAudioEpisodes([{
        id: 'fallback-s1e1',
        title: 'S1E1 - Reclaim Your Worth: Dismantling the Gratitude Tax and Earning What You Deserve',
        description: 'Explore how to break free from the "gratitude tax" - the expectation that you should accept less than you deserve simply because you have a job. Learn strategies to recognize your true worth and negotiate for what you deserve in your career.',
        audio_url: '/audio/s1e1-reclaim-your-worth.mp3',
        thumbnail_url: '/images/thumbnails/s1e1-thumbnail.png',
        duration: 1800, // 30 minutes placeholder
        play_count: 0,
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAudioEpisodes();
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

    // Limit to 25 most recent jobs for homepage
    filtered = filtered.slice(0, 25);

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
              {!isMobile && (
                <>
                  <h1 className="text-2xl font-bold text-foreground">Jobbyist</h1>
                  <Badge variant="secondary" className="ml-2">Beta</Badge>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
            {user && (
              <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-1 md:mr-2" />
                    {isMobile 
                      ? (user.email?.split('@')[0]?.substring(0, 8) + (user.email?.split('@')[0]?.length > 8 ? '...' : ''))
                      : user.email
                    }
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-1 md:mr-2" />
                  {isMobile ? 'Out' : 'Sign Out'}
                </Button>
              </div>
            )}
            {user?.email === 'mykeynotyours@example.com' && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/audio-upload">{isMobile ? 'Admin' : 'Admin Upload'}</Link>
              </Button>
            )}
            {!user && (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
            </div>
          </div>
        </div>
      </header>

      {/* Header Banner Ad */}
      <div className="hidden md:flex justify-center py-4 bg-background/30">
        <AdPlaceholder size="banner" label="Header Banner Ad" />
      </div>

      {/* Mobile Banner Ad */}
      <div className="md:hidden flex justify-center py-2 bg-background/30">
        <AdPlaceholder size="mobile" label="Mobile Banner Ad" />
      </div>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Africa's Premier Job Discovery & Career Management Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the most highly sought after, expertly curated job opportunities offered by world-class, verified companies, employers and recruiters looking for talent across Africa.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="font-medium">{jobs.length}+ New Jobs Listed Today</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Verified Companies Only</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-medium">New Jobs Posted Every Day</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-16 bg-background/50 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Companies
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover career opportunities with top employers across South Africa and Nigeria
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {/* Deloitte */}
            <Link to="/company/deloitte" className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/deloitte.svg" 
                  alt="Deloitte logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Deloitte</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">Global</p>
            </Link>

            {/* Vodacom Group */}
            <Link to="/company/vodacom" className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/vodacom.svg" 
                  alt="Vodacom Group logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Vodacom Group</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">South Africa</p>
            </Link>

            {/* Access Bank */}
            <Link to="/company/access-bank" className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/access-bank.svg" 
                  alt="Access Bank logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Access Bank</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">Nigeria</p>
            </Link>

            {/* Capitec Bank */}
            <Link to="/company/capitec" className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/capitec.svg" 
                  alt="Capitec Bank logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Capitec Bank</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">South Africa</p>
            </Link>

            {/* Amazon */}
            <Link to="/company/amazon" className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/amazon.svg" 
                  alt="Amazon logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Amazon</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">Global</p>
            </Link>

            {/* IBM */}
            <div className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer opacity-75">
              <div className="aspect-square bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/ibm.svg" 
                  alt="IBM logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">IBM</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">Global</p>
            </div>

            {/* Woolworths Holdings */}
            <div className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer opacity-75">
              <div className="aspect-square bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/woolworths.svg" 
                  alt="Woolworths logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Woolworths</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">South Africa</p>
            </div>

            {/* Automattic */}
            <div className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer opacity-75">
              <div className="aspect-square bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/automattic.svg" 
                  alt="Automattic logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Automattic</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">Global</p>
            </div>

            {/* Dangote Group */}
            <div className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer opacity-75">
              <div className="aspect-square bg-gradient-to-br from-red-600/10 to-red-700/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/dangote.svg" 
                  alt="Dangote Group logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Dangote Group</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">Nigeria</p>
            </div>

            {/* Yoco */}
            <div className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow group cursor-pointer opacity-75">
              <div className="aspect-square bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                <img 
                  src="/images/company-logos/yoco.svg" 
                  alt="Yoco logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-center text-sm">Yoco</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">South Africa</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Companies
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Recruitment Suite Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
                <Building2 className="h-5 w-5" />
                <span className="font-semibold">Early Access</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Recruitment Suite for SMEs
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Get ready for our comprehensive HR management solution launching January 2026. 
                Designed specifically for small and medium enterprises looking for turnkey staffing solutions at a fraction of the cost.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tailored Solutions</h3>
                <p className="text-muted-foreground">
                  Custom HR workflows designed specifically for your business size and industry requirements.
                </p>
              </div>

              <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Complete Staffing</h3>
                <p className="text-muted-foreground">
                  End-to-end recruitment and staffing management from job posting to onboarding.
                </p>
              </div>

              <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cost Effective</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade HR tools at SME-friendly prices. Get more value for your investment.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setIsRecruitmentModalOpen(true)}
              >
                Join Early Access Waiting List
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Launching January 2026 • Free to join waiting list • Priority access for early adopters
              </p>
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
            
            {/* Sidebar Rectangle Ad */}
            <div className="mt-6 hidden lg:block">
              <AdPlaceholder size="rectangle" label="Sidebar Ad" />
            </div>
          </aside>

          {/* Jobs List */}
          <main className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  Featured Jobs
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
              <div className="space-y-6">
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
                
                {/* Browse All Jobs Button */}
                <div className="text-center pt-4">
                  <Link to="/jobs">
                    <Button size="lg" variant="outline" className="min-w-[200px]">
                      Browse All Jobs
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Jobbyist Pro Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">Premium Service</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Accelerate Your Career with Jobbyist Pro
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get priority access to exclusive jobs, personalized career coaching, and advanced application tracking for just R99/month.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-6">
                <Crown className="h-8 w-8 text-primary mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Exclusive Jobs</h3>
                <p className="text-muted-foreground text-sm">Access premium job listings not available to free users</p>
              </div>
              
              <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-6">
                <CheckCircle className="h-8 w-8 text-primary mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Priority Applications</h3>
                <p className="text-muted-foreground text-sm">Your applications are highlighted to employers</p>
              </div>
              
              <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-6">
                <Users className="h-8 w-8 text-primary mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Career Coaching</h3>
                <p className="text-muted-foreground text-sm">One-on-one sessions with career experts</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground">
                7-day free trial • Cancel anytime • R99/month
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section Between Content */}
      <div className="py-8 bg-background/20">
        <div className="container mx-auto px-4 text-center">
          <AdPlaceholder size="rectangle" label="Content Rectangle Ad" className="mx-auto" />
        </div>
      </div>

      {/* ResumeAudit Section */}
      <section className="py-16 bg-gradient-to-r from-secondary/10 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full mb-6">
                  <FileText className="h-5 w-5" />
                  <span className="font-semibold">100% Free Tool</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Get Your Resume Professionally Audited
                </h2>
                
                <p className="text-xl text-muted-foreground mb-6">
                  Our AI-powered ResumeAudit tool analyzes your resume and provides actionable feedback to help you land more interviews.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">ATS compatibility check</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Keyword optimization suggestions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Format and design recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Industry-specific feedback</span>
                  </div>
                </div>

                <a href="https://audit.jobbyist.africa" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    <FileText className="h-5 w-5 mr-2" />
                   Claim My Free Resume/CV Audit
                  </Button>
                </a>
              </div>

              <div className="bg-background/50 border rounded-lg p-8 text-center">
                <div className="bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Upload Your Resume</h3>
                <p className="text-muted-foreground mb-6">
                  Drag & drop your resume or click to browse. We support PDF, DOC, and DOCX formats.
                </p>
                
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Click to upload or drag & drop</p>
                    <p className="text-sm mt-2">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Job Post
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Listen to expert advice, success stories, and practical tips to advance your career in the African job market. New episodes every weekday.
            </p>
          </div>

          <div className="mb-12">
            {loadingEpisodes ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading episodes...</p>
              </div>
            ) : audioEpisodes && audioEpisodes.length > 0 ? (
              <AudioPlayer 
                episodes={audioEpisodes.map(episode => ({
                  id: episode.id,
                  title: episode.title,
                  description: episode.description || 'No description available',
                  date: new Date(episode.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }),
                  audioUrl: episode.audio_url,
                  duration: episode.duration || 0,
                  initialPlayCount: episode.play_count || 0,
                  thumbnail: episode.thumbnail_url || null
                }))}
                currentEpisodeIndex={currentEpisodeIndex}
                onEpisodeChange={setCurrentEpisodeIndex}
              />
            ) : (
              <div className="text-center py-12 bg-background/50 border rounded-lg">
                <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">🎵</div>
                <h3 className="text-lg font-semibold mb-2">No episodes available</h3>
                <p className="text-muted-foreground">
                  Audio episodes will appear here once uploaded by an admin.
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              See More Episodes
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Banner Ad */}
      <div className="py-6 bg-background/10 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="hidden md:block">
            <AdPlaceholder size="banner" label="Footer Banner Ad" className="mx-auto" />
          </div>
          <div className="md:hidden">
            <AdPlaceholder size="mobile" label="Footer Mobile Ad" className="mx-auto" />
          </div>
        </div>
      </div>

      <Footer />
      
      <RecruitmentSuiteModal 
        open={isRecruitmentModalOpen} 
        onOpenChange={setIsRecruitmentModalOpen} 
      />
    </div>
  );
};

export default Index;
