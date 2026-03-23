-- Quick Test for Video Views Feature

-- Step 1: Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('video_views', 'videos');

-- Step 2: Check if views_count column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'videos' 
AND column_name = 'views_count';

-- Step 3: Check existing videos
SELECT id, title, views_count 
FROM videos 
LIMIT 5;

-- Step 4: Manually add a test view (replace video_id with actual ID)
INSERT INTO video_views (video_id, user_id, ip_address, watch_duration) 
VALUES (1, NULL, '192.168.1.1', 0);

-- Step 5: Check if views_count updated automatically
SELECT id, title, views_count 
FROM videos 
WHERE id = 1;

-- Step 6: Check video_views table
SELECT * FROM video_views LIMIT 5;
