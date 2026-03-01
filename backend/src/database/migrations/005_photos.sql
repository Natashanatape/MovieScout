-- Photos table for movie stills, posters, behind-the-scenes
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(50) DEFAULT 'poster',
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_photos_movie ON photos(movie_id);
CREATE INDEX idx_photos_category ON photos(category);

-- Sample data
INSERT INTO photos (movie_id, photo_url, category, caption) VALUES
(1, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', 'poster', 'Official Poster'),
(1, 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', 'still', 'Movie Scene'),
(1, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'behind_scenes', 'Behind the Scenes'),
(2, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', 'poster', 'Official Poster');
