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

  // Mock company data - in production this would come from a database
  const companies: Record<string, Company> = {
    'deloitte': {
      id: 'deloitte',
      name: 'Deloitte',
      logo: '/images/company-logos/deloitte.svg',
      location: 'Global',
      description: 'Deloitte is a leading global provider of audit and assurance, consulting, financial advisory, risk advisory, tax, and related services. Our network of member firms spans more than 150 countries and territories.',
      industry: 'Professional Services',
      size: '10,000+ employees',
      website: 'https://deloitte.com',
      founded: '1845',
      specialties: ['Audit & Assurance', 'Consulting', 'Risk Advisory', 'Tax Services', 'Financial Advisory'],
      jobCount: 12
    },
    'vodacom': {
      id: 'vodacom',
      name: 'Vodacom Group',
      logo: '/images/company-logos/vodacom.svg',
      location: 'South Africa',
      description: 'Vodacom Group is a leading African mobile communications company, providing a wide range of communication services across the continent. We connect millions of people and enable them to participate in the digital economy.',
      industry: 'Telecommunications',
      size: '5,000+ employees',
      website: 'https://vodacom.co.za',
      founded: '1994',
      specialties: ['Mobile Networks', 'Digital Services', 'IoT Solutions', 'Financial Services', '5G Technology'],
      jobCount: 8
    },
    'access-bank': {
      id: 'access-bank',
      name: 'Access Bank',
      logo: '/images/company-logos/access-bank.svg',
      location: 'Nigeria',
      description: 'Access Bank PLC is a commercial bank in Nigeria and one of the five largest banks in the country by market capitalization. We provide comprehensive banking and financial services to individuals and businesses.',
      industry: 'Banking & Finance',
      size: '1,000+ employees',
      website: 'https://accessbankplc.com',
      founded: '1989',
      specialties: ['Retail Banking', 'Corporate Banking', 'Digital Banking', 'Investment Banking', 'Trade Finance'],
      jobCount: 15
    },
    'capitec': {
      id: 'capitec',
      name: 'Capitec Bank',
      logo: '/images/company-logos/capitec.svg',
      location: 'South Africa',
      description: 'Capitec Bank is a South African retail bank that offers simplified, accessible, and affordable banking solutions. We are known for our client-centric approach and innovative digital banking services.',
      industry: 'Banking & Finance',
      size: '1,500+ employees',
      website: 'https://capitecbank.co.za',
      founded: '2001',
      specialties: ['Retail Banking', 'Digital Banking', 'Personal Loans', 'Investment Products', 'Insurance'],
      jobCount: 6
    },
    'amazon': {
      id: 'amazon',
      name: 'Amazon',
      logo: '/images/company-logos/amazon.svg',
      location: 'Global',
      description: 'Amazon is a multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence. We are committed to being Earth\'s Most Customer-Centric Company.',
      industry: 'Technology',
      size: '10,000+ employees',
      website: 'https://amazon.com',
      founded: '1994',
      specialties: ['E-commerce', 'Cloud Computing', 'Artificial Intelligence', 'Digital Streaming', 'Logistics'],
      jobCount: 25
    }
  };

  const company = companies[companyId || ''];

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

            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Openings</CardTitle>
                <CardDescription>
                  Latest opportunities at {company.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Connect to database to view actual job listings</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/jobs" state={{ company: company.name }}>
                      View All Jobs
                    </Link>
                  </Button>
                </div>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;