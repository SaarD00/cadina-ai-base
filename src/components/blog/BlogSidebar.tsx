
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Tag, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import Image from '@/components/ui/image';

type Blog = Tables<'blogs'>;

interface BlogSidebarProps {
  recentBlogs: Blog[];
  categories: string[];
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({ recentBlogs, categories }) => {
  return (
    <div className="space-y-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
      {/* Newsletter Signup */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-border/50 backdrop-blur-sm">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Stay Updated
          </CardTitle>
          <p className="text-muted-foreground">
            Get the latest articles and insights delivered to your inbox.
          </p>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
          <Button className="w-full py-3 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300">
            Subscribe Now
          </Button>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      {recentBlogs.length > 0 && (
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-xl font-bold">Recent Articles</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {recentBlogs.map((blog, index) => (
              <div 
                key={blog.id} 
                className="group cursor-pointer flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={blog.featured_image_url || '/placeholder.svg'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(blog.published_at!), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-xl font-bold">Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ad Space */}
      <Card className="p-8 bg-gradient-to-br from-accent/10 to-primary/10 border-border/50 backdrop-blur-sm">
        <CardContent className="p-0 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">Boost Your Career</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create professional resumes with our AI-powered builder
            </p>
            <Button variant="outline" className="w-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Get Started Free
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
