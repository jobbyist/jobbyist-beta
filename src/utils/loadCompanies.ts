import companiesData from '@/database/companies.json';

export interface Company {
  name: string;
  slug: string;
  location: string;
  logo_url: string;
  description: string;
  industry: string;
  size: string;
  website: string;
  founded: string;
  specialties: string[];
  is_active: boolean;
}

/**
 * Load all companies from the local JSON database
 */
export const loadAllCompanies = (): Company[] => {
  return companiesData as Company[];
};

/**
 * Get a company by slug
 */
export const getCompanyBySlug = (slug: string): Company | undefined => {
  return companiesData.find((company: Company) => company.slug === slug);
};

/**
 * Get a company by name
 */
export const getCompanyByName = (name: string): Company | undefined => {
  return companiesData.find((company: Company) => company.name === name);
};

/**
 * Filter companies by search query
 */
export const filterCompanies = (companies: Company[], query: string): Company[] => {
  if (!query) return companies;
  
  const lowerQuery = query.toLowerCase();
  return companies.filter(company =>
    company.name.toLowerCase().includes(lowerQuery) ||
    company.location.toLowerCase().includes(lowerQuery) ||
    company.industry.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get all unique locations
 */
export const getAllLocations = (companies: Company[]): string[] => {
  const locations = new Set<string>();
  companies.forEach(company => {
    if (company.location) {
      locations.add(company.location);
    }
  });
  return Array.from(locations).sort();
};
