-- Streaming Availability Feature
-- Migration: add_streaming_platforms.sql

-- Create streaming platforms table
CREATE TABLE IF NOT EXISTS streaming_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  country VARCHAR(50) DEFAULT 'Global',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create movie-streaming junction table
CREATE TABLE IF NOT EXISTS movie_streaming (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  platform_id UUID REFERENCES streaming_platforms(id) ON DELETE CASCADE,
  available BOOLEAN DEFAULT true,
  stream_url VARCHAR(500),
  price DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  type VARCHAR(20) DEFAULT 'subscription', -- subscription, rent, buy
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(movie_id, platform_id)
);

-- Insert streaming platforms
INSERT INTO streaming_platforms (name, logo_url, website_url, country) VALUES
('Netflix', 'https://cdn.worldvectorlogo.com/logos/netflix-3.svg', 'https://netflix.com', 'Global'),
('Amazon Prime Video', 'https://cdn.worldvectorlogo.com/logos/amazon-prime-video.svg', 'https://primevideo.com', 'Global'),
('Disney+ Hotstar', 'https://cdn.worldvectorlogo.com/logos/disney-hotstar.svg', 'https://hotstar.com', 'India'),
('Zee5', 'https://cdn.worldvectorlogo.com/logos/zee5.svg', 'https://zee5.com', 'India'),
('SonyLIV', 'https://cdn.worldvectorlogo.com/logos/sonyliv.svg', 'https://sonyliv.com', 'India'),
('Apple TV+', 'https://cdn.worldvectorlogo.com/logos/apple-tv.svg', 'https://tv.apple.com', 'Global'),
('YouTube', 'https://cdn.worldvectorlogo.com/logos/youtube-icon.svg', 'https://youtube.com', 'Global');

-- Add streaming data for existing movies (sample)
-- You can add more based on actual availability

CREATE INDEX idx_movie_streaming_movie ON movie_streaming(movie_id);
CREATE INDEX idx_movie_streaming_platform ON movie_streaming(platform_id);

COMMIT;
