import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useResumeData } from '@/hooks/use-resume-data';
import { useResumeAI } from '@/hooks/use-resume-ai';
import { summarizeText } from '@/utils/summarizeText';
import {
  Download,
  Undo,
  Redo,
  Move,
  PanelLeft,
  ChevronLeft,
  Share2,
  Plus,
  Settings as SettingsIcon,
  Layers,
  Save,
  ZoomIn,
  ZoomOut,
  X,
  FileText,
  List,
  Edit,
  Check,
  Eye,
  Wand2,
  Layout,
  Brain
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeLoadingSkeleton } from '@/components/resume-preview/LoadingSkeleton';
import ModernTemplate from '@/components/resume-preview/ModernTemplate';
import CustomizableTemplate from '@/components/resume-preview/CustomizableTemplate';
import ProfessionalTemplate from '@/components/resume-preview/ProfessionalTemplate';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ResumeData, Project } from '@/types/resume';
import { Badge } from "@/components/ui/badge";
import AIAssistant from '@/components/resume-builder/AIAssistant';
import AIAnalysisDrawer from '@/components/resume-builder/AIAnalysisDrawer';
import ResumeCanvasStyleTab from '@/components/resume-canvas/ResumeCanvasStyleTab';

const CANVAS_PADDING = 40;
const DEFAULT_ZOOM = 100;
const PAPER_SIZES = {
  a4: { width: '210mm', height: '297mm', ratio: 1.414 },
  letter: { width: '8.5in', height: '11in', ratio: 1.294 },
  legal: { width: '8.5in', height: '14in', ratio: 1.647 },
};

const ResumeCanvas = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string>("select");
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [isSectionEditorOpen, setIsSectionEditorOpen] = useState(false);
  const [editingField, setEditingField] = useState<{ section: string; field?: string; itemId?: string; value: string }>({ section: '', value: '' });
  const { isGenerating, improveDescription, generateSummary, extractSkills } = useResumeAI();
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);

  const {
    isLoading,
    resumeData,
    setResumeData,
    resumeTitle,
    setResumeTitle,
    selectedTemplate,
    setSelectedTemplate,
    resumeSettings,
    setResumeSettings,
    calculateProgress,
    handleSave
  } = useResumeData(resumeId);

  // Track history for undo/redo
  const addToHistory = (newData: any) => {
    setUndoStack((prev) => [...prev, JSON.stringify(resumeData)]);
    setRedoStack([]);
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoom(DEFAULT_ZOOM);
  };

  const handleDownload = async () => {
    try {
      toast.success("Preparing your resume for download...");
      // In a real implementation, we would generate and download a PDF
      window.open(`/resume/pdf/${resumeId}`, '_blank');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));
    setRedoStack([...redoStack, JSON.stringify(resumeData)]);

    // Apply the undo action
    setResumeData(JSON.parse(lastState));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));
    setUndoStack([...undoStack, JSON.stringify(resumeData)]);

    // Apply the redo action
    setResumeData(JSON.parse(nextState));
  };

  const handleBackToBuilder = () => {
    navigate(`/resume/builder/${resumeId}`);
  };

  const handleChangeTool = (tool: string) => {
    setActiveTool(tool);
  };

  const handleSaveChanges = async () => {
    await handleSave();
    toast.success("Resume saved successfully!");
  };

  const handleDataChange = (section: string, data: any) => {
    addToHistory(resumeData);
    setResumeData((prev: ResumeData) => {
      if (section === 'personal') {
        return { ...prev, personal: data };
      } else if (section === 'summary') {
        return { ...prev, summary: data };
      } else {
        // For array sections: experience, education, projects etc.
        return { ...prev, [section]: data };
      }
    });
  };

  const handleAddItem = (section: string) => {
    if (section === 'experience') {
      setResumeData((prev: ResumeData) => ({
        ...prev,
        experience: [
          ...prev.experience,
          {
            id: uuidv4(),
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: ""
          }
        ]
      }));
    } else if (section === 'education') {
      setResumeData((prev: ResumeData) => ({
        ...prev,
        education: [
          ...prev.education,
          {
            id: uuidv4(),
            degree: "",
            institution: "",
            field: "",
            location: "",
            startDate: "",
            endDate: "",
            description: ""
          }
        ]
      }));
    } else if (section === 'projects') {
      setResumeData((prev: ResumeData) => ({
        ...prev,
        projects: [
          ...prev.projects,
          {
            id: uuidv4(),
            title: "",
            description: "",
            technologies: [],
            startDate: "",
            endDate: "",
            link: ""
          } as Project
        ]
      }));
    }
    setActiveSection(section);
  };

  const handleRemoveItem = (section: string, id: string) => {
    addToHistory(resumeData);
    setResumeData((prev: ResumeData) => {
      const items = [...prev[section]];
      const updatedItems = items.filter(item => item.id !== id);
      return { ...prev, [section]: updatedItems };
    });
  };

  const handleFieldEdit = (section: string, field?: string, itemId?: string, initialValue?: string) => {
    setEditingField({
      section,
      field,
      itemId,
      value: initialValue || ''
    });
    setIsSectionEditorOpen(true);
  };

  const handleSaveField = async () => {
    const { section, field, itemId, value } = editingField;

    if (section === 'summary') {
      handleDataChange('summary', value);
    } else if (section === 'personal' && field) {
      handleDataChange('personal', {
        ...resumeData.personal,
        [field]: value
      });
    } else if (itemId && field && ['experience', 'education', 'projects'].includes(section)) {
      const items = [...resumeData[section]];
      const itemIndex = items.findIndex(item => item.id === itemId);

      if (itemIndex >= 0) {
        const updatedItem = { ...items[itemIndex], [field]: value };
        items[itemIndex] = updatedItem;
        handleDataChange(section, items);
      }
    }

    setIsSectionEditorOpen(false);
  };

  const handleGenerateWithAI = async (section: string): Promise<string> => {
    try {
      if (section.startsWith('summary')) {
        // Extract experience descriptions for better summary generation
        const experienceText = resumeData.experience
          .map(exp => exp.description)
          .join('\n\n');

        if (!experienceText || experienceText.trim() === '') {
          toast.error("Please add some experience details first to generate a better summary");
          return "";
        }

        const skills = [...resumeData.skills.technical, ...resumeData.skills.soft];

        const generatedSummary = await generateSummary(
          resumeData.experience.map(e => e.description),
          skills
        );

        if (generatedSummary) {
          handleDataChange('summary', generatedSummary);
          return generatedSummary;
        }
      } else if (section.startsWith('experience-desc') && editingField.itemId) {
        const experience = resumeData.experience.find(e => e.id === editingField.itemId);
        if (experience) {
          const currentText = editingField.value || experience.description;

          if (!currentText || currentText.trim() === '') {
            toast.error("Please add some content first to improve");
            return "";
          }

          const improved = await improveDescription(currentText);
          if (improved) {
            // Update in the editing field rather than immediately saving
            setEditingField(prev => ({ ...prev, value: improved }));
            return improved;
          }
        }
      } else if (section.startsWith('education-desc') && editingField.itemId) {
        const education = resumeData.education.find(e => e.id === editingField.itemId);
        if (education) {
          const currentText = editingField.value || education.description || '';

          if (!currentText || currentText.trim() === '') {
            toast.error("Please add some content first to improve");
            return "";
          }

          // We'll also use improveDescription for education descriptions
          const improved = await improveDescription(currentText);
          if (improved) {
            setEditingField(prev => ({ ...prev, value: improved }));
            return improved;
          }
        }
      }

      return "";
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error("Failed to generate content with AI");
      return "";
    }
  };

  useEffect(() => {
    // Auto-save changes every 30 seconds
    const saveInterval = setInterval(() => {
      if (resumeData && resumeId) {
        handleSave().catch(console.error);
      }
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [resumeData, resumeId]);

  const toggleAIAnalysis = () => {
    setIsAIAnalysisOpen(!isAIAnalysisOpen);
  };

  // Function to render the selected template
  const renderSelectedTemplate = () => {
    const templateToUse = selectedTemplate || resumeSettings.template || 'modern';

    switch (templateToUse) {
      case 'modern':
        return (
          <ModernTemplate
            data={resumeData}
            settings={resumeSettings}
            onUpdateData={handleDataChange}
            onGenerateWithAI={handleGenerateWithAI}
          />
        );
      case 'professional':
        return (
          <ProfessionalTemplate
            data={resumeData}
            settings={resumeSettings}
            onUpdateData={handleDataChange}
            onGenerateWithAI={handleGenerateWithAI}
          />
        );
      case 'customizable':
        return (
          <CustomizableTemplate
            data={resumeData}
            settings={resumeSettings}
            onUpdateData={handleDataChange}
            onGenerateWithAI={handleGenerateWithAI}
          />
        );
      default:
        return (
          <ModernTemplate
            data={resumeData}
            settings={resumeSettings}
            onUpdateData={handleDataChange}
            onGenerateWithAI={handleGenerateWithAI}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-resume-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-resume-purple dark:text-resume-purple-light text-lg">Loading your resume canvas...</p>
        </div>
      </div>
    );
  }

  const paperSize = PAPER_SIZES[resumeSettings.paperSize || 'a4'];

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm h-14">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToBuilder}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-resume-purple"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-800 dark:text-white truncate max-w-[200px]">
              {resumeTitle || "Untitled Resume"}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => {
                const newTitle = prompt("Enter a new title for your resume", resumeTitle);
                if (newTitle) setResumeTitle(newTitle);
              }}
            >
              <Edit className="h-3 w-3 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-resume-purple dark:text-resume-purple-light border-resume-purple/30">
            Canvas Editor
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleUndo} disabled={undoStack.length === 0}
                  className="text-gray-600 dark:text-gray-400 hover:text-resume-purple dark:hover:text-resume-purple-light">
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleRedo} disabled={redoStack.length === 0}
                  className="text-gray-600 dark:text-gray-400 hover:text-resume-purple dark:hover:text-resume-purple-light">
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center space-x-1 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleZoomOut}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-gray-600 dark:text-gray-300 w-10 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleZoomIn}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          <AIAnalysisDrawer
            resumeData={resumeData}
            isOpen={isAIAnalysisOpen}
            onOpenChange={setIsAIAnalysisOpen}
          />

          <Button
            variant="outline"
            className="ml-2 border-resume-purple/30 text-resume-purple dark:text-resume-purple-light hover:bg-resume-purple/10"
            onClick={handleSaveChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button
            variant="default"
            className="bg-resume-purple hover:bg-resume-purple/90 text-white"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Toggleable */}
        {showSidebar && (
          <div className="w-80 border-r border-border bg-background overflow-y-auto transition-all duration-300 ease-in-out shadow-lg backdrop-blur-sm border-r-2">
            <Tabs defaultValue="content" className="w-full h-full">
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                <TabsList className="w-full grid grid-cols-2 p-2 m-3 bg-muted rounded-lg shadow-sm">
                  <TabsTrigger
                    value="content"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200 rounded-md font-medium"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="style"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200 rounded-md font-medium"
                  >
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Style
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="content" className="p-4 space-y-6 animate-fade-in">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Resume Sections</h3>
                    <Badge variant="outline" className="text-xs">
                      {calculateProgress(resumeData)}% Complete
                    </Badge>
                  </div>
                  <div className="grid gap-2">
                    {Object.entries({
                      personal: "Personal Info",
                      summary: "Summary", 
                      experience: "Experience",
                      education: "Education",
                      skills: "Skills",
                      projects: "Projects"
                    }).map(([key, label]) => (
                      <Card 
                        key={key}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          activeSection === key 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setActiveSection(key)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{label}</span>
                            <div className="flex gap-1">
                              {key === 'summary' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-3 text-xs hover:bg-primary/10 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFieldEdit('summary', undefined, undefined, resumeData.summary);
                                  }}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              )}
                              {['experience', 'education', 'projects'].includes(key) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-3 text-xs hover:bg-primary/10 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddItem(key);
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {activeSection === 'personal' && (
                  <div className="space-y-2 pl-2 animate-fade-in">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Personal Information</h4>
                    {Object.entries(resumeData.personal).map(([field, value]) => (
                      <div
                        key={field}
                        className="flex items-center justify-between text-sm p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                      >
                        <span className="capitalize text-gray-700 dark:text-gray-300">{field}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-resume-purple dark:text-resume-purple-light"
                          onClick={() => handleFieldEdit('personal', field, undefined, value as string)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-2 pl-2 animate-fade-in">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Experience Items</h4>
                    {resumeData.experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex flex-col space-y-1 p-2 border border-gray-100 dark:border-gray-700 rounded hover:border-gray-200 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{exp.title || "New Position"}</span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-xs text-resume-purple dark:text-resume-purple-light"
                              onClick={() => handleFieldEdit('experience', 'description', exp.id, exp.description)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-xs text-red-500 dark:text-red-400"
                              onClick={() => handleRemoveItem('experience', exp.id || '')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{exp.company}, {exp.startDate} - {exp.endDate}</div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-resume-purple hover:border-resume-purple dark:hover:text-resume-purple-light dark:hover:border-resume-purple-light"
                      onClick={() => handleAddItem('experience')}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Experience
                    </Button>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-2 pl-2 animate-fade-in">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Education Items</h4>
                    {resumeData.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex flex-col space-y-1 p-2 border border-gray-100 dark:border-gray-700 rounded hover:border-gray-200 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{edu.degree || "New Degree"}</span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-xs text-resume-purple dark:text-resume-purple-light"
                              onClick={() => handleFieldEdit('education', 'description', edu.id, edu.description || '')}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-xs text-red-500 dark:text-red-400"
                              onClick={() => handleRemoveItem('education', edu.id || '')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{edu.institution}, {edu.startDate} - {edu.endDate}</div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-resume-purple hover:border-resume-purple dark:hover:text-resume-purple-light dark:hover:border-resume-purple-light"
                      onClick={() => handleAddItem('education')}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Education
                    </Button>
                  </div>
                )}

                {activeSection === 'projects' && (
                  <div className="space-y-2 pl-2 animate-fade-in">
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Items</h4>
                    {resumeData.projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex flex-col space-y-1 p-2 border border-gray-100 dark:border-gray-700 rounded hover:border-gray-200 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.title || "New Project"}</span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-xs text-resume-purple dark:text-resume-purple-light"
                              onClick={() => handleFieldEdit('projects', 'description', project.id, project.description)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-xs text-red-500 dark:text-red-400"
                              onClick={() => handleRemoveItem('projects', project.id || '')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{project.startDate} - {project.endDate}</div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-resume-purple hover:border-resume-purple dark:hover:text-resume-purple-light dark:hover:border-resume-purple-light"
                      onClick={() => handleAddItem('projects')}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Project
                    </Button>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-3 pl-2 animate-fade-in">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Technical Skills</h4>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {resumeData.skills.technical.map((skill, index) => (
                          <div key={index} className="group relative flex items-center">
                            <span className="px-2 py-1 bg-[#efeafc] dark:bg-[#352a70] rounded-sm text-xs border-[0.5px] border-[#dad3f8] dark:border-[#4b3e96] text-violet-600 dark:text-violet-300 font-medium">
                              {skill}
                            </span>
                            <button
                              className="absolute -right-1 -top-1 h-4 w-4 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newTechnical = [...resumeData.skills.technical];
                                newTechnical.splice(index, 1);
                                handleDataChange('skills', {
                                  ...resumeData.skills,
                                  technical: newTechnical
                                });
                              }}
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            const skill = prompt("Enter a new technical skill");
                            if (skill) {
                              handleDataChange('skills', {
                                ...resumeData.skills,
                                technical: [...resumeData.skills.technical, skill]
                              });
                            }
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Soft Skills</h4>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {resumeData.skills.soft.map((skill, index) => (
                          <div key={index} className="group relative flex items-center">
                            <span className="px-2 py-1 bg-[#f3f3f3] dark:bg-[#333333] rounded-sm text-xs border-[0.5px] border-[#e5e5e5] dark:border-[#444444] text-gray-700 dark:text-gray-300 font-medium">
                              {skill}
                            </span>
                            <button
                              className="absolute -right-1 -top-1 h-4 w-4 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newSoft = [...resumeData.skills.soft];
                                newSoft.splice(index, 1);
                                handleDataChange('skills', {
                                  ...resumeData.skills,
                                  soft: newSoft
                                });
                              }}
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            const skill = prompt("Enter a new soft skill");
                            if (skill) {
                              handleDataChange('skills', {
                                ...resumeData.skills,
                                soft: [...resumeData.skills.soft, skill]
                              });
                            }
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 flex items-center gap-1 border-resume-purple/30 text-resume-purple dark:text-resume-purple-light hover:bg-resume-purple/10"
                      onClick={async () => {
                        try {
                          toast.info("Analyzing your experience to extract skills...");
                          const extractedSkills = await extractSkills(
                            resumeData.experience.map(e => e.description)
                          );

                          if (extractedSkills) {
                            handleDataChange('skills', extractedSkills);
                            toast.success("Skills extracted successfully!");
                          }
                        } catch (error) {
                          console.error(error);
                          toast.error("Failed to extract skills");
                        }
                      }}
                      disabled={isGenerating}
                    >
                      <Wand2 className="h-3.5 w-3.5 mr-1" />
                      Extract from Experience
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="style" className="animate-fade-in">
                <ResumeCanvasStyleTab 
                  settings={resumeSettings}
                  onSettingsChange={(newSettings) => {
                    setResumeSettings({ ...resumeSettings, ...newSettings });
                    // Auto-save settings changes
                    handleSave();
                  }}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={(templateId) => {
                    setSelectedTemplate(templateId);
                    setResumeSettings(prev => ({ ...prev, template: templateId }));
                    // Auto-save template changes
                    handleSave();
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900/50 relative">
          <div className="absolute top-2 left-2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-2 right-2 z-10 flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === 'select' ? 'default' : 'outline'}
                    size="icon"
                    className={activeTool === 'select' ? 'bg-resume-purple' : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm'}
                    onClick={() => handleChangeTool('select')}
                  >
                    <Move className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Select Tool</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === 'layout' ? 'default' : 'outline'}
                    size="icon"
                    className={activeTool === 'layout' ? 'bg-resume-purple' : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm'}
                    onClick={() => handleChangeTool('layout')}
                  >
                    <Layout className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Layout Tool</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                    onClick={toggleAIAnalysis}
                  >
                    <Brain className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>AI Analysis</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-[95vw] h-[90vh]">
                      <div className="h-full flex flex-col">
                        <div className="flex justify-end gap-2 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="border-resume-purple/30 text-resume-purple hover:bg-resume-purple/10"
                          >
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                          </Button>
                        </div>
                         <Card className="h-full flex-grow overflow-auto p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                           {renderSelectedTemplate()}
                         </Card>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>Preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div
            className="h-full w-full overflow-auto p-8 flex justify-center"
            style={{ cursor: activeTool === 'move' ? 'move' : 'default' }}
          >
            <div
              ref={canvasRef}
              className="bg-white dark:bg-gray-800 shadow-xl  transition-transform duration-200 overflow-hidden my-4"
              style={{
                transform: `scale(${zoom / 100})`,
                width: paperSize.width,
                height: 'auto', // Changed to auto to respect content height
                minHeight: 'max-content', // Added min-height for better visibility on tablets/desktop
                maxHeight: 'max-content',
                transformOrigin: 'center top',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }}
            >
              <div className="w-full h-max  p-6">
                {isLoading ? (
                  <ResumeLoadingSkeleton />
                 ) : (
                   renderSelectedTemplate()
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section editor dialog */}
      <Dialog open={isSectionEditorOpen} onOpenChange={setIsSectionEditorOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{
              editingField.section === 'summary' ? 'Edit Summary' :
                editingField.section === 'personal' ? `Edit ${editingField.field}` :
                  editingField.section.includes('experience') ? 'Edit Experience' :
                    editingField.section.includes('education') ? 'Edit Education' :
                      'Edit Content'
            }</h2>

            <div className="flex flex-col space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Content</Label>
              <Textarea
                value={editingField.value}
                onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                className="min-h-[200px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>

            {(editingField.section === 'experience-desc' || editingField.section.includes('experience')) && (
              <Button
                variant="outline"
                onClick={async () => {
                  const improved = await handleGenerateWithAI('experience-desc');
                  if (improved) {
                    setEditingField({ ...editingField, value: improved });
                  }
                }}
                disabled={isGenerating}
                className="border-resume-purple/30 text-resume-purple dark:text-resume-purple-light hover:bg-resume-purple/10"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? 'Improving...' : 'Improve with AI'}
              </Button>
            )}

            {(editingField.section === 'education-desc' || editingField.section.includes('education')) && (
              <Button
                variant="outline"
                onClick={async () => {
                  const improved = await handleGenerateWithAI('education-desc');
                  if (improved) {
                    setEditingField({ ...editingField, value: improved });
                  }
                }}
                disabled={isGenerating}
                className="border-resume-purple/30 text-resume-purple dark:text-resume-purple-light hover:bg-resume-purple/10"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? 'Improving...' : 'Improve with AI'}
              </Button>
            )}

            {editingField.section === 'summary' && (
              <Button
                variant="outline"
                onClick={async () => {
                  const summary = await handleGenerateWithAI('summary');
                  if (summary) {
                    setEditingField({ ...editingField, value: summary });
                  }
                }}
                disabled={isGenerating}
                className="border-resume-purple/30 text-resume-purple dark:text-resume-purple-light hover:bg-resume-purple/10"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Summary with AI'}
              </Button>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsSectionEditorOpen(false)}
                className="text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveField}
                className="bg-resume-purple hover:bg-resume-purple/90 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeCanvas;
