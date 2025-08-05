
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { 
  UserRound, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Code, 
  LayoutPanelLeft, 
  Settings, 
  Wand2,
  Loader,
  FolderKanban,
  Award
} from 'lucide-react';

interface BuilderSidebarProps {
  progress: number;
  activeSection: string;
  aiEnabled: boolean;
  aiGenerating: boolean;
  onSectionChange: (section: string) => void;
  onGenerateWithAI?: () => void;
}

const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  progress,
  activeSection,
  aiEnabled,
  aiGenerating,
  onSectionChange,
  onGenerateWithAI
}) => {
  return (
    <>
      <SidebarHeader className="px-5 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#7c3bed] font-display">
            Vireia AI Builder
          </h3>
          <SidebarTrigger />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500">Completion</span>
            <span className="text-xs font-medium text-gray-500">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-gray-100" 
            indicatorClassName="bg-[#7c3bed]"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-500 font-medium px-5">
            Resume Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "personal"}
                  onClick={() => onSectionChange("personal")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "personal" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "personal" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <UserRound className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "personal" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Personal Info</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "summary"}
                  onClick={() => onSectionChange("summary")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "summary" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "summary" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <FileText className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "summary" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Summary</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "experience"}
                  onClick={() => onSectionChange("experience")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "experience" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "experience" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <Briefcase className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "experience" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Experience</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "education"}
                  onClick={() => onSectionChange("education")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "education" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "education" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <GraduationCap className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "education" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Education</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "skills"}
                  onClick={() => onSectionChange("skills")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "skills" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "skills" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <Code className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "skills" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Skills</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "projects"}
                  onClick={() => onSectionChange("projects")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "projects" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "projects" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <FolderKanban className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "projects" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "certifications"}
                  onClick={() => onSectionChange("certifications")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "certifications" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "certifications" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <Award className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "certifications" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Certifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="my-4" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-500 font-medium px-5">
            Customization
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "templates"}
                  onClick={() => onSectionChange("templates")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "templates" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "templates" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <LayoutPanelLeft className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "templates" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "settings"}
                  onClick={() => onSectionChange("settings")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "settings" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "settings" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <Settings className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === "settings" ? "text-[#7c3bed]" : "text-gray-500"
                  )} />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "ai"}
                  onClick={() => onSectionChange("ai")}
                  className={cn(
                    "transition-all duration-200 flex items-center gap-3 px-5 py-2.5 rounded-lg",
                    activeSection === "ai" 
                      ? "text-[#7c3bed] font-medium" 
                      : "hover:bg-gray-50"
                  )}
                  style={activeSection === "ai" ? { backgroundColor: '#f4f1f8' } : {}}
                >
                  <div className="relative">
                    <Wand2 className={cn(
                      "h-4 w-4 transition-colors",
                      activeSection === "ai" ? "text-[#7c3bed]" : "text-gray-500"
                    )} />
                    {aiEnabled && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#7c3bed' }} />
                    )}
                  </div>
                  <span>AI Assistant</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "w-full justify-center gap-2 border border-transparent",
            "text-[#7c3bed] font-medium",
            "transition-all duration-300 shadow-sm",
            aiGenerating && "animate-pulse"
          )}
          style={{ backgroundColor: '#f4f1f8' }}
          onClick={onGenerateWithAI}
          disabled={aiGenerating || !aiEnabled}
        >
          {aiGenerating ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              <span>Generate with AI</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </>
  );
};

export default BuilderSidebar;
