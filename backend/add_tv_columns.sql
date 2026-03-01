-- Add TV show columns to movies table if they don't exist
ALTER TABLE movies 
ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'movie',
ADD COLUMN IF NOT EXISTS seasons INTEGER,
ADD COLUMN IF NOT EXISTS episodes INTEGER;

-- Create index for faster TV show queries
CREATE INDEX IF NOT EXISTS idx_movies_type ON movies(type);

-- Update existing movies to have type 'movie' if null
UPDATE movies SET type = 'movie' WHERE type IS NULL;
