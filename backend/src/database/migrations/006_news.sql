-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(50) DEFAULT 'general',
  author VARCHAR(100),
  image_url TEXT,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_category ON news_articles(category);
CREATE INDEX idx_news_published ON news_articles(published_at DESC);

-- Sample news data
INSERT INTO news_articles (title, content, summary, category, author, image_url) VALUES
('Breaking Bad Sequel Announced', 'AMC announces a new sequel series to the critically acclaimed Breaking Bad...', 'New Breaking Bad series coming soon', 'announcement', 'John Doe', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800'),
('Game of Thrones Prequel Gets Release Date', 'HBO reveals the official release date for House of the Dragon...', 'House of Dragon premiere date confirmed', 'release', 'Jane Smith', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800'),
('Top 10 Movies of 2024', 'Critics reveal their favorite films of the year so far...', 'Best movies of 2024 ranked', 'review', 'Mike Johnson', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'),
('Netflix Announces New Original Series', 'Streaming giant reveals lineup of upcoming original content...', 'Netflix 2024 lineup revealed', 'announcement', 'Sarah Williams', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800');
