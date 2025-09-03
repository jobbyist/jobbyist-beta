import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    locations: [
      'Johannesburg',
      'Cape Town', 
      'Lagos',
      'Pretoria'
    ],
    jobTypes: [
      'Full-time Jobs',
      'Part-time Jobs',
      'Remote Jobs',
      'Contract Jobs'
    ],
    services: [
      'Job Search',
      'Resume Audit',
      'Career Coaching',
      'Company Reviews'
    ],
    legal: [
      'Privacy Policy',
      'Terms of Service',
      'Cookie Policy',
      'Data Protection'
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/jobbyist', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/jobbyist', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/jobbyist', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/jobbyist', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Jobbyist</h3>
              <Badge variant="secondary" className="ml-2">Beta</Badge>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Africa's leading job platform connecting top talent with premier employers across Nigeria and South Africa.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                    asChild
                  >
                    <a 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Footer Link Sections */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Locations</h4>
            <ul className="space-y-2">
              {footerSections.locations.map((item) => (
                <li key={item}>
                  <a href={`/jobs/${item.toLowerCase().replace(' ', '-')}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Job Types</h4>
            <ul className="space-y-2">
              {footerSections.jobTypes.map((item) => (
                <li key={item}>
                  <a href={`/jobs/${item.toLowerCase().replace(/[\s-]/g, '-')}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {footerSections.services.map((item) => (
                <li key={item}>
                  <a href={`/${item.toLowerCase().replace(/[\s-]/g, '-')}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal Stuff</h4>
            <ul className="space-y-2">
              {footerSections.legal.map((item) => (
                <li key={item}>
                  <a href={`/${item.toLowerCase().replace(/[\s-]/g, '-')}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Jobbyist. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with ❤️ for African job seekers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;