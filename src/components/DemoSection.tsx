import React, { useEffect, useRef, useState } from 'react';
import { 
  Brain, 
  FileText, 
  CheckCircle, 
  Star, 
  Download, 
  Eye, 
  BarChart,
  Sparkles,
  Zap,
  Target,
  Award,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DemoSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [showResume, setShowResume] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  
  const demoSteps = [
    { label: "Analyzing Profile", duration: 2000, icon: Brain },
    { label: "Extracting Keywords", duration: 1500, icon: Target },
    { label: "Optimizing Content", duration: 2500, icon: Sparkles },
    { label: "ATS Validation", duration: 1500, icon: CheckCircle },
    { label: "Resume Ready!", duration: 1000, icon: Award }
  ];

  const alexProfile = {
    name: "Alex Rivera",
    title: "Senior UX/UI Designer",
    email: "alex.rivera@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    summary: "Creative and strategic UX/UI Designer with 6+ years of experience designing user-centered digital products for Fortune 500 companies. Proven track record of increasing user engagement by 40% through data-driven design decisions and comprehensive user research. Expert in design systems, prototyping, and cross-functional collaboration.",
    experience: [
      {
        title: "Senior UX/UI Designer",
        company: "TechCorp Solutions",
        period: "2022 - Present",
        achievements: [
          "Led the redesign of mobile app resulting in 40% increase in user engagement",
          "Established design system adopted across 5 product teams",
          "Mentored 3 junior designers and conducted user research with 500+ participants"
        ]
      },
      {
        title: "UX Designer",
        company: "Digital Innovations Inc",
        period: "2020 - 2022",
        achievements: [
          "Designed end-to-end user experiences for B2B SaaS platform",
          "Improved conversion rates by 35% through iterative testing",
          "Collaborated with product managers and engineers on feature development"
        ]
      }
    ],
    skills: [
      "User Experience Design", "User Interface Design", "Figma", "Sketch", 
      "Adobe Creative Suite", "Prototyping", "User Research", "Usability Testing",
      "Design Systems", "Wireframing", "Information Architecture", "HTML/CSS"
    ],
    education: {
      degree: "Bachelor of Fine Arts in Graphic Design",
      school: "San Francisco State University",
      year: "2018"
    }
  };

  const resumeContent = [
    alexProfile.name,
    alexProfile.title,
    alexProfile.summary,
    "EXPERIENCE",
    alexProfile.experience[0].title + " at " + alexProfile.experience[0].company,
    alexProfile.experience[0].achievements.join(" "),
    "SKILLS",
    alexProfile.skills.slice(0, 8).join(", ")
  ];

  const fullText = resumeContent.join(" ");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowResume(true);
        // Start typewriter effect
        const typewriterTimer = setInterval(() => {
          setTypewriterIndex(prev => {
            if (prev >= fullText.length) {
              clearInterval(typewriterTimer);
              // Start ATS score animation
              const scoreTimer = setInterval(() => {
                setAtsScore(prev => {
                  if (prev >= 96) {
                    clearInterval(scoreTimer);
                    return 96;
                  }
                  return prev + 2;
                });
              }, 50);
              return prev;
            }
            return prev + 1;
          });
        }, 30);
      }
    }, currentStep === 0 ? 1000 : demoSteps[currentStep - 1]?.duration || 2000);

    return () => clearTimeout(timer);
  }, [isVisible, currentStep, fullText.length]);

  const getTypedText = (text, maxLength) => {
    return text.slice(0, Math.min(maxLength, text.length));
  };

  const getCurrentTypedSection = () => {
    let charCount = 0;
    let currentSection = '';
    
    for (let i = 0; i < resumeContent.length; i++) {
      const section = resumeContent[i];
      if (charCount + section.length + 1 > typewriterIndex) {
        currentSection = section.slice(0, typewriterIndex - charCount);
        break;
      }
      charCount += section.length + 1;
    }
    
    return currentSection;
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-16 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-primary/30 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm">
            <Eye className="mr-2 h-4 w-4" />
            <span>Live Demo</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
            Watch AI Magic in Action
          </h2>
          
          <p className="max-w-3xl text-muted-foreground text-lg md:text-xl leading-relaxed">
            See how Vireia AI transforms a simple profile into a powerful, ATS-optimized resume in real-time. 
            Meet Alex Rivera and watch their career story come to life.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Left side - Profile and AI Process */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-card/80 to-muted/40 backdrop-blur-xl rounded-3xl p-8 border border-border/50 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  AR
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{alexProfile.name}</h3>
                  <p className="text-lg text-primary font-medium">{alexProfile.title}</p>
                  <p className="text-sm text-muted-foreground">{alexProfile.location}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Professional Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {alexProfile.summary.substring(0, 150)}...
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Core Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {alexProfile.skills.slice(0, 6).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      +6 more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Process Visualization */}
            <div className="bg-gradient-to-br from-card/60 to-muted/30 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                AI Processing Steps
              </h3>
              
              <div className="space-y-4">
                {demoSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${
                        isActive 
                          ? 'bg-primary/10 border border-primary/20' 
                          : isCompleted 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-muted/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive 
                          ? 'bg-primary text-primary-foreground animate-pulse' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <span className={`font-medium transition-colors duration-500 ${
                          isActive ? 'text-primary' : isCompleted ? 'text-green-700' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </span>
                        {isActive && (
                          <div className="mt-2 h-1 bg-primary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '100%' }}></div>
                          </div>
                        )}
                      </div>
                      
                      {isActive && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right side - Generated Resume */}
          <div className="relative">
            {!showResume ? (
              <div className="aspect-[8.5/11] bg-gradient-to-br from-muted/20 to-card/40 backdrop-blur-sm rounded-2xl border border-border/50 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Brain className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <p className="text-muted-foreground">AI is analyzing and optimizing...</p>
                </div>
              </div>
            ) : (
              <div className="aspect-[8.5/11] bg-white rounded-2xl shadow-2xl border border-border/20 overflow-hidden relative">
                {/* Resume content */}
                <div className="p-8 h-full overflow-hidden">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="text-center border-b border-gray-200 pb-4">
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {typewriterIndex > 0 && (
                          <>
                            {getTypedText(alexProfile.name, typewriterIndex)}
                            {typewriterIndex <= alexProfile.name.length && (
                              <span className="animate-pulse">|</span>
                            )}
                          </>
                        )}
                      </h1>
                      <p className="text-lg text-primary font-medium mb-2">
                        {typewriterIndex > alexProfile.name.length && (
                          <>
                            {getTypedText(alexProfile.title, Math.max(0, typewriterIndex - alexProfile.name.length - 1))}
                            {typewriterIndex <= alexProfile.name.length + alexProfile.title.length + 1 && (
                              <span className="animate-pulse">|</span>
                            )}
                          </>
                        )}
                      </p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>{alexProfile.email} • {alexProfile.phone}</div>
                        <div>{alexProfile.location}</div>
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">PROFESSIONAL SUMMARY</h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {typewriterIndex > alexProfile.name.length + alexProfile.title.length + 2 && (
                          <>
                            {getTypedText(
                              alexProfile.summary, 
                              Math.max(0, typewriterIndex - alexProfile.name.length - alexProfile.title.length - 3)
                            )}
                            {typewriterIndex <= alexProfile.name.length + alexProfile.title.length + alexProfile.summary.length + 3 && (
                              <span className="animate-pulse">|</span>
                            )}
                          </>
                        )}
                      </p>
                    </div>

                    {/* Experience */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3">PROFESSIONAL EXPERIENCE</h2>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-900">{alexProfile.experience[0].title}</h3>
                            <span className="text-sm text-gray-600">{alexProfile.experience[0].period}</span>
                          </div>
                          <p className="text-sm text-primary font-medium mb-2">{alexProfile.experience[0].company}</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {alexProfile.experience[0].achievements.slice(0, 2).map((achievement, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">CORE COMPETENCIES</h2>
                      <div className="grid grid-cols-3 gap-1 text-sm text-gray-700">
                        {alexProfile.skills.slice(0, 9).map((skill, index) => (
                          <div key={index} className="truncate">• {skill}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ATS Score Badge */}
                  <div className="absolute bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      <div className="text-center">
                        <div className="text-lg font-bold">{atsScore}%</div>
                        <div className="text-xs">ATS Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI generation indicator */}
                {typewriterIndex < fullText.length && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
                      AI Writing...
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            {showResume && typewriterIndex >= fullText.length && (
              <div className="flex gap-4 mt-6 justify-center">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 group"
                >
                  <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  Download Resume
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Success metrics */}
        {showResume && atsScore >= 96 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, label: "ATS Score", value: `${atsScore}%`, color: "text-green-600" },
              { icon: Target, label: "Keyword Match", value: "94%", color: "text-blue-600" },
              { icon: Clock, label: "Generated in", value: "8.3s", color: "text-purple-600" },
              { icon: Users, label: "Interview Rate", value: "85%", color: "text-orange-600" }
            ].map((metric, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <metric.icon className={`h-8 w-8 ${metric.color} mx-auto mb-2`} />
                <div className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DemoSection;