
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, AlertTriangle, Coffee, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/use-seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useSEO({
    title: 'Privacy Policy & Terms of Service - Vireia AI',
    description: 'Learn about Vireia AI\'s privacy policy, terms of service, and data protection practices. Understand how we handle your resume data and personal information securely.',
    canonical: 'https://www.vireia.com/privacy-policy',
    keywords: 'privacy policy, terms of service, data protection, resume data security, personal information, GDPR compliance',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy & Terms of Service",
      "description": "Privacy policy and terms of service for Vireia AI resume builder",
      "url": "https://www.vireia.com/privacy-policy",
      "lastReviewed": new Date().toISOString().split('T')[0],
      "publisher": {
        "@type": "Organization",
        "name": "Vireia AI"
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-resume-purple/5 to-resume-violet/5">
      <div className="container px-4 md:px-6 py-12 max-w-4xl mx-auto">
        <Breadcrumbs />
        
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-resume-purple/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-resume-purple/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-resume-purple" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent mb-4">
              Privacy Policy & Terms
            </h1>
            <p className="text-resume-gray-dark text-lg">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-resume-purple/10 p-8 space-y-8">
          
          <div className="bg-gradient-to-r from-resume-purple/10 to-resume-violet/10 rounded-lg p-6 border border-resume-purple/20">
            <div className="flex items-center mb-4">
              <Coffee className="h-6 w-6 text-resume-purple mr-3" />
              <h2 className="text-xl font-semibold text-resume-purple">About This Project</h2>
            </div>
            <p className="text-resume-gray-dark leading-relaxed">
              Vireia AI is a personal side project built for fun and learning purposes. This is not a commercial enterprise or corporation, 
              but rather a passion project created to help people build better resumes while exploring AI technologies. 
              Please enjoy it as such! <Heart className="inline h-4 w-4 text-resume-purple" />
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-resume-gray-dark mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 text-resume-purple mr-3" />
              Important Disclaimers
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-resume-gray-dark mb-2">No Employment Guarantees</h3>
                <p className="text-resume-gray">
                  While Cadina AI aims to help you create better resumes, I cannot guarantee job interviews, offers, or employment outcomes. 
                  Job search success depends on many factors beyond resume quality. I am not responsible for any job rejections, 
                  missed opportunities, or employment-related decisions made by employers.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-resume-gray-dark mb-2">Service Limitations</h3>
                <p className="text-resume-gray">
                  This app operates on limited resources and AI credits. When these credits are exhausted, AI-powered features may 
                  become temporarily unavailable until they are replenished. I'll do my best to keep the service running smoothly, 
                  but please understand the technical constraints of a personal project.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-resume-gray-dark mb-2">Current Pricing</h3>
                <p className="text-resume-gray">
                  Cadina AI is currently offered completely free of charge as part of this experimental phase. 
                  This may change in the future, but for now, enjoy all features at no cost!
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-resume-gray-dark mb-4">Legal Framework</h2>
            
            <div className="space-y-4">
              <div className="bg-resume-purple/5 rounded-lg p-4 border-l-4 border-resume-purple">
                <h3 className="font-semibold text-resume-gray-dark mb-2">Personal Project Status</h3>
                <p className="text-resume-gray">
                  This application is developed and maintained by an individual developer as a personal project, not by a corporation 
                  or business entity. As such, it operates under different legal considerations than commercial software services.
                </p>
              </div>

              <div className="bg-resume-purple/5 rounded-lg p-4 border-l-4 border-resume-purple">
                <h3 className="font-semibold text-resume-gray-dark mb-2">Limitation of Liability</h3>
                <p className="text-resume-gray">
                  By using this application, you acknowledge that it is provided "as-is" for educational and personal use. 
                  The developer is not liable for any damages, losses, or legal issues that may arise from your use of this service. 
                  Use of this application is at your own discretion and risk.
                </p>
              </div>

              <div className="bg-resume-purple/5 rounded-lg p-4 border-l-4 border-resume-purple">
                <h3 className="font-semibold text-resume-gray-dark mb-2">No Legal Recourse</h3>
                <p className="text-resume-gray">
                  Users cannot pursue legal action against this application or its developer for any issues, damages, or outcomes 
                  related to the use of this service. This is a free, experimental tool provided without warranties or guarantees.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-resume-gray-dark mb-4">Data & Privacy</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-resume-gray">
                Your resume data is stored securely and used only to provide the AI-powered features of this application. 
                I don't sell or share your personal information with third parties. However, as a personal project, 
                please don't store highly sensitive information and always keep backup copies of your important documents.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-resume-gray-dark mb-4">Contact & Support</h2>
            <div className="bg-resume-purple/5 rounded-lg p-4">
              <p className="text-resume-gray">
                Since this is a personal project, support is provided on a best-effort basis. 
                If you encounter issues or have questions, feel free to reach out, but please understand that 
                response times may vary as this is maintained alongside other commitments.
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-resume-gray-dark font-medium">
              Thank you for using Vireia AI! 🚀
            </p>
            <p className="text-resume-gray text-sm mt-2">
              Built with ❤️ as a learning project • Not affiliated with any corporation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
