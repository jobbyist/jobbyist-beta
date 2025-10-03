-- Seed data for Upskilling Programs (formerly YUTE Academy)

-- Insert Badges
INSERT INTO public.badges (name, description, icon_url, category, criteria, points) VALUES
('First Step', 'Complete your first course module', NULL, 'milestone', 'Complete 1 course content item', 10),
('Quick Learner', 'Complete 5 course modules in a week', NULL, 'achievement', 'Complete 5 modules within 7 days', 50),
('Course Completer', 'Complete your first full course', NULL, 'completion', 'Complete all modules in a course', 100),
('Path Explorer', 'Start learning in 3 different paths', NULL, 'achievement', 'Enroll in courses from 3 different learning paths', 75),
('Dedicated Student', 'Complete 10 courses', NULL, 'achievement', 'Complete 10 full courses', 500),
('Master Developer', 'Complete all courses in a learning path', NULL, 'completion', 'Complete every course in one learning path', 1000),
('Community Helper', 'Join and participate in 3 circles', NULL, 'achievement', 'Be an active member in 3 study circles', 150),
('Code Warrior', 'Complete all coding exercises in a course', NULL, 'skill', 'Complete all coding exercises with passing grades', 200),
('Early Bird', 'Study for 7 consecutive days', NULL, 'milestone', 'Access courses for 7 days in a row', 100),
('Knowledge Sharer', 'Create a study circle', NULL, 'achievement', 'Create and manage a study circle', 200);

-- Insert Learning Paths
INSERT INTO public.learning_paths (title, description, difficulty_level, estimated_duration_hours, is_active) VALUES
(
  'Frontend Development',
  'Master modern web development with React, TypeScript, and responsive design. Build beautiful, interactive user interfaces that work across all devices.',
  'beginner',
  120,
  true
),
(
  'Backend Development',
  'Learn server-side programming, databases, and API design. Build scalable, secure backend systems using Node.js, Python, and cloud technologies.',
  'intermediate',
  150,
  true
),
(
  'Full Stack Development',
  'Combine frontend and backend skills to build complete web applications. Learn the entire development cycle from database to deployment.',
  'intermediate',
  200,
  true
),
(
  'Data Science & Analytics',
  'Master data analysis, visualization, and machine learning. Use Python, SQL, and modern tools to extract insights from data.',
  'intermediate',
  180,
  true
),
(
  'DevOps & Cloud',
  'Learn deployment, CI/CD, and cloud infrastructure. Master Docker, Kubernetes, AWS, and modern DevOps practices.',
  'advanced',
  140,
  true
),
(
  'Mobile Development',
  'Build native and cross-platform mobile apps. Learn React Native, iOS, and Android development.',
  'intermediate',
  160,
  true
),
(
  'UI/UX Design',
  'Master user interface and user experience design. Learn Figma, design thinking, and user research methodologies.',
  'beginner',
  100,
  true
),
(
  'Digital Marketing',
  'Learn SEO, social media marketing, content strategy, and digital advertising to grow online presence.',
  'beginner',
  80,
  true
);

-- Get learning path IDs for course insertion
DO $$
DECLARE
  frontend_path_id UUID;
  backend_path_id UUID;
  fullstack_path_id UUID;
  datascience_path_id UUID;
  devops_path_id UUID;
  mobile_path_id UUID;
  uiux_path_id UUID;
  marketing_path_id UUID;
BEGIN
  -- Get path IDs
  SELECT id INTO frontend_path_id FROM public.learning_paths WHERE title = 'Frontend Development';
  SELECT id INTO backend_path_id FROM public.learning_paths WHERE title = 'Backend Development';
  SELECT id INTO fullstack_path_id FROM public.learning_paths WHERE title = 'Full Stack Development';
  SELECT id INTO datascience_path_id FROM public.learning_paths WHERE title = 'Data Science & Analytics';
  SELECT id INTO devops_path_id FROM public.learning_paths WHERE title = 'DevOps & Cloud';
  SELECT id INTO mobile_path_id FROM public.learning_paths WHERE title = 'Mobile Development';
  SELECT id INTO uiux_path_id FROM public.learning_paths WHERE title = 'UI/UX Design';
  SELECT id INTO marketing_path_id FROM public.learning_paths WHERE title = 'Digital Marketing';

  -- Insert Frontend Development Courses
  INSERT INTO public.courses (learning_path_id, title, description, difficulty_level, estimated_duration_hours, instructor_name, order_index, is_active) VALUES
  (frontend_path_id, 'HTML & CSS Fundamentals', 'Master the building blocks of web development. Learn semantic HTML, modern CSS, Flexbox, and Grid layout systems.', 'beginner', 20, 'Sarah Johnson', 1, true),
  (frontend_path_id, 'JavaScript Essentials', 'Learn JavaScript from basics to advanced concepts. Understand DOM manipulation, async programming, and ES6+ features.', 'beginner', 30, 'Michael Chen', 2, true),
  (frontend_path_id, 'React.js Mastery', 'Build dynamic web applications with React. Learn hooks, state management, routing, and best practices.', 'intermediate', 40, 'Emily Rodriguez', 3, true),
  (frontend_path_id, 'TypeScript for React', 'Add type safety to your React applications. Master TypeScript fundamentals and React-specific patterns.', 'intermediate', 25, 'David Kim', 4, true),
  (frontend_path_id, 'Advanced React Patterns', 'Master advanced React concepts including performance optimization, custom hooks, and architecture patterns.', 'advanced', 30, 'Jessica Lee', 5, true);

  -- Insert Backend Development Courses
  INSERT INTO public.courses (learning_path_id, title, description, difficulty_level, estimated_duration_hours, instructor_name, order_index, is_active) VALUES
  (backend_path_id, 'Node.js Fundamentals', 'Learn server-side JavaScript with Node.js. Understand async programming, event loop, and building REST APIs.', 'beginner', 25, 'James Wilson', 1, true),
  (backend_path_id, 'Database Design & SQL', 'Master relational databases, SQL queries, and database design principles. Learn PostgreSQL and optimization.', 'intermediate', 30, 'Maria Garcia', 2, true),
  (backend_path_id, 'RESTful API Development', 'Build scalable REST APIs with Express.js. Learn authentication, validation, and API best practices.', 'intermediate', 35, 'Robert Brown', 3, true),
  (backend_path_id, 'Python for Backend', 'Learn backend development with Python and Flask/Django. Build robust server applications.', 'intermediate', 40, 'Amanda Taylor', 4, true),
  (backend_path_id, 'Microservices Architecture', 'Design and build microservices. Learn service communication, API gateways, and distributed systems.', 'advanced', 45, 'Chris Anderson', 5, true);

  -- Insert Data Science Courses
  INSERT INTO public.courses (learning_path_id, title, description, difficulty_level, estimated_duration_hours, instructor_name, order_index, is_active) VALUES
  (datascience_path_id, 'Python for Data Science', 'Learn Python programming for data analysis. Master NumPy, Pandas, and data manipulation techniques.', 'beginner', 30, 'Dr. Lisa Chang', 1, true),
  (datascience_path_id, 'Data Visualization', 'Create compelling data visualizations. Learn Matplotlib, Seaborn, and storytelling with data.', 'intermediate', 25, 'Mark Thompson', 2, true),
  (datascience_path_id, 'Machine Learning Basics', 'Introduction to machine learning algorithms. Learn supervised and unsupervised learning with scikit-learn.', 'intermediate', 40, 'Dr. Sarah Miller', 3, true),
  (datascience_path_id, 'Deep Learning with TensorFlow', 'Build neural networks with TensorFlow and Keras. Learn CNNs, RNNs, and modern deep learning.', 'advanced', 50, 'Prof. John Davis', 4, true),
  (datascience_path_id, 'Big Data Analytics', 'Process large datasets with Apache Spark. Learn distributed computing and big data technologies.', 'advanced', 45, 'Dr. Rachel Green', 5, true);

  -- Insert DevOps Courses
  INSERT INTO public.courses (learning_path_id, title, description, difficulty_level, estimated_duration_hours, instructor_name, order_index, is_active) VALUES
  (devops_path_id, 'Git & Version Control', 'Master Git for version control. Learn branching strategies, collaboration, and best practices.', 'beginner', 15, 'Alex Martinez', 1, true),
  (devops_path_id, 'Docker Fundamentals', 'Containerize applications with Docker. Learn images, containers, volumes, and Docker Compose.', 'intermediate', 25, 'Kevin Park', 2, true),
  (devops_path_id, 'Kubernetes Essentials', 'Orchestrate containers with Kubernetes. Learn deployments, services, and cluster management.', 'advanced', 35, 'Michelle Wong', 3, true),
  (devops_path_id, 'CI/CD Pipeline Automation', 'Build automated deployment pipelines. Learn GitHub Actions, Jenkins, and continuous delivery.', 'intermediate', 30, 'Daniel Harris', 4, true),
  (devops_path_id, 'AWS Cloud Practitioner', 'Master Amazon Web Services fundamentals. Learn EC2, S3, RDS, and cloud architecture.', 'intermediate', 40, 'Jennifer Lopez', 5, true);

  -- Insert Mobile Development Courses
  INSERT INTO public.courses (learning_path_id, title, description, difficulty_level, estimated_duration_hours, instructor_name, order_index, is_active) VALUES
  (mobile_path_id, 'React Native Basics', 'Build cross-platform mobile apps with React Native. Learn components, navigation, and styling.', 'intermediate', 35, 'Tom Jackson', 1, true),
  (mobile_path_id, 'iOS Development with Swift', 'Create native iOS applications. Learn Swift, UIKit, and SwiftUI fundamentals.', 'intermediate', 45, 'Emma White', 2, true),
  (mobile_path_id, 'Android Development with Kotlin', 'Build native Android apps with Kotlin. Learn Android SDK, Jetpack Compose, and Material Design.', 'intermediate', 45, 'Ryan Scott', 3, true),
  (mobile_path_id, 'Mobile App Design Patterns', 'Master mobile architecture patterns. Learn MVVM, Clean Architecture, and state management.', 'advanced', 25, 'Sophie Turner', 4, true),
  (mobile_path_id, 'Mobile Performance Optimization', 'Optimize mobile app performance. Learn profiling, memory management, and best practices.', 'advanced', 20, 'Lucas Gray', 5, true);

  -- Insert UI/UX Design Courses
  INSERT INTO public.courses (learning_path_id, title, description, difficulty_level, estimated_duration_hours, instructor_name, order_index, is_active) VALUES
  (uiux_path_id, 'Design Thinking Fundamentals', 'Learn human-centered design process. Master empathy, ideation, and prototyping.', 'beginner', 20, 'Olivia Baker', 1, true),
  (uiux_path_id, 'Figma for UI Design', 'Master Figma for interface design. Learn components, auto-layout, and design systems.', 'beginner', 25, 'Nathan Cooper', 2, true),
  (uiux_path_id, 'User Research Methods', 'Conduct effective user research. Learn interviews, surveys, usability testing, and analysis.', 'intermediate', 30, 'Grace Evans', 3, true),
  (uiux_path_id, 'Interaction Design', 'Design engaging interactions. Learn micro-interactions, animations, and user feedback.', 'intermediate', 25, 'Ethan Moore', 4, true),
  (uiux_path_id, 'Design Systems & Components', 'Build scalable design systems. Learn component libraries, tokens, and documentation.', 'advanced', 30, 'Isabella Clark', 5, true);

  -- Insert Digital Marketing Courses
  INSERT INTO public.courses (learning_path_id, title, description, difficulty_level, estimated_duration_hours, instructor_name, order_index, is_active) VALUES
  (marketing_path_id, 'SEO Fundamentals', 'Master search engine optimization. Learn keyword research, on-page SEO, and link building.', 'beginner', 20, 'Benjamin Reed', 1, true),
  (marketing_path_id, 'Social Media Marketing', 'Grow your audience on social platforms. Learn content strategy, engagement, and analytics.', 'beginner', 25, 'Ava Mitchell', 2, true),
  (marketing_path_id, 'Content Marketing Strategy', 'Create compelling content that converts. Learn storytelling, content planning, and distribution.', 'intermediate', 30, 'Mason Phillips', 3, true),
  (marketing_path_id, 'Google Ads & PPC', 'Master paid advertising. Learn Google Ads, campaign optimization, and ROI tracking.', 'intermediate', 25, 'Sophia Carter', 4, true),
  (marketing_path_id, 'Email Marketing Automation', 'Build automated email campaigns. Learn segmentation, personalization, and conversion optimization.', 'intermediate', 20, 'Noah Bennett', 5, true);
END $$;

-- Insert Sample Course Content (limited sample for Frontend HTML & CSS course)
DO $$
DECLARE
  html_css_course_id UUID;
BEGIN
  SELECT id INTO html_css_course_id FROM public.courses WHERE title = 'HTML & CSS Fundamentals' LIMIT 1;
  
  IF html_css_course_id IS NOT NULL THEN
    INSERT INTO public.course_content (course_id, title, content_type, content_text, duration_minutes, order_index, is_free) VALUES
    (html_css_course_id, 'Introduction to HTML', 'video', 'Learn the basics of HTML structure, tags, and semantic markup. Understand how web pages are built.', 15, 1, true),
    (html_css_course_id, 'HTML Document Structure', 'article', 'Understanding the basic structure of an HTML document including DOCTYPE, head, and body elements. Learn about meta tags and proper document organization.', 20, 2, true),
    (html_css_course_id, 'Working with Text and Links', 'video', 'Master HTML text formatting, headings, paragraphs, and creating hyperlinks for navigation.', 25, 3, true),
    (html_css_course_id, 'HTML Forms and Input Elements', 'video', 'Build interactive forms with various input types, validation, and form submission.', 30, 4, true),
    (html_css_course_id, 'CSS Basics and Selectors', 'video', 'Introduction to CSS syntax, selectors, and how to style HTML elements.', 20, 5, true),
    (html_css_course_id, 'CSS Box Model Deep Dive', 'article', 'Understanding margin, padding, border, and content. Learn how the box model affects layout and spacing.', 25, 6, true),
    (html_css_course_id, 'Flexbox Layout System', 'video', 'Master CSS Flexbox for creating responsive layouts. Learn flex containers and flex items.', 35, 7, true),
    (html_css_course_id, 'CSS Grid Fundamentals', 'video', 'Build complex layouts with CSS Grid. Understand grid containers, tracks, and areas.', 40, 8, true),
    (html_css_course_id, 'Responsive Design with Media Queries', 'video', 'Create responsive websites that work on all devices using CSS media queries.', 30, 9, true),
    (html_css_course_id, 'Build Your First Web Page', 'project', 'Apply everything you learned to build a complete responsive landing page.', 120, 10, true);
  END IF;
END $$;

-- Insert Sample Circles
INSERT INTO public.circles (name, description, circle_type, max_members, is_public) VALUES
('React Beginners Study Group', 'A supportive community for those starting their React journey. Share resources, ask questions, and learn together.', 'study_group', 30, true),
('Frontend Developers Network', 'Connect with fellow frontend developers. Share projects, get feedback, and stay updated with industry trends.', 'networking', 100, true),
('Data Science Project Collaboration', 'Work on real-world data science projects with peers. Build your portfolio and gain practical experience.', 'project', 20, true),
('Career Mentorship Circle', 'Get guidance from experienced professionals. Monthly mentorship sessions and career advice.', 'mentorship', 50, true),
('DevOps Best Practices', 'Discuss DevOps tools, CI/CD pipelines, and cloud infrastructure. Share knowledge and solve problems together.', 'study_group', 40, true),
('Mobile Dev Community', 'For React Native, iOS, and Android developers. Code reviews, architecture discussions, and best practices.', 'networking', 60, true),
('UI/UX Design Critique', 'Share your designs and get constructive feedback. Improve your design skills through peer review.', 'study_group', 35, true),
('Freelance Developer Hub', 'Network with other freelancers. Share client experiences, pricing strategies, and business tips.', 'networking', 80, true),
('Algorithm Study Group', 'Practice coding challenges together. Prepare for technical interviews and improve problem-solving skills.', 'study_group', 25, true),
('Web3 & Blockchain Explorers', 'Learn about blockchain technology and Web3 development. Build decentralized applications together.', 'project', 30, true);

-- Add comment for reference
COMMENT ON TABLE public.badges IS 'Achievement badges that users can earn through various learning activities';
COMMENT ON TABLE public.learning_paths IS 'Structured learning paths containing multiple courses';
COMMENT ON TABLE public.courses IS 'Individual courses within learning paths';
COMMENT ON TABLE public.course_content IS 'Content modules/lessons within courses';
COMMENT ON TABLE public.circles IS 'Community study groups and networking circles';
