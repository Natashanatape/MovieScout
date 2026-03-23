-- Additional Phase 3 Sample Data

-- Sample Quizzes
INSERT INTO quizzes (title, category, difficulty) VALUES
('Marvel Cinematic Universe Quiz', 'Superhero', 'Medium'),
('Classic Hollywood Quiz', 'Classic', 'Hard'),
('Bollywood Basics', 'Bollywood', 'Easy');

-- Sample Quiz Questions (for quiz_id 1)
INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, options_json) VALUES
(1, 'Who is the first Avenger?', 'Captain America', '["Iron Man", "Captain America", "Thor", "Hulk"]'),
(1, 'What is the name of Thor''s hammer?', 'Mjolnir', '["Stormbreaker", "Mjolnir", "Gungnir", "Hofund"]'),
(1, 'Which Infinity Stone is hidden on Vormir?', 'Soul Stone', '["Power Stone", "Time Stone", "Soul Stone", "Reality Stone"]');

-- Sample Awards
INSERT INTO awards (award_name, year, ceremony_date) VALUES
('Academy Awards (Oscars)', 2024, '2024-03-10'),
('Golden Globe Awards', 2024, '2024-01-07'),
('BAFTA Awards', 2024, '2024-02-18'),
('Emmy Awards', 2024, '2024-09-15');

-- Sample Award Categories
INSERT INTO award_categories (award_id, category_name) VALUES
(1, 'Best Picture'),
(1, 'Best Director'),
(1, 'Best Actor'),
(1, 'Best Actress');

-- Sample Award Nominations (assuming movie_id 1 exists)
INSERT INTO award_nominations (award_id, category_id, movie_id, won, year) VALUES
(1, 1, 1, true, 2024),
(1, 2, 1, false, 2024),
(1, 3, 1, false, 2024);

-- Sample Filming Locations
INSERT INTO filming_locations (movie_id, user_id, location_name, latitude, longitude, description) VALUES
(1, 1, 'New York City', 40.7128, -74.0060, 'Main action sequences filmed here'),
(1, 1, 'Los Angeles', 34.0522, -118.2437, 'Studio scenes');

-- Sample Popularity Rankings
INSERT INTO popularity_rankings (entity_type, entity_id, rank, score, date) VALUES
('movie', 1, 1, 95.5, CURRENT_DATE),
('movie', 2, 2, 92.3, CURRENT_DATE),
('movie', 3, 3, 89.7, CURRENT_DATE),
('celebrity', 1, 1, 88.2, CURRENT_DATE),
('celebrity', 2, 2, 85.9, CURRENT_DATE);

-- Sample Activity Feed
INSERT INTO activity_feed (user_id, activity_type, target_id, target_type) VALUES
(1, 'rating', 1, 'movie'),
(1, 'review', 1, 'movie'),
(1, 'watchlist_add', 2, 'movie');

-- Sample Social Shares
INSERT INTO social_shares (user_id, content_type, content_id, platform) VALUES
(1, 'movie', 1, 'facebook'),
(1, 'review', 1, 'twitter');

-- Sample Spoiler Settings
INSERT INTO spoiler_settings (user_id, hide_spoilers, spoiler_threshold_days) VALUES
(1, true, 30)
ON CONFLICT (user_id) DO NOTHING;

-- Sample Notification Preferences
INSERT INTO notification_preferences (user_id, email_enabled, push_enabled) VALUES
(1, true, true)
ON CONFLICT (user_id) DO NOTHING;

-- Verify data
SELECT 'Quizzes:' as info, COUNT(*) as count FROM quizzes
UNION ALL
SELECT 'Quiz Questions:', COUNT(*) FROM quiz_questions
UNION ALL
SELECT 'Awards:', COUNT(*) FROM awards
UNION ALL
SELECT 'Award Nominations:', COUNT(*) FROM award_nominations
UNION ALL
SELECT 'Filming Locations:', COUNT(*) FROM filming_locations
UNION ALL
SELECT 'Popularity Rankings:', COUNT(*) FROM popularity_rankings;

SELECT '✓ Additional Phase 3 data inserted!' as status;
