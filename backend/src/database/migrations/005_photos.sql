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

CREATE INDEX IF NOT EXISTS idx_photos_movie ON photos(movie_id);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
