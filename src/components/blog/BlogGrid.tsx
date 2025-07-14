
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import Image from '@/components/ui/image';

type Blog = Tables<'blogs'>;

interface BlogGridProps {
  blogs: Blog[];
}

export const BlogGrid: React.FC<BlogGridProps> = ({ blogs }) => {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-semibold mb-4">No blogs yet</h3>
        <p className="text-muted-foreground">Check back soon for exciting content!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Latest Articles</h2>
        <Badge variant="outline" className="px-3 py-1">
          {blogs.length} articles
        </Badge>
      </div>

      <div className="grid gap-8">
        {blogs.map((blog, index) => (
          <article 
            key={blog.id} 
            className={`group cursor-pointer ${
              index === 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
            } grid grid-cols-1 gap-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1`}
          >
            <div className={`${index === 0 ? 'aspect-video' : 'aspect-square'} rounded-xl overflow-hidden`}>
              <Image
                src={blog.featured_image_url || '/placeholder.svg'}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className={`${index === 0 ? 'lg:col-span-1' : 'lg:col-span-2'} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {blog.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {blog.author_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(blog.published_at!), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                
                <h3 className={`${index === 0 ? 'text-2xl' : 'text-xl'} font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2`}>
                  {blog.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {blog.excerpt || blog.content.substring(0, 200) + '...'}
                </p>
                
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-primary">
                  Read Full Article
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
