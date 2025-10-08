// Utility to load jobs from the local jobs.json database
import jobsData from '../../database/jobs.json';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills_required: string[];
  experience_level: string;
  remote_allowed: boolean;
  application_url: string;
  company_logo_url: string;
  source_website: string;
  source_url: string;
  is_active: boolean;
  posted_date: string;
  expires_date: string;
  created_at: string;
  updated_at: string;
}

/**
 * Load all active jobs from the local JSON database
 */
export function loadAllJobs(): Job[] {
  return jobsData.filter((job: Job) => job.is_active);
}

/**
 * Get a job by ID
 */
export function getJobById(id: string): Job | undefined {
  return jobsData.find((job: Job) => job.id === id && job.is_active);
}

/**
 * Filter jobs based on various criteria
 */
export function filterJobs(
  jobs: Job[],
  filters: {
    search?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    remoteOnly?: boolean;
    skills?: string[];
  }
): Job[] {
  let filtered = [...jobs];

  // Search filter (searches in title, company, description)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
    );
  }

  // Location filter
  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    filtered = filtered.filter((job) =>
      job.location.toLowerCase().includes(locationLower)
    );
  }

  // Job type filter
  if (filters.jobType) {
    filtered = filtered.filter((job) => job.job_type === filters.jobType);
  }

  // Experience level filter
  if (filters.experienceLevel) {
    filtered = filtered.filter(
      (job) => job.experience_level === filters.experienceLevel
    );
  }

  // Remote only filter
  if (filters.remoteOnly) {
    filtered = filtered.filter((job) => job.remote_allowed);
  }

  // Skills filter
  if (filters.skills && filters.skills.length > 0) {
    filtered = filtered.filter((job) =>
      filters.skills!.some((skill) =>
        job.skills_required.some(
          (jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase()
        )
      )
    );
  }

  return filtered;
}

/**
 * Get all unique skills from jobs
 */
export function getAllSkills(jobs: Job[]): string[] {
  const skills = new Set<string>();
  jobs.forEach((job) => {
    job.skills_required.forEach((skill) => skills.add(skill));
  });
  return Array.from(skills).sort();
}

/**
 * Get all unique locations from jobs
 */
export function getAllLocations(jobs: Job[]): string[] {
  const locations = new Set<string>();
  jobs.forEach((job) => {
    locations.add(job.location);
  });
  return Array.from(locations).sort();
}

/**
 * Paginate jobs
 */
export function paginateJobs(
  jobs: Job[],
  page: number,
  perPage: number
): Job[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return jobs.slice(start, end);
}
