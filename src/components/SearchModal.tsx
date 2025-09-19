import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  const locations = [
    'Johannesburg',
    'Cape Town',
    'Lagos',
    'Pretoria',
    'Durban',
    'Port Elizabeth',
    'Abuja',
    'Kano',
    'Ibadan'
  ];

  const jobTypes = [
    'full-time',
    'part-time',
    'contract',
    'remote'
  ];

  const experienceLevels = [
    'entry',
    'junior',
    'mid',
    'senior',
    'executive'
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (jobType) params.set('type', jobType);
    if (experienceLevel) params.set('level', experienceLevel);

    const queryString = params.toString();
    navigate(`/jobs${queryString ? `?${queryString}` : ''}`);
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Search className="h-6 w-6 text-primary" />
            Find Your Next Opportunity
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search Query */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              What are you looking for?
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Job title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Where do you want to work?
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <SelectValue placeholder="Select location" className="pl-7" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc.toLowerCase()}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Job Type
              </label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Experience Level
              </label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            className="w-full h-12 text-lg"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Jobs
          </Button>

          {/* Quick Links */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Software Engineer', 'Marketing Manager', 'Data Scientist', 'Product Manager'].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(term);
                    const params = new URLSearchParams();
                    params.set('q', term);
                    navigate(`/jobs?${params.toString()}`);
                    onOpenChange(false);
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;