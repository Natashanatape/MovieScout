-- Video Views Feature Schema

-- Video Views Table
CREATE TABLE IF NOT EXISTS video_views (
    id SERIAL PRIMARY KEY,
    video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    watch_duration INTEGER DEFAULT 0
);

-- Add views_count column to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_views_video ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_user ON video_views(user_id);
CREATE INDEX IF NOT EXISTS idx_video_views_ip ON video_views(ip_address, video_id);

-- Function to update views count
CREATE OR REPLACE FUNCTION update_video_views_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE videos 
    SET views_count = (SELECT COUNT(*) FROM video_views WHERE video_id = NEW.video_id)
    WHERE id = NEW.video_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update views count
DROP TRIGGER IF EXISTS trigger_update_video_views ON video_views;
CREATE TRIGGER trigger_update_video_views
    AFTER INSERT ON video_views
    FOR EACH ROW
    EXECUTE FUNCTION update_video_views_count();
