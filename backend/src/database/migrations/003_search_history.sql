-- Search History Table
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    search_query TEXT,
    filters_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);

-- Add some sample search data
INSERT INTO search_history (user_id, search_query, filters_json, created_at) VALUES
(1, 'action movies', '{"genres": ["Action"], "yearFrom": "2020"}', NOW() - INTERVAL '1 day'),
(1, 'comedy', '{"genres": ["Comedy"], "ratingFrom": "7"}', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;