import React, { createContext, useContext, useEffect, ReactNode } from 'react';

interface SEOContextType {
  updateSEO: (seoData: {
    title?: string;
    description?: string;
    canonical?: string;
    keywords?: string;
    image?: string;
    type?: string;
    noindex?: boolean;
    structuredData?: Record<string, any>;
  }) => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const useSEOContext = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEOContext must be used within SEOProvider');
  }
  return context;
};

interface SEOProviderProps {
  children: ReactNode;
}

export const SEOProvider: React.FC<SEOProviderProps> = ({ children }) => {
  const updateSEO = (seoData: {
    title?: string;
    description?: string;
    canonical?: string;
    keywords?: string;
    image?: string;
    type?: string;
    noindex?: boolean;
    structuredData?: Record<string, any>;
  }) => {
    // This function can be used for global SEO updates if needed
    console.log('SEO Data updated:', seoData);
  };

  // Add global SEO event listeners or analytics
  useEffect(() => {
    // Track page views for SEO analytics
    const trackPageView = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: window.location.pathname,
        });
      }
    };

    // Track initial page view
    trackPageView();

    // Listen for navigation changes
    window.addEventListener('popstate', trackPageView);
    return () => window.removeEventListener('popstate', trackPageView);
  }, []);

  return (
    <SEOContext.Provider value={{ updateSEO }}>
      {children}
    </SEOContext.Provider>
  );
};