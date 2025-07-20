import React, { useEffect, useRef, useState } from 'react';
import { 
  Brain, 
  FileText, 
  Sparkles, 
  Search, 
  LineChart, 
  CheckCircle,
  Zap,
  Database,
  Code,
  Timer,
  Network,
  Cpu,
  Layers,
  Target,
  BarChart,
  Activity,
  GitBranch,
  Workflow
} from 'lucide-react';

const EnhancedInfrastructureSection = () => {
  const sectionRef = useRef(null);
  const [activeFlow, setActiveFlow] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const aiFlows = [
    { id: 1, name: 'Document Analysis', progress: 95, color: '#9b87f5' },
    { id: 2, name: 'Content Generation', progress: 88, color: '#8B5CF6' },
    { id: 3, name: 'ATS Optimization', progress: 92, color: '#7C3AED' },
    { id: 4, name: 'Quality Assurance', progress: 100, color: '#6D28D9' }
  ];

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
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveFlow(prev => (prev + 1) % aiFlows.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="py-24 relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/30"
    >
      {/* Animated neural network background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-2.5 h-2.5 bg-primary/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path 
            d="M 40 80 Q 200 60 360 80 T 680 80" 
            stroke="url(#neuralGradient)" 
            strokeWidth="1" 
            fill="none"
            className="animate-pulse"
          />
          <path 
            d="M 80 160 Q 240 140 400 160 T 720 160" 
            stroke="url(#neuralGradient)" 
            strokeWidth="1" 
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '0.7s' }}
          />
        </svg>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col items-center text-center space-y-6 mb-20">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm">
            <Brain className="mr-2 h-4 w-4 animate-pulse" />
            <span>Advanced AI Technology</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
            How Our AI Engine Works
          </h2>
          
          <p className="max-w-3xl text-muted-foreground text-lg md:text-xl leading-relaxed">
            Experience next-generation resume optimization powered by machine learning algorithms that analyze 
            millions of successful applications to craft your perfect professional story.
          </p>
        </div>

        {/* AI Process Visualization */}
        <div className="grid gap-8 lg:grid-cols-2 items-center mb-20">
          {/* Left side - Process cards */}
          <div className="space-y-6">
            {[
              {
                icon: Search,
                title: "Intelligent Document Analysis",
                description: "Advanced NLP algorithms scan and understand job requirements, extracting key competencies and preferred qualifications.",
                tech: "Natural Language Processing",
                delay: 0
              },
              {
                icon: Brain,
                title: "Dynamic Content Generation",
                description: "AI crafts personalized content that highlights your relevant experience using proven templates and successful patterns.",
                tech: "Generative AI Models",
                delay: 200
              },
              {
                icon: Target,
                title: "ATS Optimization Engine",
                description: "Machine learning algorithms ensure your resume passes through applicant tracking systems with maximum score.",
                tech: "Pattern Recognition",
                delay: 400
              },
              {
                icon: CheckCircle,
                title: "Quality Assurance Protocol",
                description: "Multi-layer validation checks formatting, consistency, and impact to guarantee professional standards.",
                tech: "Automated QA Systems",
                delay: 600
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`group p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 ${
                  isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-primary/5 rounded-full text-xs font-medium text-primary border border-primary/20">
                      <Cpu className="mr-1.5 h-3 w-3" />
                      {step.tech}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Live AI visualization */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-card/80 to-muted/40 backdrop-blur-xl rounded-3xl p-8 border border-border/50 shadow-2xl">
              {/* Central AI core */}
              <div className="relative h-full flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/20">
                  <Brain className="h-16 w-16 text-primary-foreground animate-pulse" />
                </div>
                
                {/* Orbiting elements */}
                {aiFlows.map((flow, index) => {
                  const angle = (index * 90) - 45;
                  const radius = 120;
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  
                  return (
                    <div
                      key={flow.id}
                      className={`absolute w-16 h-16 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center transition-all duration-500 ${
                        activeFlow === index ? 'scale-110 border-primary/50 shadow-xl shadow-primary/20' : ''
                      }`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        animation: isVisible ? `float 3s ease-in-out infinite ${index * 0.5}s` : 'none'
                      }}
                    >
                      <div className="text-xs font-semibold text-center">
                        <div className="text-primary mb-1">{flow.progress}%</div>
                        <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ 
                              width: activeFlow === index ? `${flow.progress}%` : '0%',
                              backgroundColor: flow.color 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {aiFlows.map((_, index) => {
                    const angle = (index * 90) - 45;
                    const radius = 120;
                    const x1 = 50; // center
                    const y1 = 50; // center
                    const x2 = 50 + (Math.cos(angle * Math.PI / 180) * radius / 4); // scaled for viewBox
                    const y2 = 50 + (Math.sin(angle * Math.PI / 180) * radius / 4); // scaled for viewBox
                    
                    return (
                      <line
                        key={index}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeOpacity={activeFlow === index ? "0.6" : "0.2"}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
            
            {/* Floating tech indicators */}
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center animate-float">
              <Database className="h-6 w-6 text-primary" />
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
              <Code className="h-6 w-6 text-primary" />
            </div>
            
            <div className="absolute top-1/2 -right-6 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
              <Network className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Enhanced Technology Stack */}
        <div className="bg-gradient-to-br from-card/60 to-muted/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border/50 shadow-2xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Cutting-Edge Technology</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Enterprise-Grade AI Infrastructure
              </h3>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                Built on a foundation of advanced machine learning models, our platform combines natural language processing, 
                predictive analytics, and automated optimization to deliver results that consistently outperform traditional approaches.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Activity, label: "Real-time Processing", value: "< 3 seconds" },
                  { icon: Layers, label: "ML Model Layers", value: "12+ Deep" },
                  { icon: BarChart, label: "Success Rate", value: "94.7%" },
                  { icon: Workflow, label: "Optimization Steps", value: "50+" }
                ].map((metric, index) => (
                  <div key={index} className="p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30">
                    <div className="flex items-center gap-3 mb-2">
                      <metric.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                    </div>
                    <div className="text-xl font-bold text-primary">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-muted/20 to-card/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/30 shadow-inner">
                <div className="p-6 h-full">
                  {/* Code visualization */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="text-primary/70">// AI Resume Optimization Engine</div>
                    <div className="text-muted-foreground">
                      <span className="text-blue-400">const</span>{" "}
                      <span className="text-yellow-400">optimizeResume</span> = 
                      <span className="text-blue-400"> async</span> (resumeData) =&gt; {"{"}
                    </div>
                    <div className="ml-4 space-y-1 text-muted-foreground">
                      <div>
                        <span className="text-blue-400">const</span> analysis = 
                        <span className="text-blue-400"> await</span> nlpEngine.analyze(jobDesc);
                      </div>
                      <div>
                        <span className="text-blue-400">const</span> keywords = 
                        extractKeywords(analysis);
                      </div>
                      <div>
                        <span className="text-blue-400">const</span> optimized = 
                        aiModel.enhance(resumeData, keywords);
                      </div>
                      <div>
                        <span className="text-purple-400">return</span> atsValidator.verify(optimized);
                      </div>
                    </div>
                    <div className="text-muted-foreground">{"}"}</div>
                  </div>
                  
                  {/* Live metrics */}
                  <div className="absolute bottom-4 right-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">Processing...</span>
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium">
                      ATS Score: <span className="text-primary">96%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              
              <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30">
                <GitBranch className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedInfrastructureSection;