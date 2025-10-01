import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdPlaceholder from '@/components/AdPlaceholder';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  FileText, 
  Briefcase, 
  LogOut, 
  User,
  CheckCircle,
  Sparkles,
  Download,
  Zap,
  Target,
  Globe,
  ArrowRight,
  Edit3,
  Layout,
  Clock
} from 'lucide-react';
import Footer from '@/components/Footer';

const Builder = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "AI-Powered",
      description: "Smart suggestions and content optimization powered by advanced AI"
    },
    {
      icon: <Layout className="h-8 w-8 text-primary" />,
      title: "Professional Templates",
      description: "Choose from multiple ATS-friendly resume templates"
    },
    {
      icon: <Edit3 className="h-8 w-8 text-primary" />,
      title: "Easy Editing",
      description: "Intuitive interface to create and edit your resume effortlessly"
    },
    {
      icon: <Download className="h-8 w-8 text-primary" />,
      title: "Multiple Formats",
      description: "Download your resume in PDF, DOCX, or other formats"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "ATS-Optimized",
      description: "Ensure your resume passes Applicant Tracking Systems"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Quick & Free",
      description: "Create a professional resume in minutes, completely free"
    }
  ];

  const benefits = [
    "AI-powered content suggestions tailored to your industry",
    "Professional templates designed by career experts",
    "Real-time feedback on resume strength",
    "Export in multiple formats (PDF, DOCX, TXT)",
    "Mobile-friendly interface",
    "No hidden costs or premium upsells",
    "Privacy-focused - your data stays secure",
    "Regular updates with new features"
  ];

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
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <FileText className="h-4 w-4 mr-1 md:mr-2" />
                  {isMobile ? 'Jobs' : 'Browse Jobs'}
                </Link>
              </Button>
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
      <div className="py-4 bg-background/50 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="hidden md:block">
            <AdPlaceholder size="banner" label="Builder Page Header Ad" className="mx-auto" />
          </div>
          <div className="md:hidden">
            <AdPlaceholder size="mobile" label="Builder Mobile Header Ad" className="mx-auto" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full mb-6">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">100% Free Tool</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Build Your Perfect Resume with{' '}
            <span className="text-primary">Jobbyist Profiles</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume in minutes with our free AI-powered resume builder. 
            Stand out from the competition and land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="https://profiles.jobbyist.africa" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-8">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Building Your Resume
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            <CheckCircle className="inline h-4 w-4 text-primary mr-1" />
            No credit card required • 
            <CheckCircle className="inline h-4 w-4 text-primary mx-1" />
            100% Free Forever
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5 min</div>
              <div className="text-muted-foreground">Average Build Time</div>
            </div>
            <div className="text-center md:col-span-1 col-span-2">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-muted-foreground">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background/50 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Create a Winning Resume
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you stand out in the job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">Powerful Features</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Choose Jobbyist Profiles?
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8">
                  Our AI-powered resume builder is designed specifically for job seekers in Africa, 
                  with templates and suggestions tailored to local and international job markets.
                </p>

                <a href="https://profiles.jobbyist.africa" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="text-lg px-8">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Try It Now - It's Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </a>
              </div>

              <div className="bg-background/50 border rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-6">What You Get:</h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-background/50 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your Resume in 3 Easy Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes, no experience required
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Choose a Template</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Select from our professionally designed, ATS-friendly templates
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle>Add Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fill in your details with AI-powered suggestions and guidance
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Download & Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Export your resume and start applying to your dream jobs immediately
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Globe className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Build Your Professional Resume?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of job seekers who've created their perfect resume with Jobbyist Profiles. 
              It's completely free, no strings attached.
            </p>
            <a href="https://profiles.jobbyist.africa" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-8">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Building Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              No account required to start • Save and edit anytime • Export to multiple formats
            </p>
          </div>
        </div>
      </section>

      {/* Footer Ad */}
      <div className="py-6 bg-primary/5 border-t">
        <div className="container mx-auto px-4 text-center">
          <AdPlaceholder size="rectangle" label="Builder Page Footer Ad" className="mx-auto" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Builder;
