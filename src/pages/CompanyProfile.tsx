import { useParams, Link } from 'react-router-dom';
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
  Briefcase
} from 'lucide-react';
import { getCompanyById, getJobsForCompany } from '@/utils/loadCompanies';

const CompanyProfile = () => {
  const { companyId } = useParams();

  // Load company data from database
  const company = getCompanyById(companyId || '');
  const jobs = company ? getJobsForCompany(company.name) : [];

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
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="w-full h-full object-contain"
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
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{company.industry}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{company.size}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/jobs" state={{ company: company.name }}>
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Jobs ({company.jobCount})
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
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

            {/* Specialties */}
            {company.specialties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {company.specialties.map((specialty) => (
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
                  {jobs.length > 0 ? `${jobs.length} current opportunities at ${company.name}` : `No current opportunities at ${company.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                    {jobs.length > 5 && (
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link to="/jobs" state={{ company: company.name }}>
                          View All {jobs.length} Jobs
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No current job openings</p>
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
                <div>
                  <h4 className="font-semibold mb-1">Founded</h4>
                  <p className="text-muted-foreground">{company.founded}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Industry</h4>
                  <p className="text-muted-foreground">{company.industry}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Company Size</h4>
                  <p className="text-muted-foreground">{company.size}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Headquarters</h4>
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
                <Button variant="outline" className="w-full" asChild>
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <a href="mailto:hello@jobbyist.africa?subject=Claim%20Company%20Page">
                    Claim this page
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;