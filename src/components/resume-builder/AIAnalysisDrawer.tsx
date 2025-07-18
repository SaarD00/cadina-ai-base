
import React from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from 'lucide-react';
import AIAssistant from '@/components/resume-builder/AIAssistant';

interface AIAnalysisDrawerProps {
  resumeData: any;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AIAnalysisDrawer: React.FC<AIAnalysisDrawerProps> = ({ 
  resumeData, 
  isOpen, 
  onOpenChange 
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="group relative overflow-hidden border-2 border-gradient-to-r from-resume-purple/40 to-resume-violet/40 bg-gradient-to-r from-white via-resume-purple/5 to-resume-violet/5 text-resume-purple hover:text-white hover:border-transparent hover:from-resume-purple hover:to-resume-violet flex items-center gap-3 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center gap-2 relative z-10">
            <div className="p-1.5 bg-gradient-to-r from-resume-purple/20 to-resume-violet/20 rounded-lg group-hover:from-white/20 group-hover:to-white/20 transition-all duration-300">
              <Brain className="h-5 w-5" />
            </div>
            <span className="font-bold">AI Analysis</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-resume-purple to-resume-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gradient-to-br from-white via-gray-50/80 to-resume-purple/5 border-t-2 border-gradient-to-r from-resume-purple/30 to-resume-violet/30 px-6 py-8 max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-resume-purple/10 to-resume-violet/10 rounded-full border border-resume-purple/20 mb-4">
              <Brain className="h-5 w-5 text-resume-purple" />
              <span className="font-bold text-lg bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
                AI-Powered Resume Analysis
              </span>
              <Sparkles className="h-5 w-5 text-resume-violet animate-pulse" />
            </div>
            <p className="text-gray-600 font-medium">Get detailed insights and recommendations to optimize your resume</p>
          </div>
          <AIAssistant resumeData={resumeData} enabled={true} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AIAnalysisDrawer;
