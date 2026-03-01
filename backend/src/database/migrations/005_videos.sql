-- Videos table for trailers, clips, etc.
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    video_type VARCHAR(50) NOT NULL, -- trailer, clip, behind_scenes, interview
    duration INTEGER, -- in seconds
    quality VARCHAR(20) DEFAULT '720p', -- 480p, 720p, 1080p
    source VARCHAR(50) DEFAULT 'youtube', -- youtube, vimeo, direct
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_movie_id ON videos(movie_id);
CREATE INDEX IF NOT EXISTS idx_videos_type ON videos(video_type);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(is_featured);

-- Sample video data
INSERT INTO videos (movie_id, title, video_url, thumbnail_url, video_type, duration, quality, source, is_featured) VALUES
(1, 'The Shawshank Redemption - Official Trailer', 'https://www.youtube.com/embed/6hB3S9bIaco', 'https://img.youtube.com/vi/6hB3S9bIaco/maxresdefault.jpg', 'trailer', 150, '1080p', 'youtube', true),
(1, 'Behind the Scenes - The Shawshank Redemption', 'https://www.youtube.com/embed/PLl99DlL6b4', 'https://img.youtube.com/vi/PLl99DlL6b4/maxresdefault.jpg', 'behind_scenes', 300, '720p', 'youtube', false),
(2, 'The Godfather - Trailer', 'https://www.youtube.com/embed/sY1S34973zA', 'https://img.youtube.com/vi/sY1S34973zA/maxresdefault.jpg', 'trailer', 180, '1080p', 'youtube', true),
(3, 'The Dark Knight - Official Trailer', 'https://www.youtube.com/embed/EXeTwQWrcwY', 'https://img.youtube.com/vi/EXeTwQWrcwY/maxresdefault.jpg', 'trailer', 155, '1080p', 'youtube', true),
(3, 'The Dark Knight - Behind the Scenes', 'https://www.youtube.com/embed/0OYBEquZ_j0', 'https://img.youtube.com/vi/0OYBEquZ_j0/maxresdefault.jpg', 'behind_scenes', 420, '720p', 'youtube', false),
(4, 'Pulp Fiction - Trailer', 'https://www.youtube.com/embed/s7EdQ4FqbhY', 'https://img.youtube.com/vi/s7EdQ4FqbhY/maxresdefault.jpg', 'trailer', 140, '1080p', 'youtube', true),
(5, 'Inception - Official Trailer', 'https://www.youtube.com/embed/YoHD9XEInc0', 'https://img.youtube.com/vi/YoHD9XEInc0/maxresdefault.jpg', 'trailer', 148, '1080p', 'youtube', true),
(5, 'Inception - Making Of', 'https://www.youtube.com/embed/ginQNMiRu2w', 'https://img.youtube.com/vi/ginQNMiRu2w/maxresdefault.jpg', 'behind_scenes', 600, '720p', 'youtube', false),
(6, 'Fight Club - Trailer', 'https://www.youtube.com/embed/SUXWAEX2jlg', 'https://img.youtube.com/vi/SUXWAEX2jlg/maxresdefault.jpg', 'trailer', 120, '1080p', 'youtube', true),
(7, 'Forrest Gump - Official Trailer', 'https://www.youtube.com/embed/bLvqoHBptjg', 'https://img.youtube.com/vi/bLvqoHBptjg/maxresdefault.jpg', 'trailer', 165, '1080p', 'youtube', true),
(8, 'The Matrix - Trailer', 'https://www.youtube.com/embed/vKQi3bBA1y8', 'https://img.youtube.com/vi/vKQi3bBA1y8/maxresdefault.jpg', 'trailer', 135, '1080p', 'youtube', true)
ON CONFLICT DO NOTHING;