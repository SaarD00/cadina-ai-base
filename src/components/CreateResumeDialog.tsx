
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEnhancedResume, createEnhancedResumeFromExperience } from '@/services/resumeEnhancementService';
import { toast } from 'sonner';
import { 
  FileText, 
  Linkedin, 
  Loader, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  PenTool
} from 'lucide-react';

export interface CreateResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResumeCreated?: () => Promise<void>;
}

interface CreationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  icon: React.ReactNode;
}

export default function CreateResumeDialog({
  open,
  onOpenChange,
  onResumeCreated
}: CreateResumeDialogProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [useWorkExperience, setUseWorkExperience] = useState(false);

  const creationSteps: CreationStep[] = [
    {
      id: 'validate',
      title: 'Validating LinkedIn Profile',
      description: 'Checking profile accessibility and data quality',
      status: 'pending',
      icon: <User className="h-4 w-4" />
    },
    {
      id: 'fetch',
      title: 'Extracting Profile Data',
      description: 'Gathering your professional information',
      status: 'pending',
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      id: 'enhance',
      title: 'AI Enhancement',
      description: 'Optimizing content with artificial intelligence',
      status: 'pending',
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      id: 'generate',
      title: 'Generating Resume',
      description: 'Creating your professional resume',
      status: 'pending',
      icon: <FileText className="h-4 w-4" />
    }
  ];

  const [steps, setSteps] = useState(creationSteps);

  // Load onboarding data if available
  useEffect(() => {
    if (open) {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        try {
          const userData = JSON.parse(onboardingData);
          if (userData.workExperience) {
            setWorkExperience(userData.workExperience);
            setUseWorkExperience(true);
          }
          if (userData.linkedinUrl) {
            setLinkedinUrl(userData.linkedinUrl);
          }
          if (userData.profession) {
            setResumeName(`${userData.profession} Resume`);
          }
          // Clear onboarding data after use
          localStorage.removeItem('onboardingData');
        } catch (error) {
          console.error('Error parsing onboarding data:', error);
        }
      }
    }
  }, [open]);

  const resetForm = () => {
    setLinkedinUrl('');
    setResumeName('');
    setWorkExperience('');
    setUseWorkExperience(false);
    setError(null);
    setCurrentStep(0);
    setSteps(creationSteps);
  };

  const handleOpenChange = (newOpenState: boolean) => {
    if (!newOpenState && !isCreating) {
      resetForm();
    }
    onOpenChange(newOpenState);
  };

  const updateStepStatus = (stepIndex: number, status: CreationStep['status']) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?(\?.*)?$/;
    return linkedinRegex.test(url);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate based on which method the user is using
    if (useWorkExperience) {
      if (!workExperience.trim()) {
        setError('Please describe your work experience');
        return;
      }
    } else {
      if (!linkedinUrl.trim()) {
        setError('Please enter your LinkedIn profile URL');
        return;
      }
      if (!validateLinkedInUrl(linkedinUrl)) {
        setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)');
        return;
      }
    }

    setError(null);
    setIsCreating(true);
    setCurrentStep(0);

    try {
      // Step 1: Validate
      updateStepStatus(0, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus(0, 'completed');
      setCurrentStep(1);

      // Step 2: Process data
      updateStepStatus(1, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStepStatus(1, 'completed');
      setCurrentStep(2);

      // Step 3: AI Enhancement
      updateStepStatus(2, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(2, 'completed');
      setCurrentStep(3);

      // Step 4: Generate Resume
      updateStepStatus(3, 'processing');
      
      // Use appropriate service based on input method
      if (useWorkExperience) {
        await createEnhancedResumeFromExperience(workExperience, resumeName || 'My Professional Resume');
      } else {
        await createEnhancedResume(linkedinUrl, resumeName || 'My Professional Resume');
      }
      
      updateStepStatus(3, 'completed');
      
      toast.success('🎉 Resume created successfully!', {
        description: 'Your AI-enhanced resume is ready for customization'
      });
      
      if (onResumeCreated) {
        await onResumeCreated();
      }
      
      setTimeout(() => {
        handleOpenChange(false);
      }, 1000);

    } catch (error: any) {
      console.error('Error creating resume:', error);
      const currentStepIndex = steps.findIndex(step => step.status === 'processing');
      if (currentStepIndex !== -1) {
        updateStepStatus(currentStepIndex, 'error');
      }
      
      setError(error.message || 'Failed to create resume. Please try again.');
      toast.error('Failed to create resume', {
        description: error.message || 'Please check your input and try again'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStepIcon = (step: CreationStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return step.icon;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-background border-none shadow-2xl">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 border-b border-border/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <DialogHeader className="relative">
            <DialogTitle className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              Create AI-Enhanced Resume
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base mt-3 leading-relaxed">
              Transform your LinkedIn profile into a professional, ATS-optimized resume using advanced AI technology
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          {!isCreating ? (
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-6">
                {/* Resume Name Input */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                      <FileText className="h-3 w-3 text-primary" />
                    </div>
                    Resume Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Senior Software Engineer Resume"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    className="h-12 bg-background border-border focus:border-primary transition-all duration-200 text-base"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Give your resume a descriptive name for easy identification
                  </p>
                </div>

                {/* Tabs for Input Method */}
                <Tabs value={useWorkExperience ? "experience" : "linkedin"} onValueChange={(value) => setUseWorkExperience(value === "experience")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/20">
                    <TabsTrigger value="linkedin" className="flex items-center gap-2 data-[state=active]:bg-background">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn URL
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex items-center gap-2 data-[state=active]:bg-background">
                      <PenTool className="h-4 w-4" />
                      Describe Experience
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="linkedin" className="space-y-3 mt-6">
                    <Label htmlFor="linkedin" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Linkedin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      LinkedIn Profile URL
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/yourname"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="h-12 bg-background border-border focus:border-primary transition-all duration-200 text-base"
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Ensure your LinkedIn profile is public or accessible for the best results
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="space-y-3 mt-6">
                    <Label htmlFor="experience" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <PenTool className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      Work Experience Description
                    </Label>
                    <Textarea
                      id="experience"
                      placeholder="Describe your professional experience, key achievements, skills, and notable projects. Include specific examples of your work, technologies you've used, and impact you've made..."
                      value={workExperience}
                      onChange={(e) => setWorkExperience(e.target.value)}
                      className="min-h-[120px] bg-background border-border focus:border-primary transition-all duration-200 text-base resize-none"
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Provide a detailed description of your professional background. Our AI will use this to create compelling resume content.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3 animate-slide-up">
                  <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <AlertCircle className="h-3 w-3 text-destructive" />
                  </div>
                  <div className="text-destructive text-sm leading-relaxed">{error}</div>
                </div>
              )}

              {/* Feature Preview Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="p-6">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    What happens next?
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground leading-relaxed">Extract professional experience and skills</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground leading-relaxed">Enhance descriptions with AI impact</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground leading-relaxed">Generate ATS-friendly formatting</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground leading-relaxed">Create multiple template options</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* CTA Button */}
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/25 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md bg-primary-foreground/20 flex items-center justify-center">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    Create AI Resume
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </DialogFooter>
            </form>
          ) : (
            /* Processing State */
            <div className="py-12">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  Creating Your Resume
                </h3>
                <p className="text-muted-foreground text-base">
                  Please wait while we process your LinkedIn profile with AI
                </p>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-500 ${
                      step.status === 'completed' 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30' 
                        : step.status === 'processing'
                        ? 'bg-primary/5 border-primary/20 shadow-sm'
                        : step.status === 'error'
                        ? 'bg-destructive/5 border-destructive/20'
                        : 'bg-muted/30 border-border'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        step.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : step.status === 'processing'
                          ? 'bg-primary/10'
                          : step.status === 'error'
                          ? 'bg-destructive/10'
                          : 'bg-muted'
                      }`}>
                        {getStepIcon(step)}
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-foreground text-base mb-1">{step.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{step.description}</div>
                    </div>
                    {step.status === 'completed' && (
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                        Done
                      </Badge>
                    )}
                    {step.status === 'processing' && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        Processing
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
