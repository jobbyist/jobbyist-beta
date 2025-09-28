import OpenAI from 'openai';

// Initialize OpenAI client - will be undefined if API key is not provided
const openai = import.meta.env.VITE_OPENAI_API_KEY ? new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, consider using a backend proxy
}) : null;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const JOBBYIST_SYSTEM_PROMPT = `You are a helpful AI assistant for Jobbyist, Africa's premier job discovery and career management platform. You specialize in:

1. **Jobbyist Platform Features:**
   - Job search and filtering capabilities
   - Jobbyist Pro premium services (R99/month with exclusive jobs, priority applications, career coaching)
   - Free resume/CV audit tools
   - Company directory and verified employers
   - Audio content "The Job Post" podcast

2. **Geographic Focus:**
   - Primary markets: South Africa and Nigeria
   - Major cities: Johannesburg, Cape Town, Lagos, Pretoria, Durban, Abuja
   - Local job market insights and opportunities

3. **Career Guidance for:**
   - **Job Seekers:** Resume optimization, interview prep, job search strategies
   - **Working Professionals:** Career advancement, skill development, salary negotiation
   - **Employers & Recruiters:** Talent acquisition, job posting best practices, candidate evaluation

4. **Industry Expertise:**
   - Technology, Finance, Healthcare, Marketing, Engineering
   - Remote work opportunities and trends
   - Skills in demand across African markets

Always provide practical, actionable advice tailored to the African job market. Be encouraging and professional while highlighting relevant Jobbyist features that can help users achieve their career goals.

Keep responses concise but comprehensive, and suggest specific Jobbyist features when relevant (e.g., "Consider upgrading to Jobbyist Pro for exclusive job access" or "Try our free resume audit tool").`;

export class OpenAIService {
  private static instance: OpenAIService;
  
  private constructor() {}
  
  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }
  
  isConfigured(): boolean {
    return !!openai;
  }
  
  async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }
    
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: JOBBYIST_SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      });
      
      return completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response. Please try again later.');
    }
  }
}

export const aiService = OpenAIService.getInstance();