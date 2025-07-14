
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import Image from '@/components/ui/image';

type Blog = Tables<'blogs'>;

interface BlogHeroProps {
  featuredBlogs: Blog[];
}

export const BlogHero: React.FC<BlogHeroProps> = ({ featuredBlogs }) => {
  const mainFeatured = featuredBlogs[0];
  const sideFeatured = featuredBlogs.slice(1, 3);

  if (!mainFeatured) {
    return (
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
              Vireia AI Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover tips, updates, and insights to maximize your resume-building journey
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Vireia AI Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest tips, features, and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Main Featured Article */}
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={mainFeatured.featured_image_url || '/placeholder.svg'}
                  alt={mainFeatured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground border-0">
                  Featured
                </Badge>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {mainFeatured.author_name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(mainFeatured.published_at!), { addSuffix: true })}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {mainFeatured.title}
                </h2>
                
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {mainFeatured.excerpt || mainFeatured.content.substring(0, 150) + '...'}
                </p>
                
                <Button variant="ghost" className="group/btn p-0 h-auto font-semibold">
                  Read More 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Side Featured Articles */}
          <div className="space-y-6">
            {sideFeatured.map((blog) => (
              <div key={blog.id} className="group cursor-pointer">
                <div className="flex gap-4 p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-border/30 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={blog.featured_image_url || '/placeholder.svg'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {blog.category}
                      </Badge>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(blog.published_at!), { addSuffix: true })}</span>
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blog.excerpt || blog.content.substring(0, 100) + '...'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
