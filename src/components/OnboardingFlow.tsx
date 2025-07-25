
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Briefcase, Zap, ArrowRight, Check, Sparkles, Brain, Target, Wand2, Eye, Download, Heart, Globe, Linkedin, PenTool, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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

  const nextStep = () => {
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-sm font-medium text-foreground flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                Current or Target Role
              </Label>
              <Input
                id="profession"
                placeholder="e.g., Software Engineer, Marketing Manager, Data Scientist..."
                value={userData.profession}
                onChange={(e) => updateUserData('profession', e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                This helps us understand your career focus and tailor content accordingly
              </p>
            </div>
          </div>
        );
      
      case 'goals':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals" className="text-sm font-medium text-foreground flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Rocket className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                Career Aspirations
              </Label>
              <Textarea
                id="goals"
                placeholder="e.g., I want to become a senior developer, transition into product management, or advance to a leadership role..."
                value={userData.careerGoals}
                onChange={(e) => updateUserData('careerGoals', e.target.value)}
                className="min-h-[100px] text-base resize-none"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Tell us about your professional ambitions and where you'd like to grow
              </p>
            </div>
          </div>
        );
      
      case 'experience':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Briefcase className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  Work Experience
                </Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your professional experience, key achievements, skills, and notable projects in a few sentences..."
                  value={userData.workExperience}
                  onChange={(e) => updateUserData('workExperience', e.target.value)}
                  className="min-h-[120px] text-base resize-none"
                  autoFocus
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Linkedin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  LinkedIn Profile URL (Alternative)
                </Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/yourname"
                  value={userData.linkedinUrl || ''}
                  onChange={(e) => updateUserData('linkedinUrl', e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">
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
      <Card className={`w-full max-w-2xl ${animation} overflow-hidden`}>
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${currentStep.gradient} p-6 text-white relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <currentStep.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80">Step {step + 1} of {steps.length}</div>
                <Progress className="h-1.5 w-24 bg-white/20" value={progress} indicatorClassName="bg-white" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold mb-2">
              {currentStep.title}
            </CardTitle>
            <p className="text-lg text-white/90 font-medium">
              {currentStep.subtitle}
            </p>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <p className="text-muted-foreground text-center text-lg leading-relaxed">
            {currentStep.description}
          </p>

          {/* Features Grid for welcome and complete steps */}
          {currentStep.features && (
            <div className="grid grid-cols-1 gap-3">
              {currentStep.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step-specific content */}
          {renderStepContent()}

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 pt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === step 
                    ? 'bg-primary scale-125' 
                    : index < step
                    ? 'bg-primary/60'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={nextStep}
            disabled={!canProceed()}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group h-12 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step < steps.length - 1 ? (
              <>
                Continue Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                Start Building Now
                <Sparkles className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
