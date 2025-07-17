
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateSummarizationPrompt(text: string) {
  return `
You are an elite ATS optimization specialist and senior executive resume writer. Transform this content into high-scoring, ATS-passable bullet points that rank in the top 10% of applicant tracking systems while compelling hiring managers to interview.

ATS OPTIMIZATION REQUIREMENTS:
1. Lead with power verbs from this high-impact list: "Spearheaded," "Orchestrated," "Revolutionized," "Streamlined," "Architected," "Championed," "Accelerated," "Optimized," "Generated," "Transformed," "Executed," "Delivered"
2. Include precise quantifiable metrics: percentages (increased by X%), dollar amounts ($X revenue/savings), timeframes (within X months), scale (X team members, X projects)
3. Embed 2-3 industry-relevant keywords per bullet from job descriptions and skill requirements
4. Use ATS-friendly formatting with consistent bullet points (•) and standard punctuation
5. Target 25-35 words per bullet for optimal ATS parsing and human readability
6. Include technical competencies and methodologies naturally within achievement context

CONTENT ENHANCEMENT STRATEGY:
- Convert responsibilities into quantified business outcomes and ROI demonstrations
- Showcase leadership through team size, cross-functional collaboration, and stakeholder management
- Highlight process improvements with efficiency metrics and cost-reduction percentages
- Demonstrate problem-solving with specific challenges overcome and solutions implemented
- Include relevant certifications, technologies, and industry-standard tools
- Show career progression and increased scope of responsibility

ATS KEYWORD INTEGRATION:
- Naturally incorporate job-relevant technical skills and software proficiency
- Include industry-specific terminology and professional competencies
- Embed action-oriented language that matches common job posting requirements
- Use skill synonyms to capture various ATS keyword variations

Original text:
${text}

Return EXACTLY 2-3 bullet points starting with "• " that achieve 85+ ATS compatibility scores while demonstrating exceptional professional impact. Focus on measurable achievements that differentiate this candidate in competitive markets.`;
}

function generateSummaryPrompt(experience: string[], skills: string[], preserveUserContent = false) {
  return `
You are a Fortune 500 executive resume strategist specializing in ATS-optimized professional summaries that achieve 90+ compatibility scores and capture C-suite hiring manager attention in 4 seconds.

Create an ATS-dominant professional summary that:
1. Opens with precise professional identity + quantified years of experience + industry focus
2. Integrates 4-6 high-demand technical skills and core competencies with ATS keyword density
3. Features 2-3 quantifiable achievements with specific metrics (%, $, scope) that demonstrate business impact
4. Positions unique value proposition using industry-standard terminology and role-specific language
5. Incorporates future-ready capabilities and emerging technology proficiencies
6. Uses power language that conveys executive presence and strategic thinking
7. Seamlessly weaves technical expertise into business outcome context

ATS OPTIMIZATION STRATEGY:
- Target 50-70 words across 3 bullet points for optimal parsing and human engagement
- Include exact job title variations and industry keywords from target role descriptions
- Use metric-rich language with concrete numbers, percentages, and scale indicators
- Incorporate both hard skills (technical proficiencies) and soft skills (leadership capabilities)
- Employ ATS-friendly formatting with consistent bullet structure and professional punctuation

CONTENT ANALYSIS:
Experience Background:
${experience ? experience.join('\n') : 'Not provided'}

Core Skills:
${skills ? skills.join(', ') : 'Not provided'}

${preserveUserContent ? "CRITICAL: Base content ONLY on provided experience and skills. Do not fabricate achievements, roles, or capabilities not evidenced in the source material." : ""}

KEYWORD INTEGRATION REQUIREMENTS:
- Embed 6-8 industry-relevant keywords naturally across all bullets
- Include technical competencies that match current job market demands
- Use synonyms and variations to capture different ATS search algorithms
- Incorporate leadership terminology and business impact language
- Feature role-specific methodologies and frameworks

FORMATTING STANDARDS:
- Format as 3 compelling bullet points starting with "• "
- Bullet 1: Professional identity + experience years + industry specialization + key technical skills
- Bullet 2: Quantified achievements + business impact + stakeholder management + technical expertise
- Bullet 3: Unique value proposition + future capabilities + strategic vision + competitive differentiators
- Use active voice with varied sentence structures for dynamic flow
- Maintain professional tone while showcasing personality and executive presence

Return only the ATS-optimized bullet-formatted professional summary that positions this candidate as a top-tier hire.`;
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
You are an elite ATS optimization consultant and senior resume strategist who transforms basic job descriptions into high-scoring, interview-winning achievement statements that rank in the top 5% of ATS systems.

ATS-OPTIMIZED TRANSFORMATION STRATEGY:
1. Convert passive responsibilities into quantified business accomplishments with measurable ROI
2. Integrate high-demand technical keywords and industry-specific terminology for maximum ATS visibility
3. Embed precise metrics: percentages, dollar amounts, team sizes, timeframes, and performance indicators
4. Showcase strategic thinking and innovation through problem-solving narratives and process improvements
5. Demonstrate cross-functional leadership and stakeholder management capabilities
6. Position technical expertise within business impact context for comprehensive skill representation
7. Include emerging technologies and methodologies relevant to current market demands

ORIGINAL CONTENT:
${description || 'Not provided'}

${preserveUserContent ? "CONTENT INTEGRITY: Enhance and restructure the existing content while preserving all factual information. Do not add fictional metrics, technologies, or achievements not implied by the original description." : ""}

ATS ENHANCEMENT FRAMEWORK:
- Lead with power verbs from high-impact lexicon: "Architected," "Revolutionized," "Accelerated," "Streamlined," "Championed," "Orchestrated," "Optimized," "Generated," "Delivered," "Transformed"
- Apply CAR methodology: Context (situation/challenge) + Action (strategic approach) + Result (quantified outcome)
- Embed 3-4 industry-relevant keywords per bullet from current job market requirements
- Demonstrate exponential business value through ROI, efficiency gains, and competitive advantages
- Showcase scope with specific indicators: budget size, team composition, project complexity, market reach
- Highlight recognition, certifications, and standout achievements that differentiate from competitors

KEYWORD INTEGRATION PRIORITIES:
- Technical proficiencies and software competencies relevant to the role
- Industry-standard methodologies, frameworks, and best practices
- Leadership capabilities and team management terminology
- Project management and strategic planning language
- Performance metrics and business outcome descriptors
- Compliance, quality assurance, and operational excellence indicators

FORMAT REQUIREMENTS:
- Create 2-3 ATS-optimized bullet points starting with "• "
- Target 25-35 words per bullet for optimal ATS parsing and human readability
- Focus on achievements that position candidate in top talent tier
- Use metric-dense language with specific, verifiable outcomes
- Employ varied sentence structures while maintaining professional consistency
- Ensure each bullet demonstrates unique value and competitive differentiation

Return only the enhanced bullet points optimized for 90+ ATS compatibility scores and executive-level impact.`;
}

function generateExperiencePrompt(context: any = {}, preserveUserContent = false) {
  return `
You are an executive career strategist and ATS optimization expert creating high-impact experience descriptions that achieve 95+ ATS compatibility scores while showcasing exceptional professional growth and quantified business contributions.

POSITION CONTEXT:
Job Title: ${context?.title || 'Not specified'}
Company: ${context?.company || 'Not specified'}
Location: ${context?.location || 'Not specified'}
Duration: ${context?.startDate || 'Not specified'} to ${context?.endDate || 'Present'}

EXISTING CONTENT:
${context?.description || 'No previous description provided'}

${preserveUserContent ? "CONTENT INTEGRITY: Build upon existing information without adding fictional elements. Enhance clarity and impact while maintaining factual accuracy based on the role context provided." : ""}

ATS-OPTIMIZED ACHIEVEMENT FRAMEWORK:
Create bullet points that strategically demonstrate:
- Executive-level scope: team leadership (X direct reports), budget management ($X), project complexity (X initiatives)
- Quantified business impact: revenue generation ($X increase), cost optimization (X% reduction), efficiency gains (X% improvement)
- Strategic problem-solving: market challenges addressed, innovative solutions deployed, competitive advantages created
- Technical leadership: cutting-edge technologies implemented, digital transformation initiatives, system modernization projects
- Cross-functional collaboration: stakeholder alignment, C-suite presentations, client relationship management
- Operational excellence: process reengineering, quality improvements, compliance achievements, risk mitigation

INDUSTRY-SPECIFIC ATS OPTIMIZATION:
- Integrate high-demand technical competencies and emerging technology keywords for the role type
- Use current industry terminology, frameworks, and methodologies that recruiters actively search
- Embed certification names, compliance standards, and regulatory expertise naturally within achievement context
- Showcase measurable outcomes using industry-standard metrics and KPIs
- Include client-facing and vendor management responsibilities with quantified relationship scope

KEYWORD INTEGRATION STRATEGY:
- Embed 4-5 role-relevant technical skills and software proficiencies per bullet
- Include leadership terminology and strategic planning language
- Incorporate project management methodologies and business analysis frameworks
- Feature performance indicators and financial metrics specific to the industry
- Use action-oriented language that matches executive job posting requirements

BULLET POINT EXCELLENCE STANDARDS:
- Generate 3-4 compelling bullet points starting with "• "
- Lead with executive-caliber action verbs: "Architected," "Spearheaded," "Orchestrated," "Revolutionized," "Accelerated," "Championed," "Optimized," "Delivered"
- Target 30-40 words per bullet for comprehensive impact while maintaining ATS readability
- Include precise metrics: percentages, dollar amounts, team sizes, timeframes, market reach, performance improvements
- Incorporate 3-4 industry-relevant keywords naturally per bullet without keyword stuffing
- Demonstrate progression and increased responsibility compared to previous roles
- Each bullet should differentiate the candidate as a top-tier performer in their field

COMPETITIVE DIFFERENTIATION FOCUS:
- Highlight unique achievements and innovations that set candidate apart from competitors
- Showcase thought leadership, industry recognition, and exceptional performance ratings
- Include transformational initiatives and strategic contributions beyond standard role expectations
- Demonstrate business acumen and strategic thinking capabilities

Return only the ATS-optimized formatted bullet points that position this experience as extraordinary career achievement worthy of executive consideration.`;
}

function generateFullResumePrompt(linkedinData: any, template: string = 'modern') {
  // Ensure linkedinData is valid
  if (!linkedinData) {
    linkedinData = {};
  }
  
  return `
You are a Fortune 500 executive resume architect and ATS optimization authority creating a comprehensive, top-tier resume that achieves 95+ ATS compatibility scores while commanding C-suite hiring manager attention and interview invitations.

STRATEGIC ATS DOMINANCE APPROACH:
1. Engineer quantified career achievements with exponential business impact metrics and ROI demonstrations
2. Seamlessly integrate high-demand technical competencies throughout all experience descriptions using natural keyword density
3. Craft a compelling executive narrative showcasing strategic leadership, innovation, and measurable value creation
4. Optimize for all major ATS platforms (Workday, Greenhouse, Lever, iCIMS, BambooHR) with proven parsing techniques
5. Maintain authentic executive voice while positioning candidate as industry thought leader and top talent
6. Ensure cutting-edge industry terminology and emerging technology proficiencies for market relevance

ATS-OPTIMIZED CONTENT EXCELLENCE STANDARDS:
- Feature precise quantifiable metrics: revenue impact ($X generated), cost optimization (X% reduction), team scale (X direct/indirect reports), project scope (X initiatives), market expansion (X% growth)
- Showcase strategic problem-solving through complex challenge resolution, competitive advantage creation, and market disruption achievements
- Demonstrate career progression with increased scope, responsibility, and business impact across all professional experiences
- Include current, high-demand certifications, technologies, methodologies, and frameworks that recruiters actively search
- Highlight executive-level collaboration: board presentations, C-suite alignment, stakeholder management, investor relations
- Focus on transformational business outcomes and exponential ROI rather than operational task completion

KEYWORD INTEGRATION MASTERY:
- Embed 15-20 role-relevant technical skills and emerging technology competencies throughout all sections
- Incorporate industry-specific terminology, frameworks, and best practices that match current job market demands
- Feature leadership vocabulary and strategic planning language that resonates with executive search professionals
- Include compliance, regulatory, and governance expertise naturally within achievement context
- Use skill synonyms and variations to maximize ATS algorithm capture across different search queries

SOURCE DATA:
${JSON.stringify(linkedinData, null, 2)}

EXECUTIVE RESUME ARCHITECTURE REQUIREMENTS:
Return a comprehensive, ATS-optimized JSON resume with this exact structure:

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
