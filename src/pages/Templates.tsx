import React, { useState, useEffect } from 'react';
import { Search, Tag, Star, Download, Filter, ArrowUpDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from '@/components/AppSidebar';
import { useSEO } from '@/hooks/use-seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const Templates = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useSEO({
    title: 'Free ATS Resume Templates | Professional Designs - Vireia AI',
    description: 'Browse our collection of free, ATS-optimized resume templates. Professional designs for every industry - technical, creative, executive, and academic roles. Download and customize instantly.',
    canonical: 'https://www.vireia.com/templates',
    keywords: 'free resume templates, ATS resume templates, professional resume templates, resume designs, CV templates, modern resume templates, technical resume, creative resume, executive resume',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Resume Templates Collection",
      "description": "Professional ATS-optimized resume templates for all industries",
      "url": "https://www.vireia.com/templates",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Resume Templates",
        "numberOfItems": 6,
        "itemListElement": [
          {
            "@type": "CreativeWork",
            "name": "Modern Professional Template",
            "description": "ATS-friendly minimalist design for professional roles"
          },
          {
            "@type": "CreativeWork", 
            "name": "Creative Portfolio Template",
            "description": "Design-focused template for creative professionals"
          },
          {
            "@type": "CreativeWork",
            "name": "Technical Specialist Template", 
            "description": "Optimized for technical and engineering roles"
          }
        ]
      }
    }
  });
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Welcome toast
    const timer = setTimeout(() => {
      toast({
        title: "Resume Templates",
        description: "Browse and use professional resume templates"
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  // Mock data for templates
  const templates = [
    { 
      id: 1, 
      name: "Modern Professional", 
      category: "Professional", 
      tags: ["ATS-Friendly", "Minimalist"],
      downloads: 2584,
      rating: 4.8,
      image: "https://source.unsplash.com/random/800x1000?resume=1",
      color: "bg-blue-100"
    },
    { 
      id: 2, 
      name: "Creative Portfolio", 
      category: "Creative", 
      tags: ["Design", "Portfolio"],
      downloads: 1862,
      rating: 4.7,
      image: "https://source.unsplash.com/random/800x1000?resume=2",
      color: "bg-purple-100"
    },
    { 
      id: 3, 
      name: "Technical Specialist", 
      category: "Technical", 
      tags: ["ATS-Friendly", "Technical"],
      downloads: 3241,
      rating: 4.9,
      image: "https://source.unsplash.com/random/800x1000?resume=3",
      color: "bg-green-100"
    },
    { 
      id: 4, 
      name: "Executive Summary", 
      category: "Professional", 
      tags: ["Executive", "Leadership"],
      downloads: 1976,
      rating: 4.6,
      image: "https://source.unsplash.com/random/800x1000?resume=4",
      color: "bg-yellow-100"
    },
    { 
      id: 5, 
      name: "Startup Innovator", 
      category: "Creative", 
      tags: ["Startup", "Innovation"],
      downloads: 1547,
      rating: 4.5,
      image: "https://source.unsplash.com/random/800x1000?resume=5",
      color: "bg-red-100"
    },
    { 
      id: 6, 
      name: "Academic CV", 
      category: "Academic", 
      tags: ["Education", "Research"],
      downloads: 1289,
      rating: 4.7,
      image: "https://source.unsplash.com/random/800x1000?resume=6",
      color: "bg-teal-100"
    },
  ];

  const categories = ["All Categories", "Professional", "Creative", "Technical", "Academic"];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-950 dark:to-purple-950">
        <AppSidebar currentPage="templates" />
        
        <SidebarInset>
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <Breadcrumbs />
            
            {/* Page Header */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
                  Resume Templates
                </h1>
                <p className="text-resume-gray mt-1">Browse and use professional resume templates</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search templates..." 
                  className="pl-8 w-full md:w-[300px]" 
                />
              </div>
            </div>

            {/* Filters */}
            <div className={`flex flex-col md:flex-row items-center justify-between gap-4 mb-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Button 
                    key={index} 
                    variant={index === 0 ? "default" : "outline"} 
                    size="sm" 
                    className={index === 0 ? "bg-resume-purple hover:bg-resume-purple-dark" : "rounded-full"}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-3 w-3" /> Filter
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 h-3 w-3" /> Sort
                </Button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
              {templates.map((template, index) => (
                <Card 
                  key={template.id} 
                  className="border border-purple-100 hover:border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-white/80 dashboard-card-hover overflow-hidden"
                  style={{ animationDelay: `${index * 50 + 200}ms` }}
                >
                  <div className={`h-48 overflow-hidden ${template.color}`}>
                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${template.image})` }} />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-resume-gray">{template.category}</div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center text-xs bg-purple-50 text-resume-purple rounded-full px-2 py-1">
                          <Tag className="h-3 w-3 mr-1" /> {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <div className="flex items-center text-xs text-resume-gray">
                      <Download className="h-3 w-3 mr-1" /> {template.downloads.toLocaleString()} downloads
                    </div>
                    <Button className="bg-resume-purple hover:bg-resume-purple-dark text-white">
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Templates;
