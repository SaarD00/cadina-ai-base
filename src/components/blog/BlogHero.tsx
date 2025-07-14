
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import Image from '@/components/ui/image';
import { BlogArticleModal } from './BlogArticleModal';

type Blog = Tables<'blogs'>;

interface BlogHeroProps {
  featuredBlogs: Blog[];
}

export const BlogHero: React.FC<BlogHeroProps> = ({ featuredBlogs }) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const mainFeatured = featuredBlogs[0];
  const sideFeatured = featuredBlogs.slice(1, 3);

  const handleReadArticle = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  if (!mainFeatured) {
    return (
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-primary font-semibold uppercase tracking-wide text-sm">Blog</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent mb-8 leading-tight">
              Vireia AI Blog
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              Discover tips, updates, and insights to maximize your resume-building journey with AI-powered tools
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-primary font-semibold uppercase tracking-wide text-sm">Featured Articles</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent mb-8 leading-tight">
              Vireia AI Blog
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Stay updated with the latest tips, features, and insights from our AI experts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Main Featured Article */}
            <div 
              className="group cursor-pointer animate-fade-in"
              onClick={() => handleReadArticle(mainFeatured)}
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-white/70 dark:from-card/90 dark:to-card/70 backdrop-blur-xl border border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-[1.02]">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={mainFeatured.featured_image_url || '/placeholder.svg'}
                    alt={mainFeatured.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-primary/95 text-primary-foreground border-0 backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                    ✨ Featured
                  </Badge>
                </div>
                
                <div className="p-10">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{mainFeatured.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(mainFeatured.published_at!), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-6 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {mainFeatured.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-8 line-clamp-3 text-lg leading-relaxed">
                    {mainFeatured.excerpt || mainFeatured.content.substring(0, 180) + '...'}
                  </p>
                  
                  <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-lg hover:text-primary transition-colors">
                    Read Full Story
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Side Featured Articles */}
            <div className="space-y-8">
              {sideFeatured.map((blog, index) => (
                <div 
                  key={blog.id} 
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  onClick={() => handleReadArticle(blog)}
                >
                  <div className="flex gap-6 p-8 rounded-2xl bg-gradient-to-br from-white/70 to-white/50 dark:from-card/70 dark:to-card/50 backdrop-blur-lg border border-border/30 hover:bg-gradient-to-br hover:from-white/90 hover:to-white/70 dark:hover:from-card/90 dark:hover:to-card/70 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={blog.featured_image_url || '/placeholder.svg'}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs px-3 py-1">
                          {blog.category}
                        </Badge>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(blog.published_at!), { addSuffix: true })}</span>
                      </div>
                      
                      <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                        {blog.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {blog.excerpt || blog.content.substring(0, 120) + '...'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <BlogArticleModal
        blog={selectedBlog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
