import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { JobFilters as JobFiltersComponent } from '@/components/JobFilters';
import { JobCard } from '@/components/JobCard';
import { generateJobSchema } from '@/utils/google-jobs-schema';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, MapPin, Briefcase } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  currency: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills_required: string[];
  experience_level: string;
  application_url: string;
  company_logo_url: string;
  source_website: string;
  source_url: string;
  salary_min: number;
  salary_max: number;
  remote_allowed: boolean;
  posted_date: string;
  expires_date: string;
  created_at: string;
}

interface JobFilters {
  search: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  remoteOnly: boolean;
  skills: string[];
}

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const jobsPerPage = 20;
  
  const [filters, setFilters] = useState<JobFilters>({
    search: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('type') || '',
    experienceLevel: searchParams.get('level') || '',
    remoteOnly: searchParams.get('remote') === 'true',
    skills: searchParams.get('skills')?.split(',').filter(Boolean) || []
  });

  const [availableSkills] = useState([
    'JavaScript', 'TypeScript', 'React', 'Python', 'Java', 'Node.js',
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'Machine Learning',
    'Product Management', 'Digital Marketing', 'Business Analysis',
    'Project Management', 'UX Design', 'Data Analysis'
  ]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  // Reset to page 1 when filters change  
  useEffect(() => {
    if (currentPage > 1) {
      const params = new URLSearchParams(searchParams);
      params.delete('page');
      setSearchParams(params);
    }
  }, [filters]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.location) params.set('location', filters.location);
    if (filters.jobType) params.set('type', filters.jobType);
    if (filters.experienceLevel) params.set('level', filters.experienceLevel);
    if (filters.remoteOnly) params.set('remote', 'true');
    if (filters.skills.length > 0) params.set('skills', filters.skills.join(','));
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [filters, currentPage, setSearchParams]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('posted_date', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.skills_required?.some(skill => skill.toLowerCase().includes(searchTerm))
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
          job.skills_required?.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    setFilteredJobs(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Pagination helpers
  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Add structured data for Google Jobs
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "ItemList",
      "itemListElement": filteredJobs.slice(0, 10).map((job, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": generateJobSchema(job)
      }))
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [filteredJobs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <title>Jobs in South Africa & Nigeria - Find Your Dream Career | Jobbyist</title>
      <meta name="description" content="Browse thousands of job opportunities across South Africa and Nigeria. Find your perfect career match with top companies hiring now. Apply today!" />
      <meta name="keywords" content="jobs, careers, employment, South Africa, Nigeria, hiring, recruitment" />
      <link rel="canonical" href="https://jobbyist.africa/jobs" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Your Dream Job in Africa
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover opportunities across South Africa and Nigeria's top companies
          </p>
          
          {/* Quick Search */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
              <div className="relative min-w-[200px]">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <JobFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              availableSkills={availableSkills}
            />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {filteredJobs.length} Jobs Found
                </h2>
              </div>
              {totalPages > 1 && (
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length}
                </div>
              )}
            </div>

            {filteredJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No jobs found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all available positions.
                </p>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {currentJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) {
                                updatePage(currentPage - 1);
                              }
                            }}
                            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {generatePageNumbers().map((page, index) => (
                          <PaginationItem key={index}>
                            {page === 'ellipsis' ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updatePage(page as number);
                                }}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) {
                                updatePage(currentPage + 1);
                              }
                            }}
                            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;