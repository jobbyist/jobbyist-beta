# Upskilling Programs Feature (formerly YUTE Academy)

## Overview
The Upskilling Programs feature is a comprehensive learning platform integrated into Jobbyist Beta that allows users to:
- Browse structured learning paths
- Take courses in various tech disciplines
- Earn achievement badges
- Join study circles and communities
- Track their learning progress

## Database Schema

### Tables Created

#### 1. `badges`
Stores achievement badges that users can earn.
- `id` (UUID, Primary Key)
- `name` (TEXT, UNIQUE) - Badge name
- `description` (TEXT) - Badge description
- `icon_url` (TEXT) - URL to badge icon
- `category` (TEXT) - One of: completion, achievement, skill, milestone
- `criteria` (TEXT) - Description of how to earn the badge
- `points` (INTEGER) - Points awarded for earning the badge
- Timestamps: `created_at`, `updated_at`

#### 2. `learning_paths`
Represents structured learning paths containing multiple courses.
- `id` (UUID, Primary Key)
- `title` (TEXT) - Path title
- `description` (TEXT) - Path description
- `difficulty_level` (TEXT) - beginner, intermediate, or advanced
- `estimated_duration_hours` (INTEGER) - Total hours to complete
- `icon_url` (TEXT) - Path icon URL
- `is_active` (BOOLEAN) - Whether the path is published
- Timestamps: `created_at`, `updated_at`

#### 3. `courses`
Individual courses within learning paths.
- `id` (UUID, Primary Key)
- `learning_path_id` (UUID, Foreign Key) - References learning_paths
- `title` (TEXT) - Course title
- `description` (TEXT) - Course description
- `difficulty_level` (TEXT) - beginner, intermediate, or advanced
- `estimated_duration_hours` (INTEGER) - Course duration
- `thumbnail_url` (TEXT) - Course thumbnail
- `instructor_name` (TEXT) - Instructor name
- `order_index` (INTEGER) - Order within the learning path
- `is_active` (BOOLEAN) - Whether the course is published
- Timestamps: `created_at`, `updated_at`

#### 4. `course_content`
Content modules/lessons within courses.
- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key) - References courses
- `title` (TEXT) - Content title
- `content_type` (TEXT) - video, article, quiz, exercise, or project
- `content_url` (TEXT) - URL to video or resource
- `content_text` (TEXT) - Text content for articles
- `duration_minutes` (INTEGER) - Content duration
- `order_index` (INTEGER) - Order within the course
- `is_free` (BOOLEAN) - Whether content requires subscription
- Timestamps: `created_at`, `updated_at`

#### 5. `circles`
Community study groups and networking circles.
- `id` (UUID, Primary Key)
- `name` (TEXT) - Circle name
- `description` (TEXT) - Circle description
- `circle_type` (TEXT) - study_group, mentorship, project, or networking
- `learning_path_id` (UUID, Foreign Key, Optional) - Associated learning path
- `max_members` (INTEGER) - Maximum member count
- `is_public` (BOOLEAN) - Public visibility
- `created_by` (UUID, Foreign Key) - Creator user ID
- Timestamps: `created_at`, `updated_at`

#### 6. `user_badges`
Junction table for user badge achievements.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key) - References auth.users
- `badge_id` (UUID, Foreign Key) - References badges
- `earned_at` (TIMESTAMP) - When the badge was earned
- UNIQUE constraint on (user_id, badge_id)

#### 7. `user_courses`
Tracks user course enrollment and progress.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key) - References auth.users
- `course_id` (UUID, Foreign Key) - References courses
- `progress_percentage` (INTEGER) - 0-100 completion percentage
- `status` (TEXT) - not_started, in_progress, or completed
- `started_at` (TIMESTAMP) - When user started the course
- `completed_at` (TIMESTAMP) - When user completed the course
- `last_accessed_at` (TIMESTAMP) - Last time user accessed the course
- UNIQUE constraint on (user_id, course_id)

#### 8. `user_course_content_progress`
Tracks completion of individual content items.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key) - References auth.users
- `course_content_id` (UUID, Foreign Key) - References course_content
- `is_completed` (BOOLEAN) - Completion status
- `completed_at` (TIMESTAMP) - When content was completed
- UNIQUE constraint on (user_id, course_content_id)

#### 9. `circle_members`
Junction table for circle membership.
- `id` (UUID, Primary Key)
- `circle_id` (UUID, Foreign Key) - References circles
- `user_id` (UUID, Foreign Key) - References auth.users
- `role` (TEXT) - member, moderator, or admin
- `joined_at` (TIMESTAMP) - When user joined the circle
- UNIQUE constraint on (circle_id, user_id)

## Seeded Data

### Badges (10 total)
1. First Step - Complete first course module (10 points)
2. Quick Learner - Complete 5 modules in a week (50 points)
3. Course Completer - Complete first full course (100 points)
4. Path Explorer - Start 3 different paths (75 points)
5. Dedicated Student - Complete 10 courses (500 points)
6. Master Developer - Complete all courses in a path (1000 points)
7. Community Helper - Join and participate in 3 circles (150 points)
8. Code Warrior - Complete all coding exercises in a course (200 points)
9. Early Bird - Study for 7 consecutive days (100 points)
10. Knowledge Sharer - Create a study circle (200 points)

### Learning Paths (8 total)
1. **Frontend Development** (Beginner, 120 hours)
   - 5 courses: HTML/CSS Fundamentals, JavaScript Essentials, React.js Mastery, TypeScript for React, Advanced React Patterns

2. **Backend Development** (Intermediate, 150 hours)
   - 5 courses: Node.js Fundamentals, Database Design & SQL, RESTful API Development, Python for Backend, Microservices Architecture

3. **Full Stack Development** (Intermediate, 200 hours)

4. **Data Science & Analytics** (Intermediate, 180 hours)
   - 5 courses: Python for Data Science, Data Visualization, Machine Learning Basics, Deep Learning with TensorFlow, Big Data Analytics

5. **DevOps & Cloud** (Advanced, 140 hours)
   - 5 courses: Git & Version Control, Docker Fundamentals, Kubernetes Essentials, CI/CD Pipeline Automation, AWS Cloud Practitioner

6. **Mobile Development** (Intermediate, 160 hours)
   - 5 courses: React Native Basics, iOS Development with Swift, Android Development with Kotlin, Mobile App Design Patterns, Mobile Performance Optimization

7. **UI/UX Design** (Beginner, 100 hours)
   - 5 courses: Design Thinking Fundamentals, Figma for UI Design, User Research Methods, Interaction Design, Design Systems & Components

8. **Digital Marketing** (Beginner, 80 hours)
   - 5 courses: SEO Fundamentals, Social Media Marketing, Content Marketing Strategy, Google Ads & PPC, Email Marketing Automation

### Sample Circles (10 total)
1. React Beginners Study Group (Study Group, 30 members)
2. Frontend Developers Network (Networking, 100 members)
3. Data Science Project Collaboration (Project, 20 members)
4. Career Mentorship Circle (Mentorship, 50 members)
5. DevOps Best Practices (Study Group, 40 members)
6. Mobile Dev Community (Networking, 60 members)
7. UI/UX Design Critique (Study Group, 35 members)
8. Freelance Developer Hub (Networking, 80 members)
9. Algorithm Study Group (Study Group, 25 members)
10. Web3 & Blockchain Explorers (Project, 30 members)

### Sample Course Content
HTML & CSS Fundamentals course includes 10 sample content items:
1. Introduction to HTML (Video, 15 min)
2. HTML Document Structure (Article, 20 min)
3. Working with Text and Links (Video, 25 min)
4. HTML Forms and Input Elements (Video, 30 min)
5. CSS Basics and Selectors (Video, 20 min)
6. CSS Box Model Deep Dive (Article, 25 min)
7. Flexbox Layout System (Video, 35 min)
8. CSS Grid Fundamentals (Video, 40 min)
9. Responsive Design with Media Queries (Video, 30 min)
10. Build Your First Web Page (Project, 120 min)

## Frontend Implementation

### Pages
- `/upskilling` - Main Upskilling Programs page with tabs for:
  - Learning Paths browser
  - Study Circles directory
  - Badge achievements showcase

### Features
- Tabbed interface for browsing different aspects of the platform
- Difficulty level badges (Beginner, Intermediate, Advanced)
- Duration indicators for courses
- Course count per learning path
- Circle type indicators (Study Group, Mentorship, Project, Networking)
- User badge showcase for authenticated users
- Responsive design for mobile and desktop

### Navigation
- Added "Upskilling Programs" link in main header navigation
- Featured section on homepage with overview and call-to-action
- Direct links from job search to upskilling for career advancement

## Security (Row Level Security)

All tables have RLS enabled with appropriate policies:
- **Public read access**: Badges, Learning Paths, Courses, Course Content, Public Circles
- **User-specific access**: User badges, course progress, content progress
- **Creator access**: Circle creators can manage their circles
- **Member access**: Users can join/leave circles

## Future Enhancements

Potential improvements for the platform:
1. Video player integration for course content
2. Quiz and exercise submission system
3. Certificate generation upon course completion
4. Leaderboard based on badge points
5. Circle chat/discussion forums
6. Course reviews and ratings
7. Instructor profiles and bios
8. Learning path recommendations based on job goals
9. Integration with job applications (show relevant courses on job listings)
10. Course completion certificates on user profiles

## Migration Files

- `20251003041434_create_upskilling_programs.sql` - Creates all tables and RLS policies
- `20251003041435_seed_upskilling_programs.sql` - Seeds initial data

## Usage

To apply the migrations to your Supabase instance:

```bash
# Using Supabase CLI
supabase db push

# Or run migrations manually through Supabase dashboard
# Copy the SQL from the migration files and execute in the SQL editor
```

## Notes

- The feature name was changed from "YUTE Academy" to "Upskilling Programs" as requested
- All badge constraints are properly handled with UNIQUE constraints
- The database schema is designed to scale and support additional features
- Sample data provides a complete user experience for testing
