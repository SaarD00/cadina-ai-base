
import React from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InfrastructureSection from '@/components/InfrastructureSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { Github, ExternalLink } from 'lucide-react';

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Resume's Ranked Announcement */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-resume-purple via-resume-violet to-resume-purple-dark opacity-95 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="text-white font-medium text-sm tracking-wide">NEW FEATURE</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Introducing{" "}
                <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                  Resume's Ranked
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">
                Compete with professionals worldwide. Rank your resume against others in your field and climb the leaderboard with AI-powered scoring.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  size="lg" 
                  className="bg-white text-resume-purple hover:bg-white/90 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Join the Competition
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-8 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">🏆</span>
                  </div>
                  <span className="text-sm font-medium">Competitive Ranking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">🤖</span>
                  </div>
                  <span className="text-sm font-medium">AI-Powered Scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">📊</span>
                  </div>
                  <span className="text-sm font-medium">Real-time Leaderboards</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <InfrastructureSection />

        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-resume-purple/5 to-resume-violet/5 z-0"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center text-center space-y-4 mb-10">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl bg-gradient-to-br from-resume-gray-dark to-resume-purple bg-clip-text text-transparent">
                Developed by
              </h2>
              <p className="max-w-[700px] text-resume-gray md:text-lg">
                Meet the developer behind Vireia AI
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl border shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-resume-purple to-resume-violet rounded-full flex items-center justify-center">
                    <Github className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-resume-gray-dark mb-2">
                      SaarD00
                    </h3>
                    <p className="text-resume-gray mb-4">
                      Full-stack developer passionate about creating AI-powered tools that help people advance their careers.
                    </p>
                    <a
                      href="https://github.com/SaarD00"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-resume-purple hover:bg-resume-purple-dark text-white rounded-lg transition-colors duration-200"
                    >
                      <Github className="h-4 w-4" />
                      View GitHub Profile
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PricingSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
