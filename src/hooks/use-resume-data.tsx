import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { ResumeData, LinkedInData, ResumeSettings } from '@/types/resume';

const defaultResumeData: ResumeData = {
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

const defaultResumeSettings: ResumeSettings = {
  fontFamily: 'Inter',
  fontSize: 11,
  primaryColor: '#5d4dcd',
  secondaryColor: '#333333',
  accentColor: '#d6bcfa',
  paperSize: 'letter',
  margins: 'normal',
  template: 'modern'
};

export const useResumeData = (resumeId?: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [resumeTitle, setResumeTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeSettings, setResumeSettings] = useState<ResumeSettings>(defaultResumeSettings);

  useEffect(() => {
    const fetchResumeData = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to create or edit resumes",
            variant: "destructive",
          });
          navigate('/sign-in');
          return;
        }

        if (!resumeId) {
          toast({
            title: "Error",
            description: "Resume ID is required",
            variant: "destructive",
          });
          navigate('/resume');
          return;
        }

        const { data: resume, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', resumeId)
          .single();

        if (error) throw error;
        if (!resume) {
          toast({
            title: "Resume not found",
            description: "The requested resume could not be found",
            variant: "destructive",
          });
          navigate('/resume');
          return;
        }

        setResumeTitle(resume.title);
        
        let content: ResumeData = defaultResumeData;
        try {
          if (typeof resume.content === "string") {
            content = JSON.parse(resume.content) as ResumeData;
          } else if (typeof resume.content === "object" && resume.content !== null) {
            content = resume.content as unknown as ResumeData;
          }
        } catch (e) {
          console.error('Error parsing resume content:', e);
        }

        let settings: ResumeSettings = { ...defaultResumeSettings };
        try {
          if (typeof resume.settings === "string") {
            settings = { ...defaultResumeSettings, ...JSON.parse(resume.settings) } as ResumeSettings;
          } else if (typeof resume.settings === "object" && resume.settings !== null) {
            settings = { ...defaultResumeSettings, ...resume.settings } as unknown as ResumeSettings;
          }
        } catch (e) {
          console.error('Error parsing resume settings:', e);
        }

        setResumeData(content);
        setResumeSettings(settings);
        setSelectedTemplate(resume.template || settings.template || "modern");

        if ((!content.personal.name || !content.summary) && session.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('linkedin_data')
            .eq('id', session.user.id)
            .single();

          if (!profileError && profile?.linkedin_data) {
            let linkedinData: LinkedInData | null = null;
            
            if (typeof profile.linkedin_data === "string") {
              try {
                linkedinData = JSON.parse(profile.linkedin_data) as LinkedInData;
              } catch {
                linkedinData = null;
              }
            } else if (typeof profile.linkedin_data === "object" && profile.linkedin_data !== null) {
              linkedinData = profile.linkedin_data as LinkedInData;
            }

            if (linkedinData?.full_name) {
              setResumeData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  name: linkedinData!.full_name || prev.personal.name,
                  title: linkedinData!.headline || prev.personal.title,
                  location: linkedinData!.location || prev.personal.location,
                  linkedin: linkedinData!.linkedin_url || prev.personal.linkedin
                }
              }));
            }
          }
        }

        setIsLoading(false);
        toast({
          title: "Resume loaded",
          description: "Start building your resume. AI has pre-filled your details."
        });

      } catch (error: any) {
        console.error('Error loading resume:', error);
        toast({
          title: "Error",
          description: "Failed to load resume data. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        navigate('/resume');
      }
    };

    if (resumeId) {
      fetchResumeData();
    }
  }, [resumeId, toast, navigate]);

  const calculateProgress = (content: ResumeData) => {
    let progress = 0;
    let total = 0;
    
    if (content.personal) {
      const personalFields = Object.values(content.personal).filter(val => val !== '').length;
      progress += personalFields;
      total += Object.keys(content.personal).length;
    }
    
    if (content.summary) {
      progress += 1;
    }
    total += 1;
    
    if (content.experience && content.experience.length > 0) {
      progress += 1;
    }
    total += 1;
    
    if (content.education && content.education.length > 0) {
      progress += 1;
    }
    total += 1;
    
    if (content.skills && (content.skills.technical.length > 0 || content.skills.soft.length > 0)) {
      progress += 1;
    }
    total += 1;
    
    if (content.projects && content.projects.length > 0) {
      progress += 1;
    }
    total += 1;
    
    if (content.certifications && content.certifications.length > 0) {
      progress += 1;
    }
    total += 1;
    
    return Math.round((progress / total) * 100);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          content: resumeData as any,
          title: resumeTitle,
          template: selectedTemplate,
          settings: resumeSettings as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', resumeId);
        
      if (error) throw error;
      
      toast({
        title: "Resume saved",
        description: "Your resume has been successfully saved."
      });
    } catch (error: any) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setResumeSettings(prev => ({ ...prev, template }));
  };

  return {
    isLoading,
    resumeData,
    setResumeData,
    resumeTitle,
    setResumeTitle,
    selectedTemplate,
    setSelectedTemplate: handleTemplateChange,
    resumeSettings,
    setResumeSettings,
    calculateProgress,
    handleSave
  };
}