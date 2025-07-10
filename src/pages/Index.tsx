
import React from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InfrastructureSection from '@/components/InfrastructureSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { Github, ExternalLink, ChevronUp } from 'lucide-react';

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Resume's Ranked Announcement */}
        <section className="py-24 relative overflow-hidden">
          {/* Background with animated gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-resume-purple via-resume-violet to-resume-purple-dark opacity-95 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_60%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/15 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                </div>
                <span className="text-white font-semibold text-sm tracking-wider uppercase">🚀 New Feature Launch</span>
              </div>
              
              {/* Main heading with gradient animation */}
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Introducing{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent animate-pulse">
                      Resume's Ranked
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-white/50 to-transparent rounded-full"></div>
                  </span>
                </h2>
                
                <p className="text-xl md:text-2xl text-white/90 max-w-4xl leading-relaxed font-light">
                  Join the ultimate competition where professionals worldwide compete for resume supremacy. 
                  <span className="font-semibold text-white"> Climb the leaderboards</span> with AI-powered scoring and prove your worth.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <Button 
                  size="lg" 
                  className="group bg-white text-resume-purple hover:bg-white/95 font-bold px-10 py-5 text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-3">
                    🏆 Join the Competition
                    <ChevronUp className="ml-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/40 text-white hover:bg-white/15 font-bold px-10 py-5 text-lg rounded-2xl backdrop-blur-sm hover:border-white/60 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    📊 View Leaderboard
                    <ExternalLink className="h-5 w-5" />
                  </span>
                </Button>
              </div>
              
              {/* Feature highlights with enhanced styling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Competitive Ranking</h3>
                    <p className="text-white/80 text-sm">Battle for the top spot with real-time rankings</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-2">AI-Powered Scoring</h3>
                    <p className="text-white/80 text-sm">Advanced algorithms evaluate every detail</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Live Leaderboards</h3>
                    <p className="text-white/80 text-sm">Watch your progress in real-time</p>
                  </div>
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
