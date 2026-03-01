-- User Lists Feature
CREATE TABLE IF NOT EXISTS list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID REFERENCES user_lists(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  order_number INTEGER,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(list_id, movie_id)
);

CREATE INDEX idx_list_items ON list_items(list_id);
COMMIT;
