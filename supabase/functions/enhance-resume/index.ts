
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateSummarizationPrompt(text: string) {
  return `
You are an expert resume writer specializing in ATS optimization and human readability. Transform the following text into powerful, achievement-focused bullet points that will pass ATS scans and impress hiring managers.

REQUIREMENTS:
1. Start each bullet with a strong action verb (past tense for completed work)
2. Include quantifiable metrics whenever possible (%, $, numbers, timeframes)
3. Focus on IMPACT and RESULTS, not just duties
4. Use industry-specific keywords naturally
5. Keep each bullet to 1-2 lines maximum
6. Demonstrate problem-solving and value creation
7. Use varied sentence structures to avoid repetition

CONTENT GUIDELINES:
- Show progression and growth in responsibilities
- Highlight cross-functional collaboration when relevant
- Include technical skills and methodologies used
- Emphasize efficiency improvements and cost savings
- Mention awards, recognition, or standout achievements

Original text:
${text}

Return EXACTLY 2-3 bullet points, each starting with "• " followed by compelling content that showcases measurable achievements and professional impact. No additional text or explanations.`;
}

function generateSummaryPrompt(experience: string[], skills: string[], preserveUserContent = false) {
  return `
You are a senior executive resume writer with expertise in creating compelling professional summaries that pass ATS filters and capture hiring manager attention within 6 seconds.

Create a professional summary that:
1. Opens with the candidate's professional identity and years of experience
2. Highlights 2-3 core competencies with specific industry keywords
3. Includes quantifiable achievements that demonstrate ROI and impact
4. Showcases unique value proposition and differentiators
5. Ends with future-focused capability or career objective
6. Uses natural language that sounds authentic, not corporate jargon
7. Incorporates relevant technical skills seamlessly into context

CONTENT ANALYSIS:
Experience Background:
${experience ? experience.join('\n') : 'Not provided'}

Core Skills:
${skills ? skills.join(', ') : 'Not provided'}

${preserveUserContent ? "CRITICAL: Base content ONLY on provided experience and skills. Do not fabricate achievements, roles, or capabilities not evidenced in the source material." : ""}

FORMATTING REQUIREMENTS:
- 3-4 sentences maximum (40-60 words total)
- Format as 2-3 bullet points starting with "• "
- Each bullet focuses on a different aspect: identity/experience, achievements/skills, value proposition
- Use active voice and strong descriptive language
- Incorporate 3-5 industry-relevant keywords naturally
- Avoid buzzwords like "synergy," "leverage," "dynamic" without context

Return only the bullet-formatted professional summary.`;
}

function generateSkillsPrompt(experience: string[], preserveUserContent = false) {
  return `
You are a skills assessment expert who understands modern job requirements and ATS keyword optimization. Analyze the experience and extract relevant skills that hiring managers actively search for.

EXPERIENCE TO ANALYZE:
${experience ? experience.join('\n') : 'Not provided'}

${preserveUserContent ? "STRICT REQUIREMENT: Extract ONLY skills explicitly mentioned or clearly demonstrated in the provided experience. Do not add generic skills or abilities not evidenced in the content." : ""}

TECHNICAL SKILLS CRITERIA:
- Programming languages, frameworks, and development tools
- Software platforms, databases, and cloud technologies
- Industry-specific tools, methodologies, and certifications
- Hardware, networking, and systems knowledge
- Data analysis, design, and productivity software
- Prioritize current, in-demand technologies over outdated ones

SOFT SKILLS CRITERIA:
- Leadership abilities demonstrated through team management or project ownership
- Communication skills shown via presentations, training, or stakeholder interaction
- Problem-solving evidenced by troubleshooting, optimization, or innovation
- Collaboration illustrated through cross-functional work or team achievements
- Time management shown through deadline adherence or multi-project handling
- Analytical thinking demonstrated through data interpretation or strategic planning

Return skills as JSON format:
{
  "technical": ["specific technology/tool names - 6-10 items"],
  "soft": ["demonstrated abilities with context - 4-6 items"]
}

Focus on skills that:
- Have high market demand and searchability
- Differentiate the candidate from competitors  
- Are specific rather than generic (e.g., "React.js" not "programming")
- Combine technical proficiency with business impact
- Reflect career level and expertise depth`;
}

function generateImprovementPrompt(description: string, preserveUserContent = false) {
  return `
You are a professional resume enhancement specialist focused on transforming job descriptions into compelling achievement statements that demonstrate measurable business impact.

TRANSFORMATION STRATEGY:
1. Convert passive responsibilities into active accomplishments
2. Quantify results with specific metrics (%, $, numbers, timeframes)
3. Emphasize problem-solving and innovation over routine tasks
4. Highlight collaboration, leadership, and initiative-taking
5. Include relevant technologies and methodologies naturally
6. Show progression and increased responsibilities where applicable

ORIGINAL CONTENT:
${description || 'Not provided'}

${preserveUserContent ? "CONTENT INTEGRITY: Enhance and restructure the existing content while preserving all factual information. Do not add fictional metrics, technologies, or achievements not implied by the original description." : ""}

ENHANCEMENT GUIDELINES:
- Start each bullet with compelling action verbs (Spearheaded, Orchestrated, Engineered, Optimized)
- Use the CAR method: Context + Action + Result
- Include industry-specific keywords that recruiters search for
- Demonstrate business value and ROI when possible
- Show scope of impact (team size, budget, timeline, market reach)
- Highlight any awards, recognition, or standout achievements

FORMAT REQUIREMENTS:
- Create 2-3 powerful bullet points starting with "• "
- Each bullet should be 1-2 lines maximum
- Focus on the most impressive and relevant accomplishments
- Ensure each point differentiates the candidate from competitors
- Use varied sentence structures to maintain engagement

Return only the enhanced bullet points with no additional commentary.`;
}

function generateExperiencePrompt(context: any = {}, preserveUserContent = false) {
  return `
You are a career strategist specializing in creating high-impact experience descriptions that showcase professional growth and measurable contributions.

POSITION CONTEXT:
Job Title: ${context?.title || 'Not specified'}
Company: ${context?.company || 'Not specified'}
Location: ${context?.location || 'Not specified'}
Duration: ${context?.startDate || 'Not specified'} to ${context?.endDate || 'Present'}

EXISTING CONTENT:
${context?.description || 'No previous description provided'}

${preserveUserContent ? "CONTENT INTEGRITY: Build upon existing information without adding fictional elements. Enhance clarity and impact while maintaining factual accuracy based on the role context provided." : ""}

ACHIEVEMENT-FOCUSED FRAMEWORK:
Create bullet points that demonstrate:
- Scale of responsibility (team size, budget, project scope)
- Measurable outcomes and business impact (revenue, efficiency, growth)
- Problem-solving and innovation (challenges overcome, solutions implemented)
- Technical expertise and tool proficiency relevant to the role
- Leadership and collaboration across functions
- Process improvements and operational excellence

INDUSTRY-SPECIFIC CONSIDERATIONS:
- Include relevant technical skills and methodologies for the role type
- Use terminology and metrics common in this field
- Highlight certifications, compliance, or regulatory knowledge if applicable
- Showcase any cross-functional or client-facing responsibilities

BULLET POINT REQUIREMENTS:
- Generate 2-3 compelling bullet points starting with "• "
- Use dynamic action verbs that convey ownership and initiative
- Include specific metrics where industry-appropriate (conversion rates, uptime, cost savings)
- Incorporate 2-3 relevant keywords naturally per bullet
- Maintain professional tone while showing personality and passion
- Each bullet should be 1-2 lines with clear, concise language

Return only the formatted bullet points that position this experience as a significant career achievement.`;
}

function generateFullResumePrompt(linkedinData: any, template: string = 'modern') {
  // Ensure linkedinData is valid
  if (!linkedinData) {
    linkedinData = {};
  }
  
  return `
You are an executive resume writer creating a comprehensive, ATS-optimized resume that balances technical excellence with human appeal. This resume must pass automated screening while captivating hiring managers.

STRATEGIC APPROACH:
1. Extract and enhance key career achievements with quantifiable impact
2. Integrate technical skills naturally throughout experience descriptions
3. Create a compelling narrative of professional growth and expertise
4. Optimize for ATS scanning with relevant keywords and clean formatting
5. Maintain authentic voice while highlighting unique value proposition
6. Ensure industry-relevant terminology and current best practices

CONTENT QUALITY STANDARDS:
- Use specific metrics and achievements (percentages, dollar amounts, team sizes)
- Highlight problem-solving capabilities and innovation
- Show progression in responsibility and impact over time
- Include relevant certifications, technologies, and methodologies
- Demonstrate leadership, collaboration, and communication skills
- Focus on business outcomes and ROI rather than task lists

SOURCE DATA:
${JSON.stringify(linkedinData, null, 2)}

RESUME STRUCTURE REQUIREMENTS:
Return a comprehensive JSON resume with this exact structure:

{
  "personal": {
    "name": "Full professional name",
    "title": "Current role or target position (specific and keyword-rich)",
    "email": "Professional email address",
    "phone": "Phone number with proper formatting",
    "location": "City, State/Province format",
    "linkedin": "LinkedIn profile URL",
    "website": "Portfolio or personal website if applicable"
  },
  "summary": "3-4 bullet points (• format) highlighting professional identity, core competencies, key achievements, and unique value proposition. Each bullet should be 1-2 lines and include relevant keywords.",
  "experience": [
    {
      "id": "exp1",
      "title": "Specific job title",
      "company": "Company name",
      "location": "City, State",
      "startDate": "MM YYYY format",
      "endDate": "MM YYYY or Present",
      "description": "2-4 achievement-focused bullet points (• format) showcasing measurable impact, technical skills, and leadership. Include metrics, technologies used, and business outcomes."
    }
  ],
  "education": [
    {
      "id": "edu1",
      "institution": "University/School name",
      "degree": "Degree type and field of study",
      "location": "City, State",
      "startDate": "MM YYYY",
      "endDate": "MM YYYY",
      "description": "Relevant coursework, honors, projects, or achievements (optional)"
    }
  ],
  "skills": {
    "technical": ["6-10 current, in-demand technical skills relevant to career field"],
    "soft": ["4-6 demonstrated soft skills with professional context"]
  },
  "languages": ["Language proficiency levels if applicable"],
  "certifications": ["Current, relevant professional certifications with dates"],
  "projects": [
    {
      "id": "proj1", 
      "name": "Project name",
      "description": "Brief description highlighting technologies used and impact achieved",
      "technologies": ["relevant tech stack"],
      "url": "Project URL if available"
    }
  ]
}

Ensure all content is factually based on the provided LinkedIn data while being enhanced for maximum professional impact.`;
}

function generateEducationPrompt(type: string, context: any = {}, preserveUserContent = false) {
  const field = type.replace('education-', '');
  
  switch (field) {
    case 'degree':
      return `Generate an academic degree name based on this context:
- Institution: ${context?.institution || 'Not specified'}
- Field: ${context?.field || 'Not specified'}
- Level: ${context?.level || "Bachelor's"}

${preserveUserContent ? "IMPORTANT: If specific degree information is provided, format it professionally but do not change it substantially." : ""}

Requirements:
1. Be specific and formal
2. Use standard degree nomenclature
3. Include concentration if relevant
4. Be concise but complete

Return only the degree name.`;

    case 'institution':
      return `Suggest a prestigious educational institution name based on this context:
- Degree: ${context?.degree || 'Not specified'}
- Location: ${context?.location || 'Not specified'}
- Field: ${context?.field || 'Not specified'}

${preserveUserContent ? "IMPORTANT: If an institution name is already provided, return it with proper formatting but don't change it to a different institution." : ""}

Requirements:
1. Use the official institution name
2. Be accurate and specific
3. Include location if part of the name
4. Focus on well-known institutions

Return only the institution name.`;

    case 'description':
      return `Write a warm, personal academic description based on this educational experience:
- Degree: ${context?.degree || 'Not specified'}
- Institution: ${context?.institution || 'Not specified'}
- Field: ${context?.field || 'Not specified'}

${preserveUserContent ? "IMPORTANT: If a description is already provided, enhance its format and clarity but preserve the core information and achievements mentioned." : ""}

Create a description that:
1. Highlights key achievements in a natural way
2. Mentions relevant coursework that shows passion or interest
3. Includes honors or awards with personal context
4. Adds a touch of personality to the academic experience
5. Is specific but conversational
6. Keeps to 2-3 lines while remaining engaging
7. Shows the human behind the degree

Return only the description.`;

    case 'dates':
      return `Generate education dates based on:
- Degree Level: ${context?.degree || "Bachelor's"}
- Current Status: ${context?.status || 'Graduated'}

${preserveUserContent ? "IMPORTANT: If dates are already provided, maintain them with proper formatting." : ""}

Requirements:
1. Use MM YYYY format
2. Be realistic for the degree type
3. Consider typical duration
4. If recent, use current year

Return in format: "MM YYYY - MM YYYY"`;

    default:
      return "";
  }
}

function generateATSScanPrompt(text: string) {
  return `
You are a senior ATS consultant and recruiting technology expert with comprehensive knowledge of modern applicant tracking systems used by Fortune 500 companies, startups, and recruiting agencies.

ANALYSIS FRAMEWORK:
Conduct a detailed technical assessment of this resume's compatibility with leading ATS platforms (Workday, Greenhouse, Lever, iCIMS, BambooHR, etc.) and provide actionable insights for optimization.

RESUME CONTENT TO ANALYZE:
${text}

EVALUATION CRITERIA (Weight each appropriately):

1. KEYWORD OPTIMIZATION (25%)
   - Industry-specific terminology and job-relevant keywords
   - Technical skills and software proficiency mentions
   - Achievement-oriented language with measurable results
   - Natural keyword integration vs. keyword stuffing

2. CONTENT STRUCTURE & FORMATTING (20%)
   - Clear section headers and logical information hierarchy
   - Consistent date formatting and contact information
   - Bullet point structure and readability
   - Length appropriateness and content density

3. ACTION VERB DIVERSITY & IMPACT (20%)
   - Strong, varied action verbs demonstrating leadership
   - Past tense consistency for completed roles
   - Quantified achievements and specific outcomes
   - Professional language that conveys competence

4. QUANTIFIABLE ACHIEVEMENTS (20%)
   - Specific metrics, percentages, and dollar amounts
   - Scope indicators (team size, project duration, market reach)
   - ROI demonstrations and business impact
   - Progression and growth indicators

5. SKILLS REPRESENTATION & RELEVANCE (15%)
   - Current, in-demand technical competencies
   - Industry-standard certifications and tools
   - Soft skills demonstrated through achievements
   - Skill-experience alignment and authenticity

ANALYSIS OUTPUT:
{
  "score": <overall ATS compatibility score 0-100 based on rigorous assessment>,
  "metrics": [
    {"name": "Keyword Optimization", "score": <0-100>},
    {"name": "Content Structure & Formatting", "score": <0-100>},
    {"name": "Action Verb Diversity & Impact", "score": <0-100>},
    {"name": "Quantifiable Achievements", "score": <0-100>},
    {"name": "Skills Representation & Relevance", "score": <0-100>}
  ],
  "strengths": [<3-4 specific, actionable strengths with examples from the resume>],
  "improvements": [<3-4 specific, prioritized improvement recommendations with suggested solutions>],
  "keywords": [<8-12 high-impact keywords relevant to the candidate's field that should be strategically integrated>],
  "competitiveAdvantage": [<2-3 unique differentiators that make this candidate stand out>],
  "industryAlignment": "<assessment of how well the resume aligns with current industry standards and expectations>"
}

Provide honest, data-driven scoring with specific examples from the resume content. Focus on actionable improvements that will measurably increase ATS passage rates and recruiter engagement.`;
}

function parseGeminiResponse(response: any, type: string) {
  if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid response format from Gemini API');
  }
  
  const text = response.candidates[0].content.parts[0].text;
  
  try {
    if (type === "ats-scan") {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in ATS scan response');
    }

    if (type === "experience-description") {
      // Ensure description is returned as bullet points
      let formattedDescription = text.trim();
      
      // If there are no bullet points in the response, format as bullet points
      if (!formattedDescription.includes('•') && !formattedDescription.includes('-')) {
        const sentences = formattedDescription
          .split(/[.!?]\s+/)
          .filter(line => line.trim().length > 0)
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        formattedDescription = sentences.map(line => `• ${line}`).join('\n');
      } else {
        // If bullet points exist but need formatting
        formattedDescription = formattedDescription
          .replace(/[-*]\s+/g, '• ') // Replace markdown bullets with •
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0) // Remove empty lines
          .map(line => line.startsWith('•') ? line : `• ${line}`) // Ensure each line starts with a bullet
          .join('\n');
      }
      
      return { description: formattedDescription };
    }
    
    if (type.startsWith('education-')) {
      const field = type.replace('education-', '');
      if (field === 'dates') {
        const [startDate, endDate] = text.trim().split(' - ');
        return { startDate, endDate };
      }
      return { [field]: text.trim() };
    }
    
    if (type === "summary" || type === "improve") {
      // Format summary as bullet points
      let formattedSummary = text.trim();
      
      // If there are no bullet points in the response, format as bullet points
      if (!formattedSummary.includes('•') && !formattedSummary.includes('-')) {
        const sentences = formattedSummary
          .split(/[.!?]\s+/)
          .filter(line => line.trim().length > 0)
          .map(line => {
            // Ensure each bullet starts with an action verb
            let point = line.trim();
            if (!/^[A-Z][a-z]+ed|^[A-Z][a-z]+ing|^[A-Z][a-z]+s\b/.test(point)) {
              const actionVerbs = ['Developed', 'Implemented', 'Created', 'Led', 'Managed', 'Executed', 'Improved', 
                'Achieved', 'Increased', 'Reduced', 'Delivered', 'Designed', 'Established', 'Coordinated', 'Transformed'];
              const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
              point = `${randomVerb} ${point.charAt(0).toLowerCase() + point.slice(1)}`;
            }
            return point;
          })
          .filter(line => line.length > 0);
        
        formattedSummary = sentences.map(line => `• ${line}`).join('\n');
      } else {
        // If bullet points exist but need formatting
        formattedSummary = formattedSummary
          .replace(/[-*]\s+/g, '• ') // Replace markdown bullets with •
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0) // Remove empty lines
          .map(line => {
            if (!line.startsWith('•')) {
              return `• ${line}`;
            }
            return line;
          }) // Ensure each line starts with a bullet
          .join('\n');
      }
      
      return { [type === "summary" ? "summary" : "improved"]: formattedSummary };
    }
    
    if (type === "summarize") {
      // Convert text to bullet points if it's not already
      let summary = text.trim();
      
      // If there are no bullet points in the response, format as bullet points
      if (!summary.includes('•') && !summary.includes('-')) {
        const sentences = summary
          .split(/[.!?]\s+/)
          .filter(line => line.trim().length > 0)
          .map(line => {
            // Ensure each bullet starts with an action verb
            let point = line.trim();
            if (!/^[A-Z][a-z]+ed|^[A-Z][a-z]+ing|^[A-Z][a-z]+s\b/.test(point)) {
              const actionVerbs = ['Developed', 'Implemented', 'Created', 'Led', 'Managed', 'Executed', 'Improved', 
                'Achieved', 'Increased', 'Reduced', 'Delivered', 'Designed', 'Established', 'Coordinated', 'Transformed'];
              const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
              point = `${randomVerb} ${point.charAt(0).toLowerCase() + point.slice(1)}`;
            }
            return point;
          })
          .filter(line => line.length > 0);
        
        summary = sentences.map(line => `• ${line}`).join('\n');
      } else {
        // If bullet points exist but need formatting
        summary = summary
          .replace(/[-*]\s+/g, '• ') // Replace markdown bullets with •
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0) // Remove empty lines
          .map(line => {
            if (!line.startsWith('•')) {
              return `• ${line}`;
            }
            return line;
          }) // Ensure each line starts with a bullet
          .join('\n');
      }
      
      console.log('Formatted summary:', summary);
      return { summary };
    }
    
    if (type === "skills") {
      const skillsMatch = text.match(/\{[\s\S]*\}/);
      if (skillsMatch) {
        return JSON.parse(skillsMatch[0]);
      }
      throw new Error('No valid JSON found in skills response');
    }
    
    // For full resume enhancement
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResume = JSON.parse(jsonMatch[0]);
      
      // Ensure projects array exists
      if (!parsedResume.projects) {
        parsedResume.projects = [];
      }
      
      return { enhancedResume: parsedResume };
    }
    
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse the AI-generated data');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set. Please configure your environment variables.");
    }

    const requestData = await req.json().catch(err => {
      throw new Error(`Invalid JSON in request body: ${err.message}`);
    });
    
    const { type, text, linkedinData, resumeTemplate, experience, skills, description, educationContext, experienceContext, preserveUserContent } = requestData;
    
    if (!type) {
      throw new Error("Missing 'type' parameter in request");
    }
    
    let prompt = "";
    let requestType = type || 'full-resume';
    
    if (type === "summarize") {
      if (!text) {
        throw new Error("Missing 'text' parameter for summarization");
      }
      prompt = generateSummarizationPrompt(text);
    } else if (type === "ats-scan") {
      if (!text) {
        throw new Error("Missing 'text' parameter for ATS scanning");
      }
      prompt = generateATSScanPrompt(text);
      console.log("Generating ATS scan with Gemini API");
    } else if (requestType.startsWith('education-')) {
      prompt = generateEducationPrompt(requestType, educationContext, preserveUserContent);
    } else if (requestType === "summary") {
      if (!Array.isArray(experience) || experience.length === 0) {
        throw new Error("Insufficient experience data for summary generation");
      }
      prompt = generateSummaryPrompt(experience, skills, preserveUserContent);
    } else if (requestType === "skills") {
      if (!Array.isArray(experience) || experience.length === 0) {
        throw new Error("Insufficient experience data for skills extraction");
      }
      prompt = generateSkillsPrompt(experience, preserveUserContent);
    } else if (requestType === "improve") {
      if (!description) {
        throw new Error("Missing 'description' parameter for improvement");
      }
      prompt = generateImprovementPrompt(description, preserveUserContent);
    } else if (requestType === "experience-description") {
      prompt = generateExperiencePrompt(experienceContext, preserveUserContent);
    } else {
      // Full resume enhancement
      if (!linkedinData) {
        throw new Error("Missing 'linkedinData' parameter for resume enhancement");
      }
      prompt = generateFullResumePrompt(linkedinData, resumeTemplate || "modern");
    }

    console.log(`Generating ${requestType} with Gemini API`);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Gemini API error: ${response.status} ${errorData}`);
      throw new Error(`Gemini API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const result = parseGeminiResponse(data, requestType);
    
    console.log(`Successfully generated ${requestType}`);
    
    if (type === "summarize") {
      return new Response(JSON.stringify({ summary: result.summary }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhance-resume function:', error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
