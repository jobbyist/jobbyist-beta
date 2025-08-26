import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobListing {
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements: string[];
  skills_required: string[];
  experience_level: string;
  remote_allowed: boolean;
  application_url: string;
  source_website: string;
  source_url: string;
  posted_date?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Mock job data for demonstration - in production, this would scrape real sites
    const mockJobs: JobListing[] = [
      {
        title: "Senior Software Developer",
        company: "TechCorp SA",
        location: "Cape Town, South Africa",
        job_type: "full-time",
        salary_min: 600000,
        salary_max: 800000,
        description: "We are seeking a Senior Software Developer to join our growing tech team. You will be responsible for developing scalable web applications and mentoring junior developers.",
        requirements: ["5+ years of software development experience", "Strong proficiency in React and Node.js", "Experience with cloud platforms (AWS/Azure)", "Bachelor's degree in Computer Science or related field"],
        skills_required: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        experience_level: "senior",
        remote_allowed: true,
        application_url: "https://example.com/apply/1",
        source_website: "LinkedIn",
        source_url: "https://linkedin.com/jobs/123456",
        posted_date: new Date().toISOString(),
      },
      {
        title: "Marketing Manager",
        company: "GrowthHub Africa",
        location: "Johannesburg, South Africa",
        job_type: "full-time",
        salary_min: 450000,
        salary_max: 600000,
        description: "Join our dynamic marketing team as a Marketing Manager. You'll lead digital marketing campaigns and drive brand awareness across African markets.",
        requirements: ["3+ years of marketing experience", "Digital marketing expertise", "Experience with SEO/SEM", "Strong analytical skills"],
        skills_required: ["Digital Marketing", "SEO", "Google Ads", "Analytics", "Content Marketing"],
        experience_level: "mid",
        remote_allowed: false,
        application_url: "https://example.com/apply/2",
        source_website: "Indeed",
        source_url: "https://indeed.co.za/jobs/789012",
        posted_date: new Date().toISOString(),
      },
      {
        title: "Data Analyst",
        company: "DataMinds Solutions",
        location: "Durban, South Africa",
        job_type: "contract",
        salary_min: 400000,
        salary_max: 550000,
        description: "We're looking for a skilled Data Analyst to help us derive insights from complex datasets and support business decision-making.",
        requirements: ["2+ years of data analysis experience", "Proficiency in SQL and Python", "Experience with data visualization tools", "Strong statistical knowledge"],
        skills_required: ["SQL", "Python", "Tableau", "Excel", "Statistics"],
        experience_level: "mid",
        remote_allowed: true,
        application_url: "https://example.com/apply/3",
        source_website: "Glassdoor",
        source_url: "https://glassdoor.com/job/345678",
        posted_date: new Date().toISOString(),
      },
      {
        title: "Junior Frontend Developer",
        company: "StartupTech",
        location: "Cape Town, South Africa",
        job_type: "full-time",
        salary_min: 300000,
        salary_max: 450000,
        description: "Perfect opportunity for a junior developer to grow their career. You'll work on exciting projects using modern web technologies.",
        requirements: ["1+ years of frontend development experience", "Knowledge of HTML, CSS, JavaScript", "Familiarity with React", "Passion for learning"],
        skills_required: ["HTML", "CSS", "JavaScript", "React", "Git"],
        experience_level: "junior",
        remote_allowed: true,
        application_url: "https://example.com/apply/4",
        source_website: "Careers24",
        source_url: "https://careers24.com/job/456789",
        posted_date: new Date().toISOString(),
      },
      {
        title: "Project Manager",
        company: "BuildCorp SA",
        location: "Pretoria, South Africa",
        job_type: "full-time",
        salary_min: 500000,
        salary_max: 700000,
        description: "Lead cross-functional teams and deliver projects on time and within budget. We're looking for an experienced project manager with a proven track record.",
        requirements: ["PMP certification preferred", "5+ years of project management experience", "Experience with Agile methodologies", "Strong leadership skills"],
        skills_required: ["Project Management", "Agile", "Scrum", "Leadership", "Communication"],
        experience_level: "senior",
        remote_allowed: false,
        application_url: "https://example.com/apply/5",
        source_website: "MyJobMag",
        source_url: "https://myjobmag.co.za/job/567890",
        posted_date: new Date().toISOString(),
      }
    ];

    console.log(`Scraping jobs - found ${mockJobs.length} new listings`);

    // Insert jobs into database
    const { data: insertedJobs, error: insertError } = await supabase
      .from('jobs')
      .upsert(mockJobs, { 
        onConflict: 'source_url',
        ignoreDuplicates: true 
      })
      .select();

    if (insertError) {
      console.error('Error inserting jobs:', insertError);
      throw insertError;
    }

    console.log(`Successfully inserted ${insertedJobs?.length || 0} jobs`);

    // Use AI to enhance job descriptions if OpenAI key is available
    if (openAIApiKey && insertedJobs?.length) {
      for (const job of insertedJobs.slice(0, 2)) { // Limit to 2 jobs for demo
        try {
          const enhancementPrompt = `Please enhance this job description to be more engaging and comprehensive while keeping it professional. Add relevant details about company culture, growth opportunities, and benefits that would typically be found in South African job postings.

Original: ${job.description}

Company: ${job.company}
Position: ${job.title}
Location: ${job.location}`;

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: 'You are a professional HR assistant who writes compelling job descriptions for the South African job market.' },
                { role: 'user', content: enhancementPrompt }
              ],
              max_tokens: 500,
              temperature: 0.7,
            }),
          });

          if (response.ok) {
            const aiData = await response.json();
            const enhancedDescription = aiData.choices[0].message.content;

            await supabase
              .from('jobs')
              .update({ description: enhancedDescription })
              .eq('id', job.id);

            console.log(`Enhanced description for job: ${job.title}`);
          }
        } catch (aiError) {
          console.error('Error enhancing job description:', aiError);
          // Continue without failing the entire operation
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully scraped and inserted ${insertedJobs?.length || 0} jobs`,
        jobsProcessed: insertedJobs?.length || 0 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in job-scraper function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});