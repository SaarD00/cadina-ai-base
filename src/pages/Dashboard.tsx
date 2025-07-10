
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ChevronUp, Users, BarChart3, Clock, Briefcase, Home, Cog, User, BookOpen, Layers, LogOut, Plus, Sparkles, Heart, Star, Zap, Trophy, Medal, Crown, Award } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import OnboardingFlow from '@/components/OnboardingFlow';
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
import CreateResumeDialog from '@/components/CreateResumeDialog';

interface Resume {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  template: string;
}

interface UserRanking {
  id: string;
  current_rank: number;
  total_score: number;
  rank_tier: string;
  rank_category: string;
  last_updated: string;
}

interface TopPlayer {
  user_id: string;
  current_rank: number;
  total_score: number;
  rank_tier: string;
}

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch user's resumes
          const { data: resumesData, error: resumesError } = await supabase
            .from('resumes')
            .select('id, title, created_at, updated_at, template')
            .eq('user_id', session.user.id)
            .order('updated_at', { ascending: false });

          if (resumesError) {
            console.error('Error fetching resumes:', resumesError);
          } else {
            setResumes(resumesData || []);
          }

          // Fetch user's ranking data
          const { data: rankingData, error: rankingError } = await supabase
            .from('user_rankings')
            .select('id, current_rank, total_score, rank_tier, rank_category, last_updated')
            .eq('user_id', session.user.id)
            .eq('rank_category', 'overall')
            .single();

          if (rankingError && rankingError.code !== 'PGRST116') {
            console.error('Error fetching user ranking:', rankingError);
          } else {
            setUserRanking(rankingData);
          }

          // Fetch top players for leaderboard
          const { data: topPlayersData, error: topPlayersError } = await supabase
            .from('user_rankings')
            .select('user_id, current_rank, total_score, rank_tier')
            .eq('rank_category', 'overall')
            .order('current_rank', { ascending: true })
            .limit(5);

          if (topPlayersError) {
            console.error('Error fetching top players:', topPlayersError);
          } else {
            setTopPlayers(topPlayersData || []);
          }
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoadingData(false);
      }
    };

    // Check if this is the first time user is visiting the dashboard
    const hasVisitedBefore = localStorage.getItem('dashboardVisited');

    if (!hasVisitedBefore) {
      setShowOnboarding(true);
      setFirstVisit(true);
    } else {
      setFirstVisit(false);
    }

    setIsLoaded(true);
    initializeDashboard();

    // Add a small delay before showing any toast notifications for better UX
    const timer = setTimeout(() => {
      if (!hasVisitedBefore) {
        toast({
          title: "Welcome to your dashboard",
          description: "Let's create something amazing together!"
        });
      } else {
        toast({
          title: "Welcome back! 🎉",
          description: "Ready to boost your career today?"
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [toast]);

  const calculateStats = () => {
    const currentRank = userRanking?.current_rank || 0;
    const totalScore = userRanking?.total_score || 0;
    const rankTier = userRanking?.rank_tier || 'bronze';

    return {
      resumesCreated: resumes.length,
      currentRank,
      totalScore,
      rankTier,
      timeSaved: Math.max(resumes.length * 2, 1) // Assume 2 hours saved per resume
    };
  };

  const stats = calculateStats();

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('dashboardVisited', 'true');
    toast({
      title: "You're all set! 🚀",
      description: "Time to create your first amazing resume!"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const EmptyStateCard = ({ title, description, icon: Icon, action }: any) => (
    <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-gray-50/50 hover:from-gray-100/50 hover:to-gray-100/50 transition-all duration-300 group">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {action}
      </CardContent>
    </Card>
  );

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond': return <Crown className="h-5 w-5" style={{ color: '#7c3bed' }} />;
      case 'platinum': return <Trophy className="h-5 w-5" style={{ color: '#7c3bed' }} />;
      case 'gold': return <Medal className="h-5 w-5" style={{ color: '#7c3bed' }} />;
      case 'silver': return <Award className="h-5 w-5" style={{ color: '#7c3bed' }} />;
      default: return <Star className="h-5 w-5" style={{ color: '#7c3bed' }} />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return '#9333ea';
      case 'platinum': return '#374151';
      case 'gold': return '#f59e0b';
      case 'silver': return '#6b7280';
      default: return '#cd7c0f';
    }
  };

  return (
    <>
      {showOnboarding && (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}

      {!showOnboarding && (
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full" style={{ backgroundColor: '#9c87fb' }}>
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="rounded-lg p-1.5" style={{ backgroundColor: '#9c87fb' }}>
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-[#9c87fb]">Vireia AI</span>
                </div>
              </SidebarHeader>

              <SidebarContent className="px-2">
                <SidebarGroup>
                  <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Home" isActive={true}>
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="My Resumes" asChild>
                          <Link to="/resume">
                            <FileText className="h-5 w-5" />
                            <span>My Resumes</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Applications" asChild>
                          <Link to="/applications">
                            <Briefcase className="h-5 w-5" />
                            <span>Applications</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Analytics" asChild>
                          <Link to="/analytics">
                            <BarChart3 className="h-5 w-5" />
                            <span>Analytics</span>
                          </Link>
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
                        <SidebarMenuButton tooltip="Templates" asChild>
                          <Link to="/templates">
                            <Layers className="h-5 w-5" />
                            <span>Templates</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Cog className="h-5 w-5" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Account">
                      <User className="h-5 w-5" />
                      <span>Account</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Log Out">
                      <LogOut className="h-5 w-5" />
                      <span>Log Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset>
              <div className="container max-w-7xl mx-auto px-4 py-8">
                {/* Dashboard Header */}
                <div className={`flex items-center justify-between mb-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
                  <div>
                    <h1 className="text-4xl font-bold text-[#9c87fb]">
                      Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                      {resumes.length > 0
                        ? `Welcome back! You have ${resumes.length} resume${resumes.length > 1 ? 's' : ''} ready to go! `
                        : "Ready to create something amazing? Let's build your first resume! ✨"
                      }
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ backgroundColor: '#9c87fb' }}
                      onClick={() => setShowCreateDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Resume
                    </Button>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className={`border-0 shadow-lg text-white hover:shadow-xl transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ backgroundColor: '#9b87f6' }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Resumes Created</CardTitle>
                      <FileText className="h-5 w-5 text-white/80" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.resumesCreated}</div>
                      <div className="text-xs text-white/80 mt-1 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        <span>Ready to impress!</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-0 shadow-lg bg-white text-gray-700 hover:shadow-xl transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Current Rank</CardTitle>
                      {getTierIcon(stats.rankTier)}
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">#{stats.currentRank || '🔜'}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Trophy className="h-3 w-3 mr-1" style={{ color: getTierColor(stats.rankTier) }} />
                        <span className="capitalize">{stats.rankTier} tier</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-0 shadow-lg bg-white text-gray-700 hover:shadow-xl transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Score</CardTitle>
                      <BarChart3 className="h-5 w-5" style={{ color: '#7c3bed' }} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">{stats.totalScore?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Zap className="h-3 w-3 mr-1" style={{ color: '#7c3bed' }} />
                        <span>Climbing higher!</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-0 shadow-lg bg-white text-gray-700 hover:shadow-xl transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Time Saved</CardTitle>
                      <Clock className="h-5 w-5" style={{ color: '#7c3bed' }} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">{stats.timeSaved}h</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Star className="h-3 w-3 mr-1" style={{ color: '#7c3bed' }} />
                        <span>Efficiency master!</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Ranking Leaderboard */}
                  <Card className={`lg:col-span-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
                    <CardHeader>
                      <CardTitle className="text-[#9c87fb] flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Top Leaderboard
                      </CardTitle>
                      <CardDescription>See where you rank among the best</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topPlayers.length > 0 ? (
                        <div className="space-y-4">
                          {topPlayers.slice(0, 5).map((player, index) => (
                            <div key={player.user_id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                  index === 1 ? 'bg-gray-100 text-gray-700' :
                                  index === 2 ? 'bg-orange-100 text-orange-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">Player #{player.current_rank}</div>
                                  <div className="text-xs text-gray-500 flex items-center gap-1">
                                    {getTierIcon(player.rank_tier)}
                                    <span className="capitalize">{player.rank_tier}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">{player.total_score.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">points</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#9c87fb' }}>
                            <Trophy className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-gray-600 mb-2">Leaderboard loading...</p>
                          <p className="text-sm text-gray-500">Rankings will appear here</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full text-[#7c3bed] hover:bg-[#f4f1f8]">
                        View Full Leaderboard
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Resumes Section */}
                  <Card className={`lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '500ms' }}>
                    <CardHeader>
                      <CardTitle className="text-[#9c87fb]">Your Resumes</CardTitle>
                      <CardDescription>
                        {resumes.length > 0
                          ? `${resumes.length} resume${resumes.length > 1 ? 's' : ''} ready to land your dream job!`
                          : "Ready to create your first masterpiece?"
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {resumes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resumes.slice(0, 4).map((resume) => (
                            <div
                              key={resume.id}
                              className="group relative p-4 rounded-lg border border-gray-100 hover:border-gray-300 bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
                              style={{ backgroundColor: '#f4f1f8' }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-800 group-hover:text-[#9c87fb] transition-colors">{resume.title}</h3>
                                  <p className="text-xs text-gray-500 mt-1">Last edited: {formatDate(resume.updated_at)}</p>
                                </div>
                                <div className="rounded-full p-2" style={{ backgroundColor: '#9c87fb' }}>
                                  <FileText className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="mt-3">
                                <span className="inline-block text-xs text-white rounded-full px-2 py-1 capitalize" style={{ backgroundColor: '#9c87fb' }}>
                                  {resume.template}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyStateCard
                          title="No resumes yet? Let's fix that! 🎨"
                          description="Create your first resume in just a few clicks. Our AI will help you craft something amazing!"
                          icon={FileText}
                          action={
                            <Button
                              className="text-white"
                              style={{ backgroundColor: '#9c87fb' }}
                              onClick={() => setShowCreateDialog(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create My First Resume
                            </Button>
                          }
                        />
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Link to="/resume">
                        <Button variant="ghost" className="text-[#7c3bed] hover:bg-[#f4f1f8]">
                          View All Resumes
                        </Button>
                      </Link>
                      <Button
                        className="text-white shadow-lg"
                        style={{ backgroundColor: '#9b87f6' }}
                        onClick={() => setShowCreateDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Resume
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </SidebarInset>
          </div>

          {/* Create Resume Dialog */}
          <CreateResumeDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </SidebarProvider>
      )}
    </>
  );
};

export default Dashboard;
