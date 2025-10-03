# Deployment Guide for Upskilling Programs Feature

## Quick Start

This guide will help you deploy the Upskilling Programs feature to your Supabase instance.

## Prerequisites

- Supabase project set up
- Supabase CLI installed (optional, for command-line deployment)
- Access to Supabase dashboard

## Option 1: Deploy Using Supabase CLI (Recommended)

### Step 1: Ensure Supabase is linked
```bash
supabase link --project-ref your-project-ref
```

### Step 2: Push migrations
```bash
supabase db push
```

This will apply both migration files:
- `20251003041434_create_upskilling_programs.sql` - Creates all tables
- `20251003041435_seed_upskilling_programs.sql` - Seeds initial data

### Step 3: Verify deployment
```bash
supabase db remote status
```

## Option 2: Deploy Using Supabase Dashboard

### Step 1: Open SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run Schema Migration
1. Copy the contents of `supabase/migrations/20251003041434_create_upskilling_programs.sql`
2. Paste into the SQL Editor
3. Click "Run" or press `Ctrl+Enter` / `Cmd+Enter`
4. Wait for confirmation that the query executed successfully

### Step 3: Run Seed Data Migration
1. Copy the contents of `supabase/migrations/20251003041435_seed_upskilling_programs.sql`
2. Paste into a new query in the SQL Editor
3. Click "Run" or press `Ctrl+Enter` / `Cmd+Enter`
4. Wait for confirmation that the query executed successfully

### Step 4: Verify Tables
1. Click on "Table Editor" in the left sidebar
2. You should see the new tables:
   - `badges`
   - `learning_paths`
   - `courses`
   - `course_content`
   - `circles`
   - `user_badges`
   - `user_courses`
   - `user_course_content_progress`
   - `circle_members`

### Step 5: Verify Data
1. Click on `learning_paths` table
2. You should see 8 learning paths
3. Click on `badges` table - should see 10 badges
4. Click on `courses` table - should see 40+ courses
5. Click on `circles` table - should see 10 circles

## Verification Checklist

After deployment, verify the following:

- [ ] All 9 tables are created
- [ ] Row Level Security (RLS) is enabled on all tables
- [ ] 8 learning paths are seeded
- [ ] 40+ courses are seeded
- [ ] 10 badges are seeded
- [ ] 10 circles are seeded
- [ ] Sample course content exists in `course_content` table
- [ ] All policies are in place

## Test the Frontend

1. Navigate to your deployed app at `/upskilling`
2. Verify that:
   - Learning paths are displayed (should show 8)
   - Circles are displayed (should show 6+ in the UI)
   - Badges section shows available badges
   - Stats show correct counts

## Troubleshooting

### Issue: Tables not created
**Solution**: Check that you have the necessary permissions in your Supabase project. You may need to be the project owner.

### Issue: Seed data not inserted
**Solution**: 
1. Check for constraint violations in the Supabase logs
2. Ensure the schema migration ran successfully first
3. The seed migration uses DO blocks which require PostgreSQL functions - make sure these are enabled

### Issue: "TypeError: Failed to fetch" in console
**Solution**: 
1. Verify your Supabase URL and anon key in `.env` file
2. Check that RLS policies are correctly set up
3. Ensure the tables exist in your Supabase instance

### Issue: Duplicate key constraint error on badges
**Solution**: The badges table has a UNIQUE constraint on the `name` column. If you're re-running the seed migration:
1. Either delete existing badge data first
2. Or modify the seed migration to use `INSERT ... ON CONFLICT DO NOTHING`

## Database Query Examples

### Check Learning Paths Count
```sql
SELECT COUNT(*) FROM learning_paths WHERE is_active = true;
-- Should return: 8
```

### Check Courses per Path
```sql
SELECT 
  lp.title,
  COUNT(c.id) as course_count
FROM learning_paths lp
LEFT JOIN courses c ON c.learning_path_id = lp.id
WHERE lp.is_active = true AND c.is_active = true
GROUP BY lp.id, lp.title
ORDER BY lp.title;
```

### Check Badges
```sql
SELECT name, category, points FROM badges ORDER BY points DESC;
-- Should return: 10 badges
```

### Check Circles
```sql
SELECT name, circle_type, max_members FROM circles WHERE is_public = true;
-- Should return: 10 circles
```

## Rollback (if needed)

If you need to rollback the changes:

```sql
-- Drop all tables in reverse order (respects foreign keys)
DROP TABLE IF EXISTS circle_members CASCADE;
DROP TABLE IF EXISTS user_course_content_progress CASCADE;
DROP TABLE IF EXISTS user_courses CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS circles CASCADE;
DROP TABLE IF EXISTS course_content CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
```

## Next Steps

After successful deployment:

1. Test the user experience by signing in and exploring learning paths
2. Consider creating additional course content
3. Monitor user engagement with badges and circles
4. Set up analytics to track popular learning paths

## Support

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Review the `UPSKILLING_PROGRAMS_FEATURE.md` documentation
3. Verify that your Supabase project has the required features enabled
4. Ensure your PostgreSQL version supports the required features (13.0+)
