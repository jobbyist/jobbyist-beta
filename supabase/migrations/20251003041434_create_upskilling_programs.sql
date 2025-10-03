-- Create Upskilling Programs Feature (formerly YUTE Academy)
-- This migration creates all necessary tables for the learning platform

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  category TEXT CHECK (category IN ('completion', 'achievement', 'skill', 'milestone')),
  criteria TEXT, -- JSON or text describing how to earn this badge
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning paths table
CREATE TABLE public.learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_hours INTEGER,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_hours INTEGER,
  thumbnail_url TEXT,
  instructor_name TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0, -- Order within the learning path
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course content table (modules/lessons within courses)
CREATE TABLE public.course_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('video', 'article', 'quiz', 'exercise', 'project')),
  content_url TEXT, -- URL to video, article, or resource
  content_text TEXT, -- Text content for articles or descriptions
  duration_minutes INTEGER,
  order_index INTEGER DEFAULT 0, -- Order within the course
  is_free BOOLEAN DEFAULT true, -- Whether this content is free or requires subscription
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create circles table (community/study groups)
CREATE TABLE public.circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  circle_type TEXT CHECK (circle_type IN ('study_group', 'mentorship', 'project', 'networking')),
  learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE SET NULL,
  max_members INTEGER DEFAULT 50,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user badges junction table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create user courses progress table
CREATE TABLE public.user_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create user course content progress table
CREATE TABLE public.user_course_content_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_content_id UUID NOT NULL REFERENCES public.course_content(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_content_id)
);

-- Create circle members junction table
CREATE TABLE public.circle_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('member', 'moderator', 'admin')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(circle_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for badges (public read)
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);

-- Create RLS policies for learning paths (public read)
CREATE POLICY "Learning paths are viewable by everyone" ON public.learning_paths FOR SELECT USING (is_active = true);

-- Create RLS policies for courses (public read)
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (is_active = true);

-- Create RLS policies for course content (public read for free content)
CREATE POLICY "Course content is viewable by everyone" ON public.course_content FOR SELECT USING (true);

-- Create RLS policies for circles
CREATE POLICY "Public circles are viewable by everyone" ON public.circles FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create circles" ON public.circles FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Circle creators can update their circles" ON public.circles FOR UPDATE USING (auth.uid() = created_by);

-- Create RLS policies for user badges
CREATE POLICY "Users can view all badges earned" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can award badges" ON public.user_badges FOR INSERT WITH CHECK (true); -- Will be restricted via API

-- Create RLS policies for user courses
CREATE POLICY "Users can view their own course progress" ON public.user_courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own course enrollment" ON public.user_courses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own course progress" ON public.user_courses FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user course content progress
CREATE POLICY "Users can view their own content progress" ON public.user_course_content_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own content progress" ON public.user_course_content_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own content progress" ON public.user_course_content_progress FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for circle members
CREATE POLICY "Users can view circle members" ON public.circle_members FOR SELECT USING (true);
CREATE POLICY "Users can join circles" ON public.circle_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave circles" ON public.circle_members FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_badges_updated_at
  BEFORE UPDATE ON public.badges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_content_updated_at
  BEFORE UPDATE ON public.course_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_circles_updated_at
  BEFORE UPDATE ON public.circles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_courses_learning_path_id ON public.courses(learning_path_id);
CREATE INDEX idx_courses_order ON public.courses(order_index);
CREATE INDEX idx_course_content_course_id ON public.course_content(course_id);
CREATE INDEX idx_course_content_order ON public.course_content(order_index);
CREATE INDEX idx_circles_learning_path_id ON public.circles(learning_path_id);
CREATE INDEX idx_circles_created_by ON public.circles(created_by);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON public.user_badges(badge_id);
CREATE INDEX idx_user_courses_user_id ON public.user_courses(user_id);
CREATE INDEX idx_user_courses_course_id ON public.user_courses(course_id);
CREATE INDEX idx_user_course_content_progress_user_id ON public.user_course_content_progress(user_id);
CREATE INDEX idx_user_course_content_progress_course_content_id ON public.user_course_content_progress(course_content_id);
CREATE INDEX idx_circle_members_circle_id ON public.circle_members(circle_id);
CREATE INDEX idx_circle_members_user_id ON public.circle_members(user_id);
