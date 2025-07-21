
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Briefcase, Home, Cog, User, BookOpen, Layers, BarChart3, LogOut, Filter } from 'lucide-react';
import CreateResumeDialog from '@/components/CreateResumeDialog';
import ResumeCard from '@/components/resume-listing/ResumeCard';

const Resume = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [userData, setUserData] = useState<{ firstName?: string, email?: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          const firstName = user?.user_metadata?.first_name || user?.user_metadata?.name || '';
          const email = user?.email || '';
          setUserData({ firstName, email });
          
          // Fetch user's resumes from the database
          fetchResumes();
        } else {
          // Redirect to login if not authenticated
          navigate('/sign-in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive"
        });
      }
      
      setIsLoaded(true);
    };
    
    fetchUserData();
    
    // Welcome toast
    const timer = setTimeout(() => {
      toast({
        title: "Resume Manager",
        description: `Welcome ${userData?.firstName || ''}! Create and manage your professional resumes`
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [toast, navigate]);

  const fetchResumes = async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      const formattedResumes = data.map(resume => ({
        id: resume.id,
        name: resume.title,
        lastEdited: new Date(resume.updated_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        tags: resume.template ? [resume.template.charAt(0).toUpperCase() + resume.template.slice(1)] : []
      }));
      
      setResumes(formattedResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load resumes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);
        
      if (error) throw error;
      
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
      
      toast({
        title: "Resume Deleted",
        description: "The resume has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditResume = (resumeId: string) => {
    // Navigate to the resume builder page with the selected resume ID
    navigate(`/resume/builder/${resumeId}`);
  };

  // Apply filters and search
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || resume.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-950 dark:to-purple-950">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="bg-resume-purple rounded-lg p-1.5">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">ResumeAI</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Home" onClick={() => navigate('/dashboard')}>
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="My Resumes" isActive={true}>
                      <FileText className="h-5 w-5" />
                      <span>My Resumes</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Applications" onClick={() => navigate('/applications')}>
                      <Briefcase className="h-5 w-5" />
                      <span>Applications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Analytics" onClick={() => navigate('/analytics')}>
                      <BarChart3 className="h-5 w-5" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarSeparator />
            
            <SidebarGroup>
              <SidebarGroupLabel>Resources</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Learn">
                      <BookOpen className="h-5 w-5" />
                      <span>Learning Center</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Templates" onClick={() => navigate('/templates')}>
                      <Layers className="h-5 w-5" />
                      <span>Templates</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" onClick={() => navigate('/settings')}>
                  <Cog className="h-5 w-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Account" onClick={() => navigate('/account')}>
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Log Out" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="container max-w-7xl mx-auto px-4 py-8">
            {/* Page Header */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
                  My Resumes
                </h1>
                <p className="text-resume-gray mt-1">Create, manage and optimize your professional resumes</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search resumes..." 
                    className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Button 
                  className="bg-resume-purple hover:bg-resume-purple-dark shadow-lg shadow-resume-purple/20"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Resume
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className={`flex flex-wrap gap-2 mb-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
              <Button 
                variant={activeFilter === 'all' ? "default" : "outline"} 
                size="sm" 
                className="rounded-full"
                onClick={() => handleFilterChange('all')}
              >
                <Filter className="mr-2 h-3 w-3" /> All Resumes
              </Button>
              <Button 
                variant={activeFilter === 'Modern' ? "default" : "outline"} 
                size="sm" 
                className="rounded-full"
                onClick={() => handleFilterChange('Modern')}
              >
                Modern
              </Button>
              <Button 
                variant={activeFilter === 'Creative' ? "default" : "outline"} 
                size="sm" 
                className="rounded-full"
                onClick={() => handleFilterChange('Creative')}
              >
                Creative
              </Button>
              <Button 
                variant={activeFilter === 'Professional' ? "default" : "outline"} 
                size="sm" 
                className="rounded-full"
                onClick={() => handleFilterChange('Professional')}
              >
                Professional
              </Button>
            </div>

            {/* Resumes Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
              {isLoading ? (
                // Loading skeleton
                Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="border border-gray-200 p-6 h-64 animate-pulse">
                    <div className="bg-gray-200 h-6 w-3/4 rounded mb-4"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded mb-6"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                      <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                      <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                      <div className="bg-gray-200 h-8 w-20 rounded"></div>
                      <div className="bg-gray-200 h-8 w-20 rounded"></div>
                    </div>
                  </Card>
                ))
              ) : filteredResumes.length > 0 ? (
                // Actual resume cards
                filteredResumes.map((resume) => (
                  <ResumeCard 
                    key={resume.id} 
                    resume={resume}
                    onEdit={() => handleEditResume(resume.id)}
                    onDelete={() => handleDeleteResume(resume.id)}
                  />
                ))
              ) : (
                // No results found
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="h-16 w-16 text-resume-gray/50 mb-4" />
                  <h3 className="text-xl font-medium text-resume-gray">No resumes found</h3>
                  <p className="text-resume-gray mt-2 mb-6">
                    {searchTerm ? 'Try a different search term or filter' : 'Create your first resume to get started'}
                  </p>
                  <Button 
                    className="bg-resume-purple hover:bg-resume-purple-dark shadow-lg shadow-resume-purple/20"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Resume
                  </Button>
                </div>
              )}

              {/* Add New Resume Card - only show when there are already some resumes */}
              {!isLoading && filteredResumes.length > 0 && (
                <Card 
                  className="border border-dashed border-purple-200 hover:border-purple-300 bg-transparent hover:bg-purple-50/30 flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 dashboard-card-hover"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <div className="rounded-full bg-purple-100 p-3 mb-3">
                    <Plus className="h-6 w-6 text-resume-purple" />
                  </div>
                  <p className="text-resume-purple font-medium">Create New Resume</p>
                  <p className="text-resume-gray text-sm text-center mt-2">Start from scratch or use a template</p>
                </Card>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
      
      {/* Create Resume Dialog */}
      <CreateResumeDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
        onResumeCreated={fetchResumes} 
      />
    </SidebarProvider>
  );
};

export default Resume;
