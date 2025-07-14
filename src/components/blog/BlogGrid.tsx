import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import Image from '@/components/ui/image';
import { BlogArticleModal } from './BlogArticleModal';

type Blog = Tables<'blogs'>;

interface BlogGridProps {
  blogs: Blog[];
}

export const BlogGrid: React.FC<BlogGridProps> = ({ blogs }) => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadArticle = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">No blogs yet</h3>
        <p className="text-muted-foreground">Check back soon for exciting content!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Latest Articles
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover insights, tips, and updates from our team
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
            {blogs.length} articles
          </Badge>
        </div>

        <div className="grid gap-8">
          {blogs.map((blog, index) => (
            <article 
              key={blog.id} 
              onClick={() => handleReadArticle(blog)}
              className={`group cursor-pointer ${
                index === 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
              } grid grid-cols-1 gap-8 p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg border border-border/50 hover:bg-gradient-to-br hover:from-card hover:to-card/80 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`${index === 0 ? 'aspect-video' : 'aspect-square'} rounded-2xl overflow-hidden relative group/image`}>
                <Image
                  src={blog.featured_image_url || '/placeholder.svg'}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm">
                  {blog.category}
                </Badge>
              </div>
              
              <div className={`${index === 0 ? 'lg:col-span-1' : 'lg:col-span-2'} flex flex-col justify-between space-y-6`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium">{blog.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(blog.published_at!), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  <h3 className={`${index === 0 ? 'text-3xl' : 'text-2xl'} font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2`}>
                    {blog.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
                    {blog.excerpt || blog.content.substring(0, 200) + '...'}
                  </p>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors duration-200"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="px-3 py-1.5 text-xs text-muted-foreground">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-primary hover:text-primary/80 transition-colors">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-2" />
                  </Button>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-full px-3 py-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      
      <BlogArticleModal
        blog={selectedBlog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};