import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Facebook, Twitter, Instagram, Linkedin, Search, Moon, Sun, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import SearchModal from './SearchModal';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const footerSections = {
    locations: [
      'Johannesburg',
      'Cape Town', 
      'Abuja',
      'Lagos'
    ],
    jobTypes: [
      'Full Time',
      'Part Time',
      'Remote',
      'Contract'
    ],
    services: [
      'Browse Job Listings',
      'Upgrade To Pro',
      'Resume/CV Builder',
      'Company Directory'
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
              <img src="/JOBBYIST.svg" alt="Jobbyist Logo" className="h-12 w-12" />
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
                  <a href={`/jobs?location=${encodeURIComponent(item)}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Job Types</h4>
            <ul className="space-y-2">
              {footerSections.jobTypes.map((item) => {
                // Handle Remote separately as it's a filter, not a job type
                if (item === 'Remote') {
                  return (
                    <li key={item}>
                      <a href="/jobs?remote=true" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={item}>
                    <a href={`/jobs?type=${encodeURIComponent(item.toLowerCase().replace(' ', '-'))}`} className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {footerSections.services.map((item) => {
                if (item === 'Browse Job Listings') {
                  return (
                    <li key={item}>
                      <a href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </a>
                    </li>
                  );
                } else if (item === 'Upgrade To Pro') {
                  return (
                    <li key={item}>
                      <a href="/pro" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </a>
                    </li>
                  );
                } else if (item === 'Resume/CV Builder') {
                  return (
                    <li key={item}>
                      <a href="/builder" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </a>
                    </li>
                  );
                } else if (item === 'Company Directory') {
                  return (
                    <li key={item}>
                      <a href="/companies" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </a>
                    </li>
                  );
                } else {
                  return (
                    <li key={item}>
                      <a href={`/${item.toLowerCase().replace(/[\s-]/g, '-')}`} className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </a>
                    </li>
                  );
                }
              })}
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

        {/* App Store Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-2">Get the Mobile App</h4>
              <p className="text-sm text-muted-foreground">
                Stay connected with job opportunities on the go
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* App Store Badge */}
              <a 
                href="#" 
                className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
                aria-label="Download on the App Store"
              >
                <div className="flex items-center justify-center w-8 h-8">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>

              {/* Google Play Badge */}
              <a 
                href="#" 
                className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
                aria-label="Get it on Google Play"
              >
                <div className="flex items-center justify-center w-8 h-8">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Jobbyist. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Made with ❤️ for African job seekers
            </p>
          </div>
          
          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Theme:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
      
      <SearchModal 
        open={isSearchModalOpen} 
        onOpenChange={setIsSearchModalOpen} 
      />
    </footer>
  );
};

export default Footer;