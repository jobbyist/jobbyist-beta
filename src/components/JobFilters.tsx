import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Search } from 'lucide-react';

export interface JobFilters {
  search: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  remoteOnly: boolean;
  skills: string[];
}

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  availableSkills: string[];
}

const locations = [
  'All Locations',
  'Cape Town',
  'Johannesburg', 
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'Remote'
];

const jobTypes = [
  'All Types',
  'full-time',
  'part-time', 
  'contract',
  'freelance',
  'internship'
];

const experienceLevels = [
  'All Levels',
  'entry',
  'junior',
  'mid',
  'senior',
  'executive'
];

export const JobFilters = ({ filters, onFiltersChange, availableSkills }: JobFiltersProps) => {
  const updateFilter = (key: keyof JobFilters, value: string | boolean | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addSkill = (skill: string) => {
    if (!filters.skills.includes(skill)) {
      updateFilter('skills', [...filters.skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    updateFilter('skills', filters.skills.filter(s => s !== skill));
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      remoteOnly: false,
      skills: []
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filter Jobs</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, or keywords..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <Select value={filters.location} onValueChange={(value) => updateFilter('location', value === 'All Locations' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div>
          <label className="text-sm font-medium mb-2 block">Job Type</label>
          <Select value={filters.jobType} onValueChange={(value) => updateFilter('jobType', value === 'All Types' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="text-sm font-medium mb-2 block">Experience Level</label>
          <Select value={filters.experienceLevel} onValueChange={(value) => updateFilter('experienceLevel', value === 'All Levels' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map(level => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Remote Only Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remote-only"
            checked={filters.remoteOnly}
            onChange={(e) => updateFilter('remoteOnly', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="remote-only" className="text-sm font-medium">
            Remote jobs only
          </label>
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm font-medium mb-2 block">Skills</label>
          <Select onValueChange={addSkill}>
            <SelectTrigger>
              <SelectValue placeholder="Add skills" />
            </SelectTrigger>
            <SelectContent>
              {availableSkills
                .filter(skill => !filters.skills.includes(skill))
                .map(skill => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};