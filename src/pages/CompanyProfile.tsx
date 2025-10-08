import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/JobCard';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Building2, 
  ExternalLink,
  Briefcase,
  Award
} from 'lucide-react';
import { getCompanyBySlug } from '@/utils/loadCompanies';
import { loadAllJobs } from '@/utils/loadJobs';

interface Company {
  id: string;
  name: string;
  logo: string;
  location: string;
  description: string;
  industry: string;
  size: string;
  website: string;
  founded: string;
  specialties: string[];
  jobCount: number;
}

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      // Load company data
      const companyData = getCompanyBySlug(companyId);
      
      if (companyData) {
        setCompany(companyData);
        
        // Load jobs for this company
        const allJobs = loadAllJobs();
        const companyJobs = allJobs.filter(job => job.company === companyData.name);
        setJobs(companyJobs);
      }
      
      setLoading(false);
    }
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <p className="text-muted-foreground mb-6">The company profile you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/50">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/companies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={company.logo_url} 
                alt={`${company.name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="20" text-anchor="middle" x="50">' + company.name.substring(0, 2) + '</text></svg>';
                }}
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{company.location}</span>
                </div>
                {company.industry && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{company.industry}</span>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{company.size}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/jobs" state={{ company: company.name }}>
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Jobs ({jobs.length})
                  </Link>
                </Button>
                {company.website && (
                  <Button variant="outline" asChild>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
                <Button variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Claim this page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {company.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About {company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {company.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Specialties */}
            {company.specialties && company.specialties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {company.specialties.map((specialty: string) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Job Openings</CardTitle>
                <CardDescription>
                  {jobs.length > 0 ? `${jobs.length} active positions` : 'No active positions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                    {jobs.length > 5 && (
                      <Button variant="outline" asChild className="w-full mt-4">
                        <Link to="/jobs" state={{ company: company.name }}>
                          View all {jobs.length} jobs
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No job openings at the moment</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/jobs">
                        Browse All Jobs
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.founded && (
                  <div>
                    <h4 className="font-semibold mb-1">Founded</h4>
                    <p className="text-muted-foreground">{company.founded}</p>
                  </div>
                )}
                {company.industry && (
                  <div>
                    <h4 className="font-semibold mb-1">Industry</h4>
                    <p className="text-muted-foreground">{company.industry}</p>
                  </div>
                )}
                {company.size && (
                  <div>
                    <h4 className="font-semibold mb-1">Company Size</h4>
                    <p className="text-muted-foreground">{company.size}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p className="text-muted-foreground">{company.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to="/jobs" state={{ company: company.name }}>
                    View All Jobs
                  </Link>
                </Button>
                {company.website && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;