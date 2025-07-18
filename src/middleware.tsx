
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Define public paths for middleware to use
export const publicPaths = ['/', '/sign-in', '/sign-up', '/privacy-policy', '/resume/pdf'];

const isPublic = (path: string) => {
  return publicPaths.some(publicPath =>
    path === publicPath || path.startsWith(`${publicPath}/`));
};

// This is a React component that acts as middleware for route protection
export const RouteMiddleware = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Wait for auth to load
  // if (isLoading) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center">
  //       <div className="animate-pulse bg-resume-purple/20 p-4 rounded-lg">
  //         <span className="text-resume-purple font-medium">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  // Allow public paths
  if (isPublic(location.pathname)) {
    return <>{children}</>;
  }

  // Protect private paths
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // User is authenticated
  return <>{children}</>;
};

export default RouteMiddleware;

