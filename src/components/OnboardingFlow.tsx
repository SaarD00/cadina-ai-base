
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Briefcase, Zap, ArrowRight, Check, Sparkles, Brain, Target, Wand2, Eye, Download, Heart, Globe, Linkedin, PenTool, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingFlowProps {
  onComplete: (userData?: OnboardingData) => void;
}

interface OnboardingData {
  profession: string;
  workExperience: string;
  linkedinUrl?: string;
  careerGoals: string;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [animation, setAnimation] = useState('animate-scale-up');
  
  // User data state
  const [userData, setUserData] = useState<OnboardingData>({
    profession: '',
    workExperience: '',
    linkedinUrl: '',
    careerGoals: ''
  });

  const steps = [
    {
      title: "Welcome to Vireia AI! 🎉",
      subtitle: "Your AI-Powered Career Companion",
      icon: Heart,
      type: "welcome",
      description: "We're thrilled to have you here! Vireia AI is designed to empower your career journey with intelligent resume building and optimization.",
      features: [
        { icon: Brain, text: "Smart AI content generation" },
        { icon: Target, text: "ATS optimization guaranteed" },
        { icon: Sparkles, text: "Professional polish in minutes" }
      ],
      gradient: "from-primary via-primary/80 to-accent"
    },
    {
      title: "Tell us about yourself",
      subtitle: "Help us understand your professional background",
      icon: User,
      type: "profession",
      description: "What's your current profession or what role are you aspiring to achieve? This helps us tailor the perfect resume for you.",
      gradient: "from-blue-500 via-primary to-primary/80"
    },
    {
      title: "Your career aspirations",
      subtitle: "Where do you see yourself going?",
      icon: Rocket,
      type: "goals",
      description: "Understanding your career goals helps our AI craft targeted content that aligns with your professional ambitions.",
      gradient: "from-green-500 via-teal-500 to-primary"
    },
    {
      title: "Share your experience",
      subtitle: "Tell us about your professional journey",
      icon: Briefcase,
      type: "experience",
      description: "Describe your work experience or share your LinkedIn profile. Our AI will transform this into compelling resume content.",
      gradient: "from-purple-500 via-primary to-primary/80"
    },
    {
      title: "You're all set! 🚀",
      subtitle: "Let's create something amazing together",
      icon: Sparkles,
      type: "complete",
      description: "Perfect! We have everything we need to help you create an outstanding resume. Your success story starts now!",
      features: [
        { icon: Wand2, text: "AI will enhance your content" },
        { icon: Target, text: "Optimized for applicant tracking systems" },
        { icon: Eye, text: "Multiple professional templates" }
      ],
      gradient: "from-primary via-accent to-secondary"
    }
  ];

  const nextStep = async () => {
    // Validate current step before proceeding
    if (currentStep.type === 'profession' && !userData.profession.trim()) {
      return; // Don't proceed if profession is empty
    }
    if (currentStep.type === 'goals' && !userData.careerGoals.trim()) {
      return; // Don't proceed if career goals are empty
    }
    if (currentStep.type === 'experience' && !userData.workExperience.trim() && !userData.linkedinUrl?.trim()) {
      return; // Don't proceed if both experience and LinkedIn are empty
    }
    
    if (step < steps.length - 1) {
      setAnimation('animate-fade-out');
      setTimeout(() => {
        setStep(step + 1);
        setAnimation('animate-scale-up');
      }, 300);
    } else {
      // Save onboarding data to localStorage first for immediate use
      localStorage.setItem('onboardingData', JSON.stringify(userData));
      
      // Save to database
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              full_name: userData.profession, // Store profession as name if not already set
              linkedin_url: userData.linkedinUrl || null,
              linkedin_data: {
                profession: userData.profession,
                career_goals: userData.careerGoals,
                work_experience: userData.workExperience,
                onboarding_completed: true,
                completed_at: new Date().toISOString()
              }
            }, {
              onConflict: 'id'
            });
        }
      } catch (error) {
        console.error('Error saving onboarding data:', error);
      }
      
      onComplete(userData);
    }
  };

  const updateUserData = (field: keyof OnboardingData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    const currentStepType = currentStep.type;
    if (currentStepType === 'profession') return userData.profession.trim().length > 0;
    if (currentStepType === 'goals') return userData.careerGoals.trim().length > 0;
    if (currentStepType === 'experience') return userData.workExperience.trim().length > 0 || userData.linkedinUrl?.trim().length > 0;
    return true;
  };

  const progress = ((step + 1) / steps.length) * 100;
  const currentStep = steps[step];

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'profession':
        return (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="profession" className="text-base font-semibold text-foreground flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Current or Target Role
                </Label>
                <Input
                  id="profession"
                  placeholder="e.g., Software Engineer, Marketing Manager, Data Scientist..."
                  value={userData.profession}
                  onChange={(e) => updateUserData('profession', e.target.value)}
                  className="h-14 text-lg border-2 border-border/50 focus:border-primary/50 rounded-xl bg-background/80 backdrop-blur-sm"
                  autoFocus
                />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This helps us understand your career focus and tailor content accordingly
                </p>
              </div>
            </div>
        );
      
      case 'goals':
        return (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="goals" className="text-base font-semibold text-foreground flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Rocket className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  Career Aspirations
                </Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., I want to become a senior developer, transition into product management, or advance to a leadership role..."
                  value={userData.careerGoals}
                  onChange={(e) => updateUserData('careerGoals', e.target.value)}
                  className="min-h-[120px] text-lg resize-none border-2 border-border/50 focus:border-primary/50 rounded-xl bg-background/80 backdrop-blur-sm"
                  autoFocus
                />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tell us about your professional ambitions and where you'd like to grow
                </p>
              </div>
            </div>
        );
      
      case 'experience':
        return (
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="experience" className="text-base font-semibold text-foreground flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Briefcase className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Work Experience
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your professional experience, key achievements, skills, and notable projects in a few sentences..."
                    value={userData.workExperience}
                    onChange={(e) => updateUserData('workExperience', e.target.value)}
                    className="min-h-[140px] text-lg resize-none border-2 border-border/50 focus:border-primary/50 rounded-xl bg-background/80 backdrop-blur-sm"
                    autoFocus
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t-2 border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase font-medium">
                    <span className="bg-background px-4 py-1 text-muted-foreground rounded-full border border-border/50">or</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="linkedin" className="text-base font-semibold text-foreground flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Linkedin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    LinkedIn Profile URL (Alternative)
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/yourname"
                    value={userData.linkedinUrl || ''}
                    onChange={(e) => updateUserData('linkedinUrl', e.target.value)}
                    className="h-14 text-lg border-2 border-border/50 focus:border-primary/50 rounded-xl bg-background/80 backdrop-blur-sm"
                  />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Provide either your experience description above or your LinkedIn URL - whichever is easier for you
                  </p>
                </div>
              </div>
            </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl ${animation} overflow-hidden shadow-2xl border-0 bg-gradient-to-b from-background to-muted/20`}>
        {/* Enhanced Gradient Header */}
        <div className={`bg-gradient-to-br ${currentStep.gradient} p-8 text-white relative overflow-hidden`}>
          {/* Enhanced decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-white/15 rounded-full animate-bounce delay-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <currentStep.icon className="w-8 h-8 text-white drop-shadow-sm" />
              </div>
              <div className="text-right">
                <div className="text-sm text-white/90 font-medium mb-2">Step {step + 1} of {steps.length}</div>
                <Progress className="h-2 w-28 bg-white/20 rounded-full" value={progress} indicatorClassName="bg-white rounded-full shadow-sm" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold mb-3 leading-tight tracking-tight">
              {currentStep.title}
            </CardTitle>
            <p className="text-xl text-white/95 font-medium leading-relaxed">
              {currentStep.subtitle}
            </p>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          <p className="text-muted-foreground text-center text-xl leading-relaxed font-medium">
            {currentStep.description}
          </p>

          {/* Enhanced Features Grid for welcome and complete steps */}
          {currentStep.features && (
            <div className="grid grid-cols-1 gap-4">
              {currentStep.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/15 hover:from-primary/10 hover:to-accent/10 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-semibold text-lg">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step-specific content */}
          {renderStepContent()}

          {/* Enhanced Progress Dots */}
          <div className="flex justify-center gap-3 pt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === step 
                    ? 'bg-primary scale-150 shadow-lg shadow-primary/30' 
                    : index < step
                    ? 'bg-primary/70 scale-110'
                    : 'bg-muted scale-90'
                }`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-0">
          <Button 
            onClick={nextStep}
            disabled={!canProceed()}
            className="w-full bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/95 hover:to-accent/90 text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-primary/35 transition-all duration-500 group h-14 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-primary/20"
          >
            <div className="flex items-center justify-center gap-3">
              {step < steps.length - 1 ? (
                <>
                  <span>Continue Journey</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-all duration-300" />
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 group-hover:scale-125 transition-all duration-300" />
                  <span>Start Building Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-all duration-300" />
                </>
              )}
            </div>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
