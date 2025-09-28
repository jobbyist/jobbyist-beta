import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  User, 
  Briefcase, 
  LogOut, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  LinkedinIcon,
  Edit3,
  Save,
  X,
  Heart,
  FileText,
  Settings
} from 'lucide-react';
import Footer from '@/components/Footer';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  bio?: string;
  created_at: string;
}

interface SavedJob {
  id: string;
  job_id: string;
  created_at: string;
  jobs: {
    title: string;
    company: string;
    location: string;
    job_type: string;
    created_at: string;
  };
}

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(true);
  
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    location: '',
    linkedin_url: '',
    bio: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchProfile();
    fetchSavedJobs();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      if (data) {
        setProfile(data);
        setEditForm({
          full_name: data.full_name || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin_url: data.linkedin_url || '',
          bio: data.bio || ''
        });
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user?.id,
            email: user?.email,
            full_name: user?.user_metadata?.full_name || '',
          }])
          .select()
          .single();

        if (createError) throw createError;
        
        setProfile(newProfile);
        setEditForm({
          full_name: newProfile.full_name || '',
          phone: '',
          location: '',
          linkedin_url: '',
          bio: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          job_id,
          created_at,
          jobs (
            title,
            company,
            location,
            job_type,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load saved jobs",
        variant: "destructive",
      });
    } finally {
      setLoadingSavedJobs(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          email: user?.email,
          ...editForm,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...editForm } : null);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSavedJob = async (savedJobId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', savedJobId);

      if (error) throw error;

      setSavedJobs(prev => prev.filter(job => job.id !== savedJobId));
      
      toast({
        title: "Success",
        description: "Job removed from saved list",
      });
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast({
        title: "Error",
        description: "Failed to remove saved job",
        variant: "destructive",
      });
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" />
              {!isMobile && (
                <>
                  <h1 className="text-2xl font-bold text-foreground">Jobbyist</h1>
                  <Badge variant="secondary" className="ml-2">Beta</Badge>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <FileText className="h-4 w-4 mr-1 md:mr-2" />
                  {isMobile ? 'Jobs' : 'Browse Jobs'}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1 md:mr-2" />
                {isMobile ? 'Out' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Manage your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user.email || ''}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Enter your location"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                        <Input
                          id="linkedin_url"
                          value={editForm.linkedin_url}
                          onChange={(e) => setEditForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                          placeholder="https://linkedin.com/in/your-profile"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      
                      {profile?.full_name && (
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.full_name}</span>
                        </div>
                      )}
                      
                      {profile?.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      
                      {profile?.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      
                      {profile?.linkedin_url && (
                        <div className="flex items-center gap-3">
                          <LinkedinIcon className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={profile.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View LinkedIn Profile
                          </a>
                        </div>
                      )}
                      
                      {profile?.bio && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Bio</p>
                          <p className="text-muted-foreground">{profile.bio}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined {new Date(profile?.created_at || user.created_at).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Saved Jobs */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Saved Jobs
                    <Badge variant="secondary">{savedJobs.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSavedJobs ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading saved jobs...</p>
                    </div>
                  ) : savedJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No saved jobs yet</p>
                      <Button asChild variant="link" className="mt-2">
                        <Link to="/">Browse Jobs</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedJobs.slice(0, 5).map((savedJob) => (
                        <div key={savedJob.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{savedJob.jobs.title}</h4>
                              <p className="text-xs text-muted-foreground">{savedJob.jobs.company}</p>
                              <p className="text-xs text-muted-foreground">{savedJob.jobs.location}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSavedJob(savedJob.id)}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {savedJobs.length > 5 && (
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/saved-jobs">View All Saved Jobs</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;