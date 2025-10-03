import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  BookOpen,
  Award,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Trophy,
  Target,
  Sparkles,
  Play,
  CheckCircle,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Footer from '@/components/Footer';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration_hours: number;
  icon_url: string | null;
}

interface Course {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration_hours: number;
  instructor_name: string;
  order_index: number;
}

interface Circle {
  id: string;
  name: string;
  description: string;
  circle_type: string;
  max_members: number;
  is_public: boolean;
}

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  category: string;
  points: number;
}

const UpskillingPrograms = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch learning paths
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (pathsError) throw pathsError;
      setLearningPaths(pathsData || []);

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Fetch circles
      const { data: circlesData, error: circlesError } = await supabase
        .from('circles')
        .select('*')
        .eq('is_public', true)
        .limit(6);

      if (circlesError) throw circlesError;
      setCircles(circlesData || []);

      // Fetch user badges if authenticated
      if (user) {
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            badge_id,
            badges (
              id,
              name,
              description,
              icon_url,
              category,
              points
            )
          `)
          .eq('user_id', user.id);

        if (badgesError) throw badgesError;
        const badges = badgesData?.map((item: any) => item.badges).filter(Boolean) || [];
        setUserBadges(badges);
      }
    } catch (error) {
      console.error('Error fetching upskilling data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getCircleTypeIcon = (type: string) => {
    switch (type) {
      case 'study_group': return <BookOpen className="h-4 w-4" />;
      case 'mentorship': return <Users className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      case 'networking': return <Sparkles className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/JOBBYIST.svg" alt="Jobbyist Logo" style={{ width: '200px', height: 'auto' }} />
            </Link>
            
            <div className="flex items-center gap-2 md:gap-4">
              {user && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/profile">
                      <UserIcon className="h-4 w-4 mr-1 md:mr-2" />
                      {isMobile 
                        ? (user.email?.split('@')[0]?.substring(0, 8) + (user.email?.split('@')[0]?.length > 8 ? '...' : ''))
                        : user.email
                      }
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-1 md:mr-2" />
                    {isMobile ? 'Out' : 'Sign Out'}
                  </Button>
                </div>
              )}
              {!user && (
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
            <GraduationCap className="h-5 w-5" />
            <span className="font-semibold">Upskilling Programs</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Level Up Your Career
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Access world-class courses, earn badges, and connect with a community of learners. 
            Build the skills employers are looking for in today's job market.
          </p>

          {!user && (
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/auth">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Learning Free
              </Link>
            </Button>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{learningPaths.length}</div>
              <div className="text-muted-foreground">Learning Paths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{courses.length}</div>
              <div className="text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{circles.length}+</div>
              <div className="text-muted-foreground">Study Circles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10</div>
              <div className="text-muted-foreground">Badges to Earn</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="paths" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="paths">
                <BookOpen className="h-4 w-4 mr-2" />
                {!isMobile && 'Learning Paths'}
              </TabsTrigger>
              <TabsTrigger value="circles">
                <Users className="h-4 w-4 mr-2" />
                {!isMobile && 'Circles'}
              </TabsTrigger>
              <TabsTrigger value="badges">
                <Award className="h-4 w-4 mr-2" />
                {!isMobile && 'Badges'}
              </TabsTrigger>
            </TabsList>

            {/* Learning Paths Tab */}
            <TabsContent value="paths" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Learning Path</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Structured learning paths designed by industry experts. Start from the basics or jump to advanced topics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningPaths.map((path) => {
                  const pathCourses = courses.filter(c => c.learning_path_id === path.id);
                  
                  return (
                    <Card key={path.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-primary" />
                          </div>
                          <Badge variant="outline" className={getDifficultyColor(path.difficulty_level)}>
                            {path.difficulty_level}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{path.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{path.estimated_duration_hours}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{pathCourses.length} courses</span>
                            </div>
                          </div>
                          <Button className="w-full" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Start Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Circles Tab */}
            <TabsContent value="circles" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Join Study Circles</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Connect with fellow learners, share knowledge, and grow together in our community circles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {circles.map((circle) => (
                  <Card key={circle.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          {getCircleTypeIcon(circle.circle_type)}
                        </div>
                        <Badge variant="secondary">
                          {circle.circle_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{circle.name}</CardTitle>
                      <CardDescription className="line-clamp-3">{circle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Max {circle.max_members} members</span>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          Join Circle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Earn Achievement Badges</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Complete courses, help others, and unlock exclusive badges that showcase your skills.
                </p>
              </div>

              {user && userBadges.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    Your Badges ({userBadges.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {userBadges.map((badge) => (
                      <Card key={badge.id} className="text-center p-4">
                        <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground">{badge.points} pts</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">Available Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['First Step', 'Quick Learner', 'Course Completer', 'Path Explorer', 'Dedicated Student', 'Master Developer'].map((badgeName, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{badgeName}</CardTitle>
                            <CardDescription>
                              {badgeName === 'First Step' && 'Complete your first course module'}
                              {badgeName === 'Quick Learner' && 'Complete 5 modules in a week'}
                              {badgeName === 'Course Completer' && 'Complete your first full course'}
                              {badgeName === 'Path Explorer' && 'Start 3 different learning paths'}
                              {badgeName === 'Dedicated Student' && 'Complete 10 courses'}
                              {badgeName === 'Master Developer' && 'Complete all courses in a path'}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of learners who are upskilling and advancing their careers with our programs.
            </p>
            {!user && (
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/auth">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Started for Free
                </Link>
              </Button>
            )}
            {user && (
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/jobs">
                  <ChevronRight className="h-5 w-5 mr-2" />
                  Find Your Next Job
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UpskillingPrograms;
