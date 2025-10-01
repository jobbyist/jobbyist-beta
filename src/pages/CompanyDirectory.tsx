import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Building2 } from 'lucide-react';
import { useState } from 'react';
import RecruitmentSuiteModal from '@/components/RecruitmentSuiteModal';

interface Company {
  id: string;
  name: string;
  logo: string;
  location: string;
  gradient: string;
}

const CompanyDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);

  const companies: Company[] = [
    {
      id: 'deloitte',
      name: 'Deloitte',
      logo: '/images/company-logos/deloitte.svg',
      location: 'Global',
      gradient: 'from-green-500/10 to-green-600/10'
    },
    {
      id: 'vodacom',
      name: 'Vodacom Group',
      logo: '/images/company-logos/vodacom.svg',
      location: 'South Africa',
      gradient: 'from-red-500/10 to-red-600/10'
    },
    {
      id: 'access-bank',
      name: 'Access Bank',
      logo: '/images/company-logos/access-bank.svg',
      location: 'Nigeria',
      gradient: 'from-orange-500/10 to-orange-600/10'
    },
    {
      id: 'capitec',
      name: 'Capitec Bank',
      logo: '/images/company-logos/capitec.svg',
      location: 'South Africa',
      gradient: 'from-blue-500/10 to-blue-600/10'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo: '/images/company-logos/amazon.svg',
      location: 'Global',
      gradient: 'from-yellow-500/10 to-orange-500/10'
    }
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <title>Company Directory | Jobbyist - Browse Top Employers</title>
      <meta name="description" content="Explore our directory of top employers across Africa. Find companies hiring in South Africa and Nigeria." />
      <link rel="canonical" href="https://jobbyist.africa/companies" />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Company Directory</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Discover career opportunities with top employers across South Africa and Nigeria
          </p>
        </header>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search companies by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'company' : 'companies'}
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map((company) => (
            <Link
              key={company.id}
              to={`/company/${company.id}`}
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`aspect-square bg-gradient-to-br ${company.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden`}>
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground text-center mb-2">
                    {company.name}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {company.location}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredCompanies.length === 0 && (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>About Our Company Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our directory features top employers across Africa who are actively hiring talented professionals. 
              Click on any company to view their profile, learn more about their culture, and browse their current job openings.
            </p>
            <p className="text-muted-foreground">
              Are you an employer looking to be featured? <button onClick={() => setIsRecruitmentModalOpen(true)} className="text-primary hover:underline cursor-pointer">Try Recruitment Suite</button> to showcase your company and attract top talent.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Suite Modal */}
      <RecruitmentSuiteModal open={isRecruitmentModalOpen} onOpenChange={setIsRecruitmentModalOpen} />
    </div>
  );
};

export default CompanyDirectory;
