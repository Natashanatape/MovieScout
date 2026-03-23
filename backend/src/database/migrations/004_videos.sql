-- Videos table for trailers, clips, interviews
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_type VARCHAR(50) DEFAULT 'trailer',
  duration INTEGER,
  quality VARCHAR(10) DEFAULT '720p',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_videos_movie ON videos(movie_id);
CREATE INDEX idx_videos_type ON videos(video_type);

-- Sample data
INSERT INTO videos (movie_id, title, video_url, video_type, duration) VALUES
(1, 'Official Trailer', 'dQw4w9WgXcQ', 'trailer', 180),
(1, 'Behind the Scenes', 'dQw4w9WgXcQ', 'behind_scenes', 240),
(2, 'Official Trailer', 'dQw4w9WgXcQ', 'trailer', 150);
