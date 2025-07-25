import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BuilderHeader from '@/components/resume-builder/BuilderHeader';
import BuilderSidebar from '@/components/resume-builder/BuilderSidebar';
import AISuggestion from '@/components/resume-builder/AISuggestion';
import ResumePreview from '@/components/ResumePreview';
import PersonalInfoForm from '@/components/resume-builder/PersonalInfoForm';
import ExperienceForm from '@/components/resume-builder/ExperienceForm';
import EducationForm from '@/components/resume-builder/EducationForm';
import SkillsForm from '@/components/resume-builder/SkillsForm';
import SummaryForm from '@/components/resume-builder/SummaryForm';
import AIAssistant from '@/components/resume-builder/AIAssistant';
import TemplateSelector from '@/components/resume-builder/TemplateSelector';
import ResumeSettings from '@/components/resume-builder/ResumeSettings';
import { useResumeData } from '@/hooks/use-resume-data';
import { useResumeAI } from '@/hooks/use-resume-ai';
import { supabase } from '@/integrations/supabase/client';
import ProjectForm from '@/components/resume-builder/ProjectForm';
import { Paintbrush } from 'lucide-react';
// Import the types from types/resume.ts
import { Education, ResumeData } from '@/types/resume';

interface AISuggestionData {
  type: string;
  section: string;
  content: string;
}

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { isMobile } = useIsMobile();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("personal");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestionData | null>(null);

  const {
    isLoading,
    resumeData,
    setResumeData,
    resumeTitle,
    selectedTemplate,
    setSelectedTemplate,
    resumeSettings,
    setResumeSettings,
    calculateProgress,
    handleSave
  } = useResumeData(resumeId);

  const {
    isGenerating,
    generateSummary,
    extractSkills,
    improveDescription
  } = useResumeAI();

  const handleDataChange = (section: string, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSettingsChange = (newSettings: any) => {
    setResumeSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const handleAIToggle = (enabled: boolean) => {
    setAiEnabled(enabled);
  };

  const dismissAiSuggestion = () => {
    setAiSuggestion(null);
  };

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      if (aiSuggestion.section === "summary") {
        handleDataChange("summary", aiSuggestion.content);
      }
      setAiSuggestion(null);
    }
  };

  const handleGenerateWithAI = async (section: string): Promise<string> => {
    if (!aiEnabled) {
      toast({
        title: "Cadina AI is disabled",
        description: "Please enable Cadina AI to use this feature",
        variant: "destructive"
      });
      return "";
    }

    try {
      switch (section) {
        case "summary": {
          const experienceDescriptions = Array.isArray(resumeData.experience) 
            ? resumeData.experience.map(exp => exp.description)
            : [];

          const allSkills = [
            ...(Array.isArray(resumeData.skills?.technical) ? resumeData.skills.technical : []),
            ...(Array.isArray(resumeData.skills?.soft) ? resumeData.skills.soft : [])
          ];
          
          const summary = await generateSummary(experienceDescriptions, allSkills);
          if (summary) handleDataChange("summary", summary);
          return summary || "";
        }
        case "skills": {
          const experienceDescriptions = Array.isArray(resumeData.experience) 
            ? resumeData.experience.map(exp => exp.description)
            : [];
            
          const skills = await extractSkills(experienceDescriptions);
          if (skills) {
            handleDataChange("skills", skills);
          }
          return "";
        }
        case "education-desc": {
          if (Array.isArray(resumeData.education)) {
            const currentEdu = resumeData.education.find(edu => edu);

            if (currentEdu) {
              const { data, error } = await supabase.functions.invoke('enhance-resume', {
                body: {
                  type: `education-description`,
                  educationContext: {
                    degree: currentEdu.degree,
                    institution: currentEdu.institution,
                    location: currentEdu.location,
                    field: currentEdu.field || '',
                    startDate: currentEdu.startDate,
                    endDate: currentEdu.endDate,
                    status: currentEdu.endDate === 'Present' ? 'Current' : 'Graduated'
                  }
                }
              });

              if (error) throw error;
              if (data?.description) {
                // Find the current education in the array and update its description
                const updatedEducation = [...resumeData.education];
                const eduIndex = updatedEducation.findIndex(edu => edu.id === currentEdu.id);
                
                if (eduIndex !== -1) {
                  updatedEducation[eduIndex] = {
                    ...updatedEducation[eduIndex],
                    description: data.description
                  };
                  handleDataChange("education", updatedEducation);
                }
              }
            }
          }
          return "";
        }
        
        default: {
          // Handle experience-desc with specific ID
          if (section.startsWith("experience-desc:")) {
            const experienceId = section.split(":")[1];
            if (Array.isArray(resumeData.experience)) {
              const currentExp = resumeData.experience.find(exp => exp.id === experienceId);

              if (currentExp) {
                const { data, error } = await supabase.functions.invoke('enhance-resume', {
                  body: {
                    type: 'experience-description',
                    experienceContext: {
                      title: currentExp.title,
                      company: currentExp.company,
                      location: currentExp.location,
                      startDate: currentExp.startDate,
                      endDate: currentExp.endDate,
                      description: currentExp.description
                    }
                  }
                });

                if (error) throw error;
                if (data?.description) {
                  // Find the current experience in the array and update its description
                  const updatedExperience = [...resumeData.experience];
                  const expIndex = updatedExperience.findIndex(exp => exp.id === experienceId);
                  
                  if (expIndex !== -1) {
                    updatedExperience[expIndex] = {
                      ...updatedExperience[expIndex],
                      description: data.description
                    };
                    handleDataChange("experience", updatedExperience);
                    return data.description;
                  }
                }
              }
            }
            return "";
          }
          return "";
        }

        case "project-desc": {
          if (Array.isArray(resumeData.projects)) {
            const currentProject = resumeData.projects.find(project => project);

            if (currentProject) {
              const { data, error } = await supabase.functions.invoke('enhance-resume', {
                body: {
                  type: 'experience-description', // Reuse the same prompt format
                  experienceContext: {
                    title: currentProject.title,
                    company: "Project", // Reuse the field
                    location: (currentProject.technologies || []).join(", ") || "",
                    startDate: currentProject.startDate,
                    endDate: currentProject.endDate,
                    description: currentProject.description
                  }
                }
              });

              if (error) throw error;
              if (data?.description) {
                // Find the current project in the array and update its description
                const updatedProjects = [...resumeData.projects];
                const projectIndex = updatedProjects.findIndex(proj => proj.id === currentProject.id);
                
                if (projectIndex !== -1) {
                  updatedProjects[projectIndex] = {
                    ...updatedProjects[projectIndex],
                    description: data.description
                  };
                  handleDataChange("projects", updatedProjects);
                }
              }
            }
          }
          return "";
        }
      }
    } catch (error) {
      console.error('Error generating with Cadina AI:', error);
      toast({
        title: "Error",
        description: "Failed to generate with Cadina AI. Please try again.",
        variant: "destructive"
      });
      return "";
    }
  };

  const handleGenerateAI = async () => {
    try {
      await handleGenerateWithAI(activeSection);
    } catch (error) {
      console.error('Error generating with Cadina AI:', error);
    }
  };

  const renderActiveForm = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalInfoForm
            data={resumeData.personal}
            onChange={(data) => handleDataChange("personal", data)}
          />
        );
      case "summary":
        return (
          <SummaryForm
            data={resumeData.summary}
            onChange={(data) => handleDataChange("summary", data)}
            isGenerating={isGenerating}
            onGenerateWithAI={() => handleGenerateWithAI("summary")}
          />
        );
      case "experience":
        return (
          <ExperienceForm
            data={resumeData.experience}
            onChange={(data) => handleDataChange("experience", data)}
            onGenerateWithAI={async (text: string) => {
              const improved = await improveDescription(text);
              return improved || "";
            }}
          />
        );
      case "education":
        return (
          <EducationForm
            data={resumeData.education}
            onChange={(data) => handleDataChange("education", data)}
          />
        );
      case "skills":
        return (
          <SkillsForm
            data={resumeData.skills}
            onChange={(data) => handleDataChange("skills", data)}
            isGenerating={isGenerating}
            onExtractSkills={async () => {
              try {
                await handleGenerateWithAI("skills");
                return;
              } catch (error) {
                console.error('Error extracting skills:', error);
                return;
              }
            }}
          />
        );
      case "projects":
        return (
          <ProjectForm
            data={resumeData.projects || []}
            onChange={(data) => handleDataChange("projects", data)}
          />
        );
      case "templates":
        return (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        );
      case "settings":
        return (
          <ResumeSettings
            settings={resumeSettings}
            onChange={handleSettingsChange}
          />
        );
      case "ai":
        return (
          <AIAssistant
            resumeData={resumeData as any}
            enabled={aiEnabled}
          />
        );
      default:
        return (
          <div className="p-4 text-center">
            <p>Select a section to edit</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50/80 via-background to-purple-50/60 dark:from-gray-900/90 dark:via-gray-900/50 dark:to-gray-900/90">
      <BuilderHeader
        name={resumeTitle || resumeData.personal.name || "New Resume"}
        isSaving={false}
        aiEnabled={aiEnabled}
        onSave={handleSave}
        onAIToggle={handleAIToggle}
        onDownload={() => {
          if (resumeId) {
            const pdfWindow = window.open(`/resume/pdf/${resumeId}`, '_blank');
            if (pdfWindow) {
              setTimeout(() => {
                pdfWindow.focus();
                pdfWindow.print();
              }, 1500);
            }
          }
        }}
        onShare={() => { }}
      />

      <div className="flex-1 flex w-full">
        <SidebarProvider defaultOpen={!isMobile}>
          <Sidebar side="left" variant="floating" collapsible="icon">
            <BuilderSidebar
              progress={calculateProgress(resumeData)}
              activeSection={activeSection}
              aiEnabled={aiEnabled}
              aiGenerating={isGenerating}
              onSectionChange={setActiveSection}
              onGenerateWithAI={handleGenerateAI}
            />
          </Sidebar>
          
          <SidebarInset className="flex flex-col p-4 lg:p-6 w-full">
            <AISuggestion
              suggestion={aiSuggestion}
              onDismiss={dismissAiSuggestion}
              onApply={applyAiSuggestion}
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-8rem)] w-full">
              <div className="xl:col-span-5 h-full overflow-auto">
                <Card className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-100/60 dark:border-gray-800/60 overflow-hidden shadow-xl">
                  <CardContent className="p-4 lg:p-6 h-full overflow-auto">
                    <div className="max-w-2xl space-y-6">
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                          <div className="w-16 h-16 border-4 border-resume-purple border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-resume-gray text-lg">Loading resume...</p>
                        </div>
                      ) : (
                        renderActiveForm()
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="xl:col-span-7 h-full overflow-auto">
                <ResumePreview
                  data={resumeData as any}
                  template={selectedTemplate}
                  settings={resumeSettings}
                  onDataChange={(section, data) => handleDataChange(section, data)}
                  onGenerateWithAI={handleGenerateWithAI}
                />
                {resumeId && (
                  <div className="mt-4 flex justify-center">
                    <Link to={`/resume/canvas/${resumeId}`}>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Paintbrush className="h-4 w-4" />
                        Open in Canvas Editor
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default ResumeBuilder;
