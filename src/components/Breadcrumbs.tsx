import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbsProps {
  customPaths?: { [key: string]: string };
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customPaths = {} }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const pathMap: { [key: string]: string } = {
    templates: 'Resume Templates',
    blog: 'Career Blog',
    'sign-in': 'Sign In',
    'sign-up': 'Sign Up', 
    'privacy-policy': 'Privacy Policy',
    dashboard: 'Dashboard',
    resume: 'My Resumes',
    builder: 'Resume Builder',
    canvas: 'Resume Editor',
    applications: 'Job Applications',
    analytics: 'Analytics',
    ...customPaths
  };

  if (pathnames.length === 0) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center hover:text-primary">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathnames.map((path, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName = pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <React.Fragment key={to}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-medium">
                    {displayName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to} className="hover:text-primary">
                      {displayName}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};