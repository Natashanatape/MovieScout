-- Movie Collections Feature
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  poster_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  order_number INTEGER,
  UNIQUE(collection_id, movie_id)
);

-- Insert popular collections
INSERT INTO collections (name, description, poster_url) VALUES
('Marvel Cinematic Universe', 'The complete MCU saga', 'https://image.tmdb.org/t/p/w500/mcu.jpg'),
('DC Extended Universe', 'DC superhero movies', 'https://image.tmdb.org/t/p/w500/dceu.jpg'),
('Harry Potter', 'The wizarding world saga', 'https://image.tmdb.org/t/p/w500/hp.jpg'),
('Fast & Furious', 'High-octane action franchise', 'https://image.tmdb.org/t/p/w500/ff.jpg'),
('Baahubali Series', 'Epic Indian fantasy', 'https://image.tmdb.org/t/p/w500/baahubali.jpg'),
('KGF Series', 'Kannada blockbuster franchise', 'https://image.tmdb.org/t/p/w500/kgf.jpg');

CREATE INDEX idx_collection_movies ON collection_movies(collection_id);
COMMIT;
