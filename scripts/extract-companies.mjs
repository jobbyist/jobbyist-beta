import fs from 'fs';
import path from 'path';

// Read jobs data
const jobsData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'database', 'jobs.json'), 'utf-8')
);

// Extract company information from jobs
const companyMap = new Map();

jobsData.forEach(job => {
  const companyName = job.company;
  
  if (!companyMap.has(companyName)) {
    // Infer location from job listings
    const location = job.location.includes('Nigeria') ? 'Nigeria' : 
                    job.location.includes('South Africa') ? 'South Africa' : 
                    'Global';
    
    // Generate slug from company name
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    companyMap.set(companyName, {
      name: companyName,
      slug: slug,
      location: location,
      logo_url: `/images/company-logos/${slug}.svg`,
      description: '',
      industry: '',
      size: '',
      website: '',
      founded: '',
      specialties: [],
      is_active: true
    });
  }
});

// Convert to array and sort by name
const companies = Array.from(companyMap.values()).sort((a, b) => 
  a.name.localeCompare(b.name)
);

// Write to companies.json
fs.writeFileSync(
  path.join(process.cwd(), 'database', 'companies.json'),
  JSON.stringify(companies, null, 2)
);

console.log(`Extracted ${companies.length} unique companies`);
console.log('Companies data saved to database/companies.json');
