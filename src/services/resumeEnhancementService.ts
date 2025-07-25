import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume.d";
import { fetchLinkedInProfile } from "@/services/linkedinService";

/**
 * Fetches LinkedIn data from the user profile
 * @param userId The user ID to fetch LinkedIn data for
 * @returns The LinkedIn data or null if not found
 */
export const fetchLinkedInDataFromProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('linkedin_data')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.linkedin_data;
  } catch (error) {
    console.error('Error fetching LinkedIn data from profile:', error);
    return null;
  }
};

/**
 * Enhances a resume with AI using LinkedIn data
 * @param linkedinData The LinkedIn profile data
 * @param template The resume template name
 * @returns An enhanced resume object
 */
export const enhanceResumeWithAI = async (linkedinData: any, template: string = 'modern'): Promise<ResumeData> => {
  try {
    if (!linkedinData) {
      throw new Error('LinkedIn data is required');
    }

    console.log('Enhancing resume with AI...');
    const response = await supabase.functions.invoke('enhance-resume', {
      body: { 
        linkedinData, 
        resumeTemplate: template,
        type: 'full-resume',
        promptStyle: 'concise'
      }
    });

    if (response.error) {
      console.error('Edge function error:', response.error);
      throw new Error(`Function error: ${response.error}`);
    }

    if (!response.data?.enhancedResume) {
      console.error('Missing enhancedResume in response:', response.data);
      throw new Error('Invalid response from AI enhancement');
    }

    // Create a default structure to ensure all properties exist
    const defaultResume: ResumeData = {
      personal: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: ""
      },
      summary: "",
      experience: [],
      education: [],
      skills: {
        technical: [],
        soft: []
      },
      languages: [],
      certifications: [],
      projects: []
    };
    
    // Merge the response with defaults to ensure all properties exist
    const enhancedResume = {
      ...defaultResume,
      ...response.data.enhancedResume
    };
    
    // Type safety checks for nested objects and arrays
    enhancedResume.personal = {
      ...defaultResume.personal,
      ...enhancedResume.personal
    };
    
    enhancedResume.experience = Array.isArray(enhancedResume.experience) 
      ? enhancedResume.experience 
      : [];
    
    enhancedResume.education = Array.isArray(enhancedResume.education) 
      ? enhancedResume.education 
      : [];
    
    enhancedResume.projects = Array.isArray(enhancedResume.projects) 
      ? enhancedResume.projects 
      : [];
    
    enhancedResume.skills = {
      technical: Array.isArray(enhancedResume.skills?.technical) 
        ? enhancedResume.skills.technical 
        : [],
      soft: Array.isArray(enhancedResume.skills?.soft) 
        ? enhancedResume.skills.soft 
        : []
    };
    
    enhancedResume.languages = Array.isArray(enhancedResume.languages) 
      ? enhancedResume.languages 
      : [];
    
    enhancedResume.certifications = Array.isArray(enhancedResume.certifications) 
      ? enhancedResume.certifications 
      : [];

    return enhancedResume;
  } catch (error) {
    console.error('Error enhancing resume with AI:', error);
    throw error;
  }
};

/**
 * Creates an enhanced resume from work experience description
 * @param workExperience The work experience description
 * @param resumeTitle The title of the resume
 * @returns The created resume
 */
export const createEnhancedResumeFromExperience = async (workExperience: string, resumeTitle?: string) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required to create a resume');
    
    const userId = user.id;
    
    // Transform work experience into LinkedIn-like structure for the AI
    const mockLinkedInData = {
      basicInfo: {
        name: "User",
        title: "Professional",
        description: workExperience
      },
      experience: [{
        title: "Professional Experience",
        company: "Various Companies",
        description: workExperience,
        duration: "Recent"
      }]
    };

    // Transform and enhance the data
    const enhancedResume = await enhanceResumeWithAI(mockLinkedInData);
    
    // Create the resume in the database with the enhanced content
    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        title: resumeTitle || 'My Professional Resume',
        content: JSON.stringify(enhancedResume),
        template: 'modern',
        user_id: userId,
        settings: {
          fontFamily: "Inter",
          fontSize: 10,
          primaryColor: "#9b87f5",
          secondaryColor: "#6E59A5",
          accentColor: "#D6BCFA",
          paperSize: "a4",
          margins: "normal"
        }
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return resume;
  } catch (error) {
    console.error('Error creating enhanced resume from experience:', error);
    throw error;
  }
};

/**
 * Creates an enhanced resume in the database
 * @param linkedinUrl The LinkedIn URL to fetch data from
 * @param resumeTitle The title of the resume
 * @returns The created resume
 */
export const createEnhancedResume = async (linkedinUrl: string, resumeTitle?: string) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required to create a resume');
    
    const userId = user.id;
    
    // First fetch LinkedIn data
    const linkedinData = await fetchLinkedInProfile(linkedinUrl);
    if (!linkedinData) {
      throw new Error('Failed to fetch LinkedIn data');
    }

    // Transform and enhance the data
    const enhancedResume = await enhanceResumeWithAI(linkedinData);
    
    // Create the resume in the database with the enhanced content
    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        title: resumeTitle || 'My Professional Resume',
        content: JSON.stringify(enhancedResume),
        template: 'modern',
        user_id: userId,
        settings: {
          fontFamily: "Inter",
          fontSize: 10,
          primaryColor: "#9b87f5",
          secondaryColor: "#6E59A5",
          accentColor: "#D6BCFA",
          paperSize: "a4",
          margins: "normal"
        }
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return resume;
  } catch (error) {
    console.error('Error creating enhanced resume:', error);
    throw error;
  }
};
