export interface JobPosting {
  "@context": "https://schema.org/";
  "@type": "JobPosting";
  title: string;
  description: string;
  identifier: {
    "@type": "PropertyValue";
    name: string;
    value: string;
  };
  datePosted: string;
  validThrough: string;
  employmentType: string;
  hiringOrganization: {
    "@type": "Organization";
    name: string;
    sameAs?: string;
    logo?: string;
  };
  jobLocation: {
    "@type": "Place";
    address: {
      "@type": "PostalAddress";
      streetAddress?: string;
      addressLocality: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry: string;
    };
  };
  baseSalary?: {
    "@type": "MonetaryAmount";
    currency: string;
    value: {
      "@type": "QuantitativeValue";
      value: number;
      unitText: "YEAR" | "MONTH" | "HOUR";
    };
  };
  jobLocationType?: "TELECOMMUTE";
  applicantLocationRequirements?: {
    "@type": "Country" | "State";
    name: string;
  };
}

export function generateJobSchema(job: any): JobPosting {
  const [city, region, country] = job.location.split(', ');
  
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id
    },
    datePosted: job.posted_date || job.created_at,
    validThrough: job.expires_date,
    employmentType: job.job_type.toUpperCase().replace('-', '_'),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: job.application_url,
      logo: job.company_logo_url
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        addressRegion: region,
        addressCountry: country.includes('South Africa') ? 'ZA' : 'NG'
      }
    },
    ...(job.salary_min && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: job.currency,
        value: {
          "@type": "QuantitativeValue",
          value: job.salary_min,
          unitText: "YEAR"
        }
      }
    }),
    ...(job.remote_allowed && {
      jobLocationType: "TELECOMMUTE"
    })
  };
}