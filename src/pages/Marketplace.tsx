import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Shield, 
  Crown, 
  Star, 
  Zap, 
  TrendingUp,
  Search,
  Filter,
  Lock
} from "lucide-react";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const premiumLinks = [
    {
      id: 1,
      title: "Premium Resume Templates",
      description: "Exclusive collection of ATS-optimized templates",
      url: "https://example.com/premium-templates",
      category: "Templates",
      price: "$29",
      featured: true,
      rating: 4.9,
      sponsored: true
    },
    {
      id: 2,
      title: "AI Interview Prep Platform",
      description: "Advanced AI-powered interview preparation",
      url: "https://example.com/interview-prep",
      category: "Tools",
      price: "$49",
      featured: true,
      rating: 4.8,
      sponsored: true
    },
    {
      id: 3,
      title: "LinkedIn Optimization Service",
      description: "Professional LinkedIn profile enhancement",
      url: "https://example.com/linkedin-service",
      category: "Services",
      price: "$99",
      featured: false,
      rating: 4.7,
      sponsored: false
    },
    {
      id: 4,
      title: "Career Coaching Sessions",
      description: "1-on-1 career guidance from industry experts",
      url: "https://example.com/career-coaching",
      category: "Services",
      price: "$149",
      featured: true,
      rating: 5.0,
      sponsored: true
    },
    {
      id: 5,
      title: "Resume Review Service",
      description: "Professional resume review and feedback",
      url: "https://example.com/resume-review",
      category: "Services",
      price: "$39",
      featured: false,
      rating: 4.6,
      sponsored: false
    },
    {
      id: 6,
      title: "Job Search Accelerator",
      description: "Complete job search strategy and tools",
      url: "https://example.com/job-accelerator",
      category: "Tools",
      price: "$199",
      featured: true,
      rating: 4.9,
      sponsored: true
    }
  ];

  const categories = ["All", "Templates", "Tools", "Services"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredLinks = premiumLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || link.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredLinks = filteredLinks.filter(link => link.featured);
  const regularLinks = filteredLinks.filter(link => !link.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Lock className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Secret Marketplace
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Exclusive access for authenticated members
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20">
              <Crown className="h-3 w-3 mr-1" />
              VIP Access
            </Badge>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search premium offerings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="grid w-full grid-cols-4">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Section */}
        {featuredLinks.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Featured Offers</h2>
              <Badge variant="secondary">Premium</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLinks.map((link) => (
                <Card key={link.id} className="group hover:shadow-lg transition-all duration-300 border-primary/20 bg-gradient-to-br from-card to-card/50 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {link.category}
                        </Badge>
                        {link.sponsored && (
                          <Badge variant="outline" className="border-accent text-accent">
                            <Zap className="h-3 w-3 mr-1" />
                            Sponsored
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        {link.rating}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{link.price}</span>
                      <Button 
                        asChild 
                        className="bg-gradient-to-r from-primary to-accent hover:shadow-md transition-all"
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          Access Now
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Regular Offers */}
        {regularLinks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-2xl font-bold">All Offers</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {regularLinks.map((link) => (
                <Card key={link.id} className="group hover:shadow-md transition-all duration-300 border-muted/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {link.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-muted text-muted" />
                        {link.rating}
                      </div>
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">{link.price}</span>
                      <Button size="sm" variant="outline" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          View
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No offers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;