import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '@/components/JobCard';

const mockJob = {
  id: '1',
  title: 'Software Developer',
  company: 'Tech Corp',
  location: 'Cape Town, South Africa',
  job_type: 'full-time',
  currency: 'ZAR',
  description: 'A great opportunity for a software developer.',
  requirements: ['React', 'TypeScript'],
  benefits: ['Health insurance', 'Remote work'],
  skills_required: ['React', 'TypeScript', 'Node.js'],
  experience_level: 'mid',
  application_url: 'https://example.com/apply',
  company_logo_url: '',
  source_website: 'LinkedIn',
  source_url: 'https://linkedin.com/jobs/1',
  salary_min: 400000,
  salary_max: 600000,
  remote_allowed: true,
  posted_date: '2024-01-01T00:00:00Z',
  expires_date: '2024-02-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
};

describe('JobCard', () => {
  it('renders job information correctly', () => {
    const mockSaveToggle = vi.fn();
    
    render(
      <JobCard 
        job={mockJob} 
        isSaved={false} 
        onSaveToggle={mockSaveToggle} 
      />
    );

    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Cape Town, South Africa')).toBeInTheDocument();
    expect(screen.getByText('R400,000 - R600,000')).toBeInTheDocument();
  });

  it('calls onSaveToggle when save button is clicked', () => {
    const mockSaveToggle = vi.fn();
    
    render(
      <JobCard 
        job={mockJob} 
        isSaved={false} 
        onSaveToggle={mockSaveToggle} 
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(mockSaveToggle).toHaveBeenCalledWith('1');
  });

  it('shows saved state correctly', () => {
    const mockSaveToggle = vi.fn();
    
    render(
      <JobCard 
        job={mockJob} 
        isSaved={true} 
        onSaveToggle={mockSaveToggle} 
      />
    );

    expect(screen.getByRole('button', { name: /unsave/i })).toBeInTheDocument();
  });
});