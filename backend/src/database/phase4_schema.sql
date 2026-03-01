-- Phase 4: Professional & Premium Features Schema

-- Coming Soon / Upcoming Releases
CREATE TABLE IF NOT EXISTS upcoming_releases (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  release_date DATE NOT NULL,
  release_type VARCHAR(50) DEFAULT 'theatrical',
  anticipation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS release_reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  remind_date DATE NOT NULL,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, movie_id)
);

-- Box Office Data
CREATE TABLE IF NOT EXISTS box_office (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  weekend_rank INTEGER,
  weekend_gross BIGINT,
  total_gross BIGINT,
  domestic_gross BIGINT,
  international_gross BIGINT,
  budget BIGINT,
  theater_count INTEGER,
  week_number INTEGER,
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TV Episodes
CREATE TABLE IF NOT EXISTS tv_seasons (
  id SERIAL PRIMARY KEY,
  tv_show_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  episode_count INTEGER DEFAULT 0,
  air_date DATE,
  overview TEXT,
  poster_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tv_show_id, season_number)
);

CREATE TABLE IF NOT EXISTS tv_episodes (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES tv_seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  air_date DATE,
  runtime INTEGER,
  overview TEXT,
  still_path TEXT,
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(season_id, episode_number)
);

CREATE TABLE IF NOT EXISTS episode_watch_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  episode_id INTEGER REFERENCES tv_episodes(id) ON DELETE CASCADE,
  watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, episode_id)
);

-- Technical Specifications
CREATE TABLE IF NOT EXISTS technical_specs (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE UNIQUE,
  aspect_ratio VARCHAR(50),
  sound_mix TEXT,
  color_info VARCHAR(100),
  camera TEXT,
  laboratory TEXT,
  film_format VARCHAR(100),
  cinematographic_process TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Release Information
CREATE TABLE IF NOT EXISTS release_dates (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  country VARCHAR(50),
  release_date DATE,
  release_type VARCHAR(50),
  certification VARCHAR(20),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  country VARCHAR(100),
  company_type VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movie_companies (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  role_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(movie_id, company_id, role_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_upcoming_releases_date ON upcoming_releases(release_date);
CREATE INDEX IF NOT EXISTS idx_box_office_movie ON box_office(movie_id);
CREATE INDEX IF NOT EXISTS idx_tv_seasons_show ON tv_seasons(tv_show_id);
CREATE INDEX IF NOT EXISTS idx_tv_episodes_season ON tv_episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_episode_watch_user ON episode_watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_release_dates_movie ON release_dates(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_companies_movie ON movie_companies(movie_id);
