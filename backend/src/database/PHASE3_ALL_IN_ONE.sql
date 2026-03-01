-- PHASE 3 - COMPLETE DATABASE SETUP (ALL IN ONE)
-- Just run this one file in pgAdmin!

-- ============================================
-- PART 1: PHASE 3 SCHEMA
-- ============================================

-- User Contributions: Trivia
CREATE TABLE IF NOT EXISTS trivia (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    trivia_text TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Contributions: Goofs
CREATE TABLE IF NOT EXISTS goofs (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    goof_text TEXT NOT NULL,
    goof_type VARCHAR(50),
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Contributions: Quotes
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quote_text TEXT NOT NULL,
    character_name VARCHAR(255),
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Reputation
CREATE TABLE IF NOT EXISTS user_reputation (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    reputation_score INTEGER DEFAULT 0,
    contributions_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social: User Follows
CREATE TABLE IF NOT EXISTS user_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Polls
CREATE TABLE IF NOT EXISTS polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    vote_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    options_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Filming Locations
CREATE TABLE IF NOT EXISTS filming_locations (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    location_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spoiler Management
CREATE TABLE IF NOT EXISTS spoiler_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    hide_spoilers BOOLEAN DEFAULT TRUE,
    spoiler_threshold_days INTEGER DEFAULT 30
);

CREATE TABLE IF NOT EXISTS comment_reports (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    reported_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Awards
CREATE TABLE IF NOT EXISTS awards (
    id SERIAL PRIMARY KEY,
    award_name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    ceremony_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS award_categories (
    id SERIAL PRIMARY KEY,
    award_id INTEGER REFERENCES awards(id) ON DELETE CASCADE,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS award_nominations (
    id SERIAL PRIMARY KEY,
    award_id INTEGER REFERENCES awards(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES award_categories(id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(id) ON DELETE SET NULL,
    person_id INTEGER,
    won BOOLEAN DEFAULT FALSE,
    year INTEGER NOT NULL
);

-- Popularity Rankings
CREATE TABLE IF NOT EXISTS popularity_rankings (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    score DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Feed
CREATE TABLE IF NOT EXISTS activity_feed (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    target_id INTEGER NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Shares
CREATE TABLE IF NOT EXISTS social_shares (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    content_id INTEGER NOT NULL,
    platform VARCHAR(50) NOT NULL,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    notification_types_json JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trivia_movie ON trivia(movie_id);
CREATE INDEX IF NOT EXISTS idx_goofs_movie ON goofs(movie_id);
CREATE INDEX IF NOT EXISTS idx_quotes_movie ON quotes(movie_id);
CREATE INDEX IF NOT EXISTS idx_comments_review ON comments(review_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_filming_locations_movie ON filming_locations(movie_id);
CREATE INDEX IF NOT EXISTS idx_award_nominations_movie ON award_nominations(movie_id);
CREATE INDEX IF NOT EXISTS idx_popularity_rankings_entity ON popularity_rankings(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_popularity_rankings_date ON popularity_rankings(date);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_id);

-- ============================================
-- PART 2: SAMPLE DATA
-- ============================================

-- Sample Trivia
INSERT INTO trivia (movie_id, user_id, trivia_text, upvotes, status) VALUES
(1, 1, 'The entire movie was shot in just 28 days on a tight budget.', 15, 'approved'),
(1, 1, 'The director made a cameo appearance in the final scene.', 8, 'approved');

-- Sample Goofs
INSERT INTO goofs (movie_id, user_id, goof_text, goof_type, upvotes) VALUES
(1, 1, 'In the car chase scene, the same car appears twice in different positions.', 'Continuity', 5);

-- Sample Quotes
INSERT INTO quotes (movie_id, user_id, quote_text, character_name, upvotes) VALUES
(1, 1, 'I will be back.', 'John Connor', 20);

-- Sample Polls
INSERT INTO polls (title, description, created_by, expires_at) VALUES
('Best Movie Genre?', 'Vote for your favorite movie genre', 1, NOW() + INTERVAL '7 days'),
('Most Anticipated 2024 Release?', 'Which upcoming movie are you most excited about?', 1, NOW() + INTERVAL '30 days');

-- Sample Poll Options
INSERT INTO poll_options (poll_id, option_text, vote_count) VALUES
(1, 'Action', 45),
(1, 'Comedy', 32),
(1, 'Drama', 28),
(1, 'Sci-Fi', 51),
(2, 'Dune: Part Two', 67),
(2, 'Deadpool 3', 89);

-- Sample Notifications
INSERT INTO notifications (user_id, type, title, message, link, is_read) VALUES
(1, 'follow', 'New Follower', 'john_doe started following you', '/profile/2', false);

-- Sample Quizzes
INSERT INTO quizzes (title, category, difficulty) VALUES
('Marvel Cinematic Universe Quiz', 'Superhero', 'Medium'),
('Classic Hollywood Quiz', 'Classic', 'Hard');

-- Sample Quiz Questions
INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, options_json) VALUES
(1, 'Who is the first Avenger?', 'Captain America', '["Iron Man", "Captain America", "Thor", "Hulk"]'),
(1, 'What is the name of Thor''s hammer?', 'Mjolnir', '["Stormbreaker", "Mjolnir", "Gungnir", "Hofund"]');

-- Sample Awards
INSERT INTO awards (award_name, year, ceremony_date) VALUES
('Academy Awards (Oscars)', 2024, '2024-03-10'),
('Golden Globe Awards', 2024, '2024-01-07');

-- Sample Award Categories
INSERT INTO award_categories (award_id, category_name) VALUES
(1, 'Best Picture'),
(1, 'Best Director');

-- Sample Award Nominations
INSERT INTO award_nominations (award_id, category_id, movie_id, won, year) VALUES
(1, 1, 1, true, 2024);

-- Sample Popularity Rankings
INSERT INTO popularity_rankings (entity_type, entity_id, rank, score, date) VALUES
('movie', 1, 1, 95.5, CURRENT_DATE),
('movie', 2, 2, 92.3, CURRENT_DATE);

-- Success message
SELECT '✅ Phase 3 Database Setup Complete!' as status;
SELECT 'Total Tables Created: 23' as info;
