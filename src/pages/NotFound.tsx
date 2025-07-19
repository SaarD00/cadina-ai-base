import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSEO } from '@/hooks/use-seo';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useSEO({
    title: '404 - Page Not Found | Vireia AI',
    description: 'The page you\'re looking for doesn\'t exist. Return to Vireia AI to continue building your professional resume with our AI-powered tools.',
    canonical: `https://www.vireia.com${location.pathname}`,
    keywords: '404, page not found, error page',
    noindex: true
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-resume-purple/5 to-resume-violet/5">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-resume-purple to-resume-violet rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <a href="/">
            <Button className="w-full bg-resume-purple hover:bg-resume-purple-dark">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </a>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Looking for resume templates or help? Visit our{' '}
            <a href="/templates" className="text-resume-purple hover:underline">
              Templates
            </a>{' '}
            page or{' '}
            <a href="/blog" className="text-resume-purple hover:underline">
              Blog
            </a>{' '}
            for career tips.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
