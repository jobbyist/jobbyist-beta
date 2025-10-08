// Utility to load companies from the local companies.json database
import companiesData from '../../database/companies.json';
import { loadAllJobs } from './loadJobs';

export interface Company {
  id: string;
  name: string;
  logo: string;
  location: string;
  gradient: string;
  description: string;
  industry: string;
  size: string;
  website: string;
  founded: string;
  specialties: string[];
  jobCount: number;
}

/**
 * Load all companies from the local JSON database
 */
export function loadAllCompanies(): Company[] {
  return companiesData as Company[];
}

/**
 * Get a company by ID
 */
export function getCompanyById(id: string): Company | undefined {
  return companiesData.find((company: Company) => company.id === id);
}

/**
 * Get a company by exact name
 */
export function getCompanyByName(name: string): Company | undefined {
  return companiesData.find((company: Company) => company.name === name);
}

/**
 * Filter companies based on search query
 */
export function filterCompanies(
  companies: Company[],
  searchQuery: string
): Company[] {
  const query = searchQuery.toLowerCase();
  return companies.filter(company =>
    company.name.toLowerCase().includes(query) ||
    company.location.toLowerCase().includes(query)
  );
}

/**
 * Get jobs for a specific company
 */
export function getJobsForCompany(companyName: string) {
  const allJobs = loadAllJobs();
  return allJobs.filter(job => job.company === companyName);
}

/**
 * Get company ID from company name (for URL generation)
 */
export function getCompanyIdFromName(companyName: string): string {
  const company = getCompanyByName(companyName);
  if (company) {
    return company.id;
  }
  // Fallback: generate ID from name
  return companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
