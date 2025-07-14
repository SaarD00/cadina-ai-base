
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
    <div className="space-y-8">
      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Stay Updated</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest resume tips and app updates delivered to your inbox.
          </p>
          <Button className="w-full bg-primary hover:bg-primary/90">
            Subscribe Now
          </Button>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBlogs.slice(0, 5).map((blog) => (
              <div key={blog.id} className="group cursor-pointer">
                <div className="flex gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={blog.featured_image_url || '/placeholder.svg'}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(blog.published_at!), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge 
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors capitalize"
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ad Space */}
      <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-dashed border-2 border-muted-foreground/20">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Advertisement</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Partner with us to reach our growing community of professionals.
          </p>
          <Button variant="outline" size="sm">
            Learn More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
