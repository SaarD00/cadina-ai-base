
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Award, ThumbsUp, Target, CheckCircle2, AlertCircle, Search } from 'lucide-react';

interface ATSScoreCardProps {
  atsResults: any;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ 
  atsResults, 
  expandedSection, 
  toggleSection 
}) => {
  return (
    <Card className="overflow-hidden border border-gradient-to-r from-resume-purple/30 to-resume-violet/30 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/95">
      <div 
        className="p-6 border-b border-resume-purple/10 flex justify-between items-center cursor-pointer bg-gradient-to-r from-resume-purple/5 via-white/95 to-resume-violet/5 hover:from-resume-purple/10 hover:to-resume-violet/10 transition-all duration-300"
        onClick={() => toggleSection("ats")}
      >
        <div className="flex items-center">
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-resume-purple to-resume-violet flex items-center justify-center mr-4 shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
              ATS Compatibility Score
            </h3>
            <p className="text-sm text-muted-foreground font-medium">AI-powered analysis of your resume's ATS performance</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
              {atsResults.score || 0}
            </div>
            <Badge variant="outline" className={`
              font-semibold px-3 py-1 text-xs rounded-full border-2 transition-all duration-300
              ${atsResults.score >= 80 ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-green-100' : 
                atsResults.score >= 60 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-300 shadow-amber-100' : 
                'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300 shadow-red-100'}
            `}>
              {atsResults.score >= 80 ? '🏆 Excellent' : 
               atsResults.score >= 60 ? '✨ Good' : 
               '📈 Needs Work'}
            </Badge>
          </div>
          <div className="p-2 rounded-full bg-gradient-to-r from-resume-purple/10 to-resume-violet/10">
            {expandedSection === "ats" ? 
              <ChevronUp className="h-5 w-5 text-resume-purple" /> : 
              <ChevronDown className="h-5 w-5 text-resume-purple" />
            }
          </div>
        </div>
      </div>
      
      {expandedSection === "ats" && (
        <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50/90 via-white/95 to-resume-purple/5 backdrop-blur-sm border-t border-resume-purple/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-resume-purple/10 shadow-lg">
                <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
                  📊 Performance Metrics
                </h4>
                <div className="space-y-4">
                  {(atsResults.metrics || []).map((metric: any, index: number) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{metric.name}</span>
                        <span className="text-lg font-bold bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
                          {metric.score}%
                        </span>
                      </div>
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full transition-all duration-[1500ms] ease-out relative ${
                            metric.score >= 80 ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600' : 
                            metric.score >= 60 ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600' : 
                            metric.score >= 40 ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600' : 
                            'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                          }`}
                          style={{ width: `${metric.score}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200 shadow-lg">
                <h4 className="font-bold text-lg flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <ThumbsUp className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-green-800">🌟 ATS Strengths</span>
                </h4>
                <ul className="space-y-3">
                  {(atsResults.strengths || []).map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="p-1 bg-green-100 rounded-full mr-3 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-green-800 font-medium">{strength}</span>
                    </li>
                  ))}
                  {(!atsResults.strengths || atsResults.strengths.length === 0) && (
                    <li className="text-green-600 italic font-medium">🔍 Analyzing strengths...</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200 shadow-lg">
                <h4 className="font-bold text-lg flex items-center mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg mr-3">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-amber-800">🎯 Improvement Areas</span>
                </h4>
                <ul className="space-y-3">
                  {(atsResults.improvements || []).map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="p-1 bg-amber-100 rounded-full mr-3 mt-0.5">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-amber-800 font-medium">{improvement}</span>
                    </li>
                  ))}
                  {(!atsResults.improvements || atsResults.improvements.length === 0) && (
                    <li className="text-amber-600 italic font-medium">✨ Looking great! No major issues found.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          {atsResults.keywords && (
            <div className="bg-gradient-to-br from-white via-resume-purple/5 to-resume-violet/5 p-6 rounded-xl border border-resume-purple/20 shadow-lg">
              <h4 className="font-bold text-lg flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-resume-purple to-resume-violet rounded-lg mr-3">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
                  🔍 Recommended Keywords
                </span>
              </h4>
              <div className="flex flex-wrap gap-3">
                {atsResults.keywords.map((keyword: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-gradient-to-r from-resume-purple/10 to-resume-violet/10 text-resume-purple border-resume-purple/30 hover:from-resume-purple/20 hover:to-resume-violet/20 transition-all duration-300 font-semibold px-3 py-1.5 text-sm"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
