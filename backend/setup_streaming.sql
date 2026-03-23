-- Streaming Guide Tables

CREATE TABLE IF NOT EXISTS streaming_platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  website TEXT,
  subscription_price DECIMAL(10,2),
  country VARCHAR(50) DEFAULT 'IN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS streaming_availability (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES streaming_platforms(id) ON DELETE CASCADE,
  country VARCHAR(50) DEFAULT 'IN',
  availability_type VARCHAR(50),
  price DECIMAL(10,2),
  quality VARCHAR(20),
  url TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  target_price DECIMAL(10,2),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Popular Streaming Platforms
INSERT INTO streaming_platforms (name, logo_url, website, subscription_price, country) VALUES
('Netflix', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&h=200&fit=crop', 'https://netflix.com', 199, 'IN'),
('Amazon Prime Video', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop', 'https://primevideo.com', 299, 'IN'),
('Disney+ Hotstar', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&h=200&fit=crop', 'https://hotstar.com', 499, 'IN'),
('Sony LIV', 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop', 'https://sonyliv.com', 299, 'IN'),
('Zee5', 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=200&fit=crop', 'https://zee5.com', 99, 'IN'),
('YouTube', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop', 'https://youtube.com', 0, 'IN'),
('Apple TV+', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop', 'https://tv.apple.com', 99, 'IN'),
('Jio Cinema', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop', 'https://jiocinema.com', 0, 'IN');

CREATE INDEX idx_streaming_movie ON streaming_availability(movie_id);
CREATE INDEX idx_streaming_platform ON streaming_availability(platform_id);
CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
