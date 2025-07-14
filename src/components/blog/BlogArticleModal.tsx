import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, Clock, Heart, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import Image from '@/components/ui/image';

type Blog = Tables<'blogs'>;

interface BlogArticleModalProps {
  blog: Blog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  blog,
  isOpen,
  onClose,
}) => {
  if (!blog) return null;

  const readTime = Math.ceil(blog.content.length / 1000);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="relative">
            {/* Hero Image */}
            {blog.featured_image_url && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={blog.featured_image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Category Badge */}
                <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground border-0">
                  {blog.category}
                </Badge>
              </div>
            )}
            
            {/* Article Content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {blog.title}
                </h1>
                
                {blog.excerpt && (
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{blog.author_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(blog.published_at!), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readTime} min read</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 pb-6 border-b border-border">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Bookmark className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed text-foreground/90">
                        {children}
                      </p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className={className}>{children}</code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
                        {children}
                      </pre>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 my-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 my-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-foreground/90">{children}</li>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-foreground/90">{children}</em>
                    ),
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
              
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};