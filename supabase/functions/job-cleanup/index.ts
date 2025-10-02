import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Job cleanup function loaded")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables - these are automatically provided by Supabase Edge Functions
    // and configured via GitHub Secrets for local/CI deployments
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    console.log("Starting job cleanup process...")

    // Delete jobs older than 30 days from SA and Nigeria
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: deletedJobs, error: deleteError } = await supabaseClient
      .from('jobs')
      .delete()
      .or(`location.ilike.%South Africa%,location.ilike.%Nigeria%`)
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select()

    if (deleteError) {
      console.error('Error deleting old jobs:', deleteError)
      throw deleteError
    }

    console.log(`Deleted ${deletedJobs?.length || 0} old job listings`)

    // Generate new job listings
    const currentDate = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(currentDate.getDate() + 7)

    // South African job listings
    const southAfricanJobs = [
      {
        title: "Senior React Developer",
        company: "Discovery Health",
        location: "Sandton, Gauteng, South Africa",
        job_type: "full-time",
        currency: "ZAR",
        description: "Build cutting-edge healthcare applications using React and modern web technologies.",
        requirements: ["5+ years React experience", "TypeScript proficiency", "Healthcare domain knowledge preferred"],
        benefits: ["Medical aid", "Discovery Miles", "Flexible working hours"],
        skills_required: ["React", "TypeScript", "Node.js", "GraphQL"],
        experience_level: "senior",
        application_url: "https://discovery.co.za/careers",
        source_website: "Discovery Careers",
        source_url: `https://discovery.co.za/careers/react-developer-${Date.now()}`,
        salary_min: 800000,
        salary_max: 1200000,
        remote_allowed: true,
        posted_date: currentDate.toISOString(),
        expires_date: nextWeek.toISOString(),
      },
      {
        title: "Data Engineer",
        company: "Standard Bank",
        location: "Johannesburg, Gauteng, South Africa",
        job_type: "full-time",
        currency: "ZAR",
        description: "Design and implement data pipelines for banking analytics and reporting.",
        requirements: ["3+ years data engineering", "Python/Scala experience", "Big data technologies"],
        benefits: ["Medical aid", "Pension fund", "Professional development"],
        skills_required: ["Python", "Apache Spark", "Kafka", "SQL"],
        experience_level: "mid-level",
        application_url: "https://standardbank.co.za/careers",
        source_website: "Standard Bank Careers",
        source_url: `https://standardbank.co.za/careers/data-engineer-${Date.now()}`,
        salary_min: 650000,
        salary_max: 950000,
        remote_allowed: false,
        posted_date: currentDate.toISOString(),
        expires_date: nextWeek.toISOString(),
      }
    ]

    // Nigerian job listings
    const nigerianJobs = [
      {
        title: "Full Stack Developer",
        company: "Flutterwave",
        location: "Lagos, Lagos State, Nigeria",
        job_type: "full-time",
        currency: "NGN",
        description: "Develop end-to-end fintech solutions using modern web technologies.",
        requirements: ["4+ years full stack development", "React and Node.js", "Payment systems experience"],
        benefits: ["Health insurance", "Stock options", "Remote work flexibility"],
        skills_required: ["React", "Node.js", "MongoDB", "AWS"],
        experience_level: "mid-level",
        application_url: "https://flutterwave.com/careers",
        source_website: "Flutterwave Careers",
        source_url: `https://flutterwave.com/careers/fullstack-developer-${Date.now()}`,
        salary_min: 8000000,
        salary_max: 15000000,
        remote_allowed: true,
        posted_date: currentDate.toISOString(),
        expires_date: nextWeek.toISOString(),
      },
      {
        title: "Product Manager",
        company: "Paystack",
        location: "Lagos, Lagos State, Nigeria",
        job_type: "full-time",
        currency: "NGN",
        description: "Drive product strategy and roadmap for payment infrastructure solutions.",
        requirements: ["3+ years product management", "Fintech experience", "Data-driven approach"],
        benefits: ["Health insurance", "Annual bonus", "Learning stipend"],
        skills_required: ["Product Management", "Analytics", "Fintech", "Agile"],
        experience_level: "senior",
        application_url: "https://paystack.com/careers",
        source_website: "Paystack Careers",
        source_url: `https://paystack.com/careers/product-manager-${Date.now()}`,
        salary_min: 12000000,
        salary_max: 20000000,
        remote_allowed: true,
        posted_date: currentDate.toISOString(),
        expires_date: nextWeek.toISOString(),
      }
    ]

    // Combine all new jobs
    const allNewJobs = [...southAfricanJobs, ...nigerianJobs]

    // Insert new jobs
    const { data: insertedJobs, error: insertError } = await supabaseClient
      .from('jobs')
      .insert(allNewJobs)
      .select()

    if (insertError) {
      console.error('Error inserting new jobs:', insertError)
      throw insertError
    }

    console.log(`Inserted ${insertedJobs?.length || 0} new job listings`)

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount: deletedJobs?.length || 0,
        insertedCount: insertedJobs?.length || 0,
        message: `Job cleanup completed: deleted ${deletedJobs?.length || 0} old jobs, added ${insertedJobs?.length || 0} new jobs`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in job-cleanup function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})