-- Phase 5: Advanced Content Tables

-- Parental Guide
CREATE TABLE IF NOT EXISTS parental_guide (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- Violence, Profanity, Sex/Nudity, Alcohol/Drugs, Frightening
  severity VARCHAR(20), -- None, Mild, Moderate, Severe
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quotes
CREATE TABLE IF NOT EXISTS movie_quotes (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  character_name VARCHAR(255),
  quote_text TEXT NOT NULL,
  context TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Filming Locations
CREATE TABLE IF NOT EXISTS filming_locations (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  location_name VARCHAR(255) NOT NULL,
  address TEXT,
  country VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  scene_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Soundtracks
CREATE TABLE IF NOT EXISTS soundtracks (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  track_title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  composer VARCHAR(255),
  duration INTEGER, -- in seconds
  track_number INTEGER,
  spotify_url TEXT,
  youtube_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alternative Versions
CREATE TABLE IF NOT EXISTS alternative_versions (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  version_type VARCHAR(100), -- Director's Cut, Extended, Theatrical, etc.
  runtime INTEGER,
  description TEXT,
  release_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trivia (Did You Know)
CREATE TABLE IF NOT EXISTS movie_trivia (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  trivia_text TEXT NOT NULL,
  category VARCHAR(50), -- Production, Cast, Behind the Scenes, etc.
  is_spoiler BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Goofs & Mistakes
CREATE TABLE IF NOT EXISTS movie_goofs (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  goof_type VARCHAR(50), -- Continuity, Factual, Revealing, Audio, etc.
  description TEXT NOT NULL,
  timestamp VARCHAR(20), -- e.g., "01:23:45"
  is_spoiler BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crazy Credits
CREATE TABLE IF NOT EXISTS crazy_credits (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  credit_type VARCHAR(50), -- Post-credits, Mid-credits, Opening, etc.
  description TEXT NOT NULL,
  is_spoiler BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Connections (Movie References)
CREATE TABLE IF NOT EXISTS movie_connections (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  connected_movie_id INTEGER REFERENCES movies(id),
  connection_type VARCHAR(50), -- Sequel, Prequel, Remake, Referenced in, etc.
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ
CREATE TABLE IF NOT EXISTS movie_faq (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_spoiler BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_parental_guide_movie ON parental_guide(movie_id);
CREATE INDEX idx_quotes_movie ON movie_quotes(movie_id);
CREATE INDEX idx_locations_movie ON filming_locations(movie_id);
CREATE INDEX idx_soundtracks_movie ON soundtracks(movie_id);
CREATE INDEX idx_trivia_movie ON movie_trivia(movie_id);
CREATE INDEX idx_goofs_movie ON movie_goofs(movie_id);
CREATE INDEX idx_connections_movie ON movie_connections(movie_id);
CREATE INDEX idx_faq_movie ON movie_faq(movie_id);

COMMIT;
