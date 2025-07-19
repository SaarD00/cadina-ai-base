
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { AlertCircle } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const Blog = () => {
  useSEO({
    title: 'Resume Writing Blog | Career Tips & AI Insights - Vireia AI',
    description: 'Expert career advice, resume writing tips, and AI-powered job search strategies. Learn how to create winning resumes, ace interviews, and advance your career with Vireia AI insights.',
    canonical: 'https://www.vireia.com/blog',
    keywords: 'resume writing tips, career advice, job search strategies, interview tips, AI resume optimization, professional development, career growth, job application tips',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Vireia AI Career Blog",
      "description": "Expert career advice and resume writing tips powered by AI insights",
      "url": "https://www.vireia.com/blog",
      "author": {
        "@type": "Organization",
        "name": "Vireia AI"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Vireia AI",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.vireia.com/logo.png"
        }
      }
    }
  });

  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: featuredBlogs } = useQuery({
    queryKey: ['featured-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const categories = blogs ? [...new Set(blogs.map(blog => blog.category))] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <BlogHero featuredBlogs={featuredBlogs || []} />
        
        <div className="container mx-auto px-4 py-16">
          <Breadcrumbs />
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="animate-pulse space-y-6">
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load blogs</h3>
                <p className="text-muted-foreground">Please try again later.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BlogGrid blogs={blogs || []} />
              </div>
              <div className="lg:col-span-1">
                <BlogSidebar 
                  recentBlogs={blogs?.slice(0, 5) || []}
                  categories={categories}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
