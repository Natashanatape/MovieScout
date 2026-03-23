-- Phase 3: Missing Features Schema

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
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_filming_locations_movie ON filming_locations(movie_id);
CREATE INDEX idx_award_nominations_movie ON award_nominations(movie_id);
CREATE INDEX idx_popularity_rankings_entity ON popularity_rankings(entity_type, entity_id);
CREATE INDEX idx_popularity_rankings_date ON popularity_rankings(date);
CREATE INDEX idx_activity_feed_user ON activity_feed(user_id);
