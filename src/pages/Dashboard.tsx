
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
  user_id: string;
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
            .select('id, user_id, current_rank, total_score, rank_tier, rank_category, last_updated')
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
          <div className="min-h-screen flex w-full bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <Sidebar className="bg-white/50 backdrop-blur-xl border-r border-primary/10">
              <SidebarHeader>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="rounded-xl p-2 bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Vireia AI</span>
                    <p className="text-xs text-muted-foreground">Your career companion</p>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent className="px-3">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-primary/70 font-semibold">Dashboard</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Home" isActive={true} className="bg-primary/10 text-primary border border-primary/20">
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="My Resumes" asChild className="hover:bg-primary/5">
                          <Link to="/resume">
                            <FileText className="h-5 w-5" />
                            <span>My Resumes</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Applications" asChild className="hover:bg-primary/5">
                          <Link to="/applications">
                            <Briefcase className="h-5 w-5" />
                            <span>Applications</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Analytics" asChild className="hover:bg-primary/5">
                          <Link to="/analytics">
                            <BarChart3 className="h-5 w-5" />
                            <span>Analytics</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="bg-primary/20" />

                <SidebarGroup>
                  <SidebarGroupLabel className="text-primary/70 font-semibold">Resources</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Learn" className="hover:bg-primary/5">
                          <BookOpen className="h-5 w-5" />
                          <span>Learning Center</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Templates" asChild className="hover:bg-primary/5">
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
                    <SidebarMenuButton tooltip="Settings" className="hover:bg-primary/5">
                      <Cog className="h-5 w-5" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Account" className="hover:bg-primary/5">
                      <User className="h-5 w-5" />
                      <span>Account</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Log Out" className="hover:bg-destructive/10 hover:text-destructive">
                      <LogOut className="h-5 w-5" />
                      <span>Log Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-transparent">
              <div className="container max-w-7xl mx-auto px-6 py-8">
                {/* Dynamic Welcome Section */}
                <div className={`mb-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
                  <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-primary/10 p-8 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                              Welcome back!
                            </h1>
                            <p className="text-muted-foreground">
                              {resumes.length > 0 
                                ? `You're making great progress with ${resumes.length} resume${resumes.length > 1 ? 's' : ''}`
                                : "Let's create your first impressive resume"
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={() => setShowCreateDialog(true)}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Resume
                          </Button>
                          {resumes.length > 0 && (
                            <Button variant="outline" asChild className="border-primary/20 hover:bg-primary/5">
                              <Link to={`/resume-builder/${resumes[0].id}`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Continue Editing
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Rank Badge */}
                      {userRanking && (
                        <div className="ml-8 text-center">
                          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
                            <div className="flex justify-center mb-2">
                              {getTierIcon(stats.rankTier)}
                            </div>
                            <div className="text-2xl font-bold text-primary">#{stats.currentRank}</div>
                            <div className="text-sm text-muted-foreground capitalize">{stats.rankTier} Tier</div>
                            <div className="text-xs text-primary/70 mt-1">{stats.totalScore} points</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className={`bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-white/90">Resumes Created</CardTitle>
                        <FileText className="h-8 w-8 text-white/80" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold mb-2">{stats.resumesCreated}</div>
                      <div className="text-xs text-white/80 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {stats.resumesCreated > 0 ? "Building your future!" : "Ready to start!"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`bg-white/60 backdrop-blur-xl border border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Global Rank</CardTitle>
                        <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                          {getTierIcon(stats.rankTier)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary mb-2">#{stats.currentRank || '🔜'}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Trophy className="h-3 w-3 mr-1 text-primary" />
                        <span className="capitalize">{stats.rankTier} tier</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`bg-white/60 backdrop-blur-xl border border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Achievement Score</CardTitle>
                        <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary mb-2">{stats.totalScore?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-primary" />
                        <span>Keep growing!</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`bg-white/60 backdrop-blur-xl border border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Time Saved</CardTitle>
                        <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary mb-2">{stats.timeSaved}h</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Star className="h-3 w-3 mr-1 text-primary" />
                        <span>Efficiency champion!</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Enhanced Leaderboard */}
                  <Card className={`lg:col-span-1 bg-white/60 backdrop-blur-xl border border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl">
                      <CardTitle className="text-primary flex items-center gap-2">
                        <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        Global Leaderboard
                      </CardTitle>
                      <CardDescription>Top performers worldwide</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {topPlayers.length > 0 ? (
                        <div className="space-y-4">
                          {topPlayers.slice(0, 5).map((player, index) => (
                            <div key={player.user_id} className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 hover:to-primary/5 transition-all duration-300 border border-primary/10">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                  'bg-gradient-to-br from-primary/80 to-primary text-white'
                                }`}>
                                  {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </div>
                                <div>
                                  <div className="font-semibold text-foreground">
                                    {player.user_id === userRanking?.user_id ? 'You!' : `Player #${player.current_rank}`}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    {getTierIcon(player.rank_tier)}
                                    <span className="capitalize font-medium">{player.rank_tier}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary text-lg">{player.total_score.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">points</div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Your Position Indicator */}
                          {userRanking && !topPlayers.some(p => p.user_id === userRanking.user_id) && (
                            <div className="mt-6 pt-4 border-t border-primary/20">
                              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/30">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
                                    #{userRanking.current_rank}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-primary">Your Position</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                      {getTierIcon(userRanking.rank_tier)}
                                      <span className="capitalize font-medium">{userRanking.rank_tier}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-primary text-lg">{userRanking.total_score.toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground">points</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                            <Trophy className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-muted-foreground mb-2 font-medium">Building leaderboard...</p>
                          <p className="text-sm text-muted-foreground/70">Rankings will appear here</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary">
                        <Trophy className="h-4 w-4 mr-2" />
                        View Full Rankings
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Enhanced Resumes Section */}
                  <Card className={`lg:col-span-2 bg-white/60 backdrop-blur-xl border border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '500ms' }}>
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-primary flex items-center gap-2">
                            <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            Your Resume Collection
                          </CardTitle>
                          <CardDescription>
                            {resumes.length > 0
                              ? `${resumes.length} resume${resumes.length > 1 ? 's' : ''} crafted with excellence`
                              : "Your journey to career success starts here"
                            }
                          </CardDescription>
                        </div>
                        {resumes.length > 0 && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{resumes.length}</div>
                            <div className="text-xs text-muted-foreground">resume{resumes.length > 1 ? 's' : ''}</div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {resumes.length > 0 ? (
                        <div className="space-y-4">
                          {/* Recently Edited Resume - Highlighted */}
                          {resumes[0] && (
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 group hover:shadow-lg transition-all duration-300">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                                    <Sparkles className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium text-primary/80 uppercase tracking-wide">Most Recent</div>
                                    <h3 className="font-semibold text-primary text-lg group-hover:text-primary/80 transition-colors">{resumes[0].title}</h3>
                                  </div>
                                </div>
                                <Button
                                  asChild
                                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg"
                                >
                                  <Link to={`/resume-builder/${resumes[0].id}`}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Continue Editing
                                  </Link>
                                </Button>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 rounded-full bg-white/50 text-primary font-medium capitalize">
                                    {resumes[0].template}
                                  </span>
                                  <span className="text-muted-foreground">
                                    Last edited: {formatDate(resumes[0].updated_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Other Resumes Grid */}
                          {resumes.length > 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {resumes.slice(1, 5).map((resume) => (
                                <Link
                                  key={resume.id}
                                  to={`/resume-builder/${resume.id}`}
                                  className="group block p-4 rounded-xl border border-primary/10 bg-white/50 hover:bg-white/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {resume.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {formatDate(resume.updated_at)}
                                      </p>
                                    </div>
                                    <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                                      <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="inline-block text-xs bg-primary/10 text-primary rounded-full px-3 py-1 capitalize font-medium">
                                      {resume.template}
                                    </span>
                                    <ChevronUp className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors rotate-90" />
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20">
                            <FileText className="h-10 w-10 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-3">Ready to shine? ✨</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Create your first professional resume with our AI-powered builder. 
                            Stand out from the crowd and land your dream job!
                          </p>
                          <Button
                            onClick={() => setShowCreateDialog(true)}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Your First Resume
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between gap-3">
                      <Button variant="outline" asChild className="border-primary/20 hover:bg-primary/5 text-primary">
                        <Link to="/resume">
                          <FileText className="h-4 w-4 mr-2" />
                          View All Resumes ({resumes.length})
                        </Link>
                      </Button>
                      <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Resume
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Additional Quick Actions Section */}
                {resumes.length > 0 && (
                  <div className="mt-8">
                    <Card className={`bg-white/60 backdrop-blur-xl border border-primary/10 shadow-xl ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
                      <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                          <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          Quick Actions
                        </CardTitle>
                        <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Button
                            variant="outline"
                            asChild
                            className="h-auto p-4 border-primary/20 hover:bg-primary/5 text-left justify-start"
                          >
                            <Link to="/templates">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                                  <Layers className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium text-primary">Browse Templates</div>
                                  <div className="text-xs text-muted-foreground">Find the perfect design</div>
                                </div>
                              </div>
                            </Link>
                          </Button>
                          
                          <Button
                            variant="outline"
                            asChild
                            className="h-auto p-4 border-primary/20 hover:bg-primary/5 text-left justify-start"
                          >
                            <Link to="/applications">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                                  <Briefcase className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium text-primary">Track Applications</div>
                                  <div className="text-xs text-muted-foreground">Manage your job search</div>
                                </div>
                              </div>
                            </Link>
                          </Button>
                          
                          <Button
                            variant="outline"
                            asChild
                            className="h-auto p-4 border-primary/20 hover:bg-primary/5 text-left justify-start"
                          >
                            <Link to="/analytics">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                                  <BarChart3 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium text-primary">View Analytics</div>
                                  <div className="text-xs text-muted-foreground">Track your progress</div>
                                </div>
                              </div>
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
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
