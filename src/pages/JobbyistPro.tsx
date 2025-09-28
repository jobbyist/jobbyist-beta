import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdPlaceholder from '@/components/AdPlaceholder';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Crown, 
  Briefcase, 
  LogOut, 
  User,
  CheckCircle,
  Star,
  Zap,
  Users,
  Calendar,
  FileText,
  ArrowRight,
  Shield,
  Target,
  Headphones,
  TrendingUp,
  Clock
} from 'lucide-react';
import Footer from '@/components/Footer';

const JobbyistPro = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const features = [
    {
      icon: <Crown className="h-8 w-8 text-primary" />,
      title: "Exclusive Job Access",
      description: "Get first access to premium job listings not available to free users"
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Priority Applications",
      description: "Your applications are highlighted and prioritized to employers"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Personal Career Coach",
      description: "One-on-one sessions with experienced career professionals"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Advanced Job Alerts",
      description: "Real-time notifications for jobs matching your exact criteria"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "AI-Powered Job Matching",
      description: "Smart algorithms match you with the most relevant opportunities based on your skills and preferences"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Profile Verification",
      description: "Verified badge to stand out to employers and recruiters"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Ad-Free Browsing Experience",
      description: "Enjoy uninterrupted job searching without any advertisements or distractions"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Application Tracking",
      description: "Advanced analytics and insights on your job applications"
    },
    {
      icon: <Headphones className="h-8 w-8 text-primary" />,
      title: "24/7 Priority Support",
      description: "Dedicated support team available whenever you need help"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "CV Review Service",
      description: "Professional CV reviews and optimization by career experts"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Software Engineer",
      location: "Cape Town",
      content: "Jobbyist Pro helped me land my dream job in tech. The career coaching sessions were invaluable!",
      rating: 5
    },
    {
      name: "David K.",
      role: "Marketing Manager", 
      location: "Lagos",
      content: "The exclusive job listings gave me access to opportunities I wouldn't have found elsewhere.",
      rating: 5
    },
    {
      name: "Amara T.",
      role: "Data Analyst",
      location: "Johannesburg", 
      content: "Priority applications feature really works - I got 3x more interview calls after upgrading.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Pro Monthly",
      price: "R99",
      period: "/month",
      description: "Perfect for active job seekers",
      features: [
        "All Pro features included",
        "Unlimited job applications",
        "Priority support",
        "Cancel anytime"
      ],
      recommended: false
    },
    {
      name: "Pro Annual",
      price: "R990",
      period: "/year",
      originalPrice: "R1,188",
      description: "Best value - save 2 months!",
      features: [
        "All Pro features included",
        "Unlimited job applications",
        "Priority support",
        "2 months free",
        "Annual career review"
      ],
      recommended: true
    }
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
            <AdPlaceholder size="banner" label="Pro Page Header Ad" className="mx-auto" />
          </div>
          <div className="md:hidden">
            <AdPlaceholder size="mobile" label="Pro Mobile Header Ad" className="mx-auto" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Premium Service</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Accelerate Your Career with{' '}
            <span className="text-primary">Jobbyist Pro</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get priority access to exclusive jobs, personalized career coaching, and advanced application tracking. Join thousands of professionals who've supercharged their career journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8">
              Start 7-Day Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground">
              No credit card required • Cancel anytime
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <div className="text-muted-foreground">Pro Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">85%</div>
              <div className="text-muted-foreground">Job Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">3x</div>
              <div className="text-muted-foreground">More Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">14 Days</div>
              <div className="text-muted-foreground">Average Job Hunt</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background/50 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and services designed to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories from Our Pro Members
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real results from real professionals across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-background/50 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing options to suit your career goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.recommended ? 'border-primary shadow-lg' : ''}`}>
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        Was {plan.originalPrice}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.recommended ? "default" : "outline"}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              All plans include a 7-day free trial. No commitment required.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included in the free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your 7-day free trial includes full access to all Jobbyist Pro features: exclusive jobs, 
                  priority applications, career coaching session, advanced alerts, and more. No credit card required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have 
                  access to Pro features until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the career coaching work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pro members get access to one-on-one virtual sessions with certified career coaches. 
                  Sessions can be scheduled through your dashboard and cover resume reviews, interview prep, 
                  career planning, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, debit cards, and digital payment methods including 
                  PayPal, Apple Pay, and Google Pay. All payments are processed securely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've found their dream jobs with Jobbyist Pro. 
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/">Browse Free Jobs</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            7-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer Ad */}
      <div className="py-6 bg-primary/5 border-t">
        <div className="container mx-auto px-4 text-center">
          <AdPlaceholder size="rectangle" label="Pro Page Footer Ad" className="mx-auto" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobbyistPro;