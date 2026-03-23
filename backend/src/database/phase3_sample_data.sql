-- Phase 3 Sample Data

-- Sample Trivia (assuming movie_id 1 exists and user_id 1 exists)
INSERT INTO trivia (movie_id, user_id, trivia_text, upvotes, status) VALUES
(1, 1, 'The entire movie was shot in just 28 days on a tight budget.', 15, 'approved'),
(1, 1, 'The director made a cameo appearance in the final scene.', 8, 'approved'),
(2, 1, 'Over 500 extras were used in the battle scene.', 12, 'approved');

-- Sample Goofs
INSERT INTO goofs (movie_id, user_id, goof_text, goof_type, upvotes) VALUES
(1, 1, 'In the car chase scene, the same car appears twice in different positions.', 'Continuity', 5),
(1, 1, 'The clock on the wall shows different times in consecutive shots.', 'Continuity', 3);

-- Sample Quotes
INSERT INTO quotes (movie_id, user_id, quote_text, character_name, upvotes) VALUES
(1, 1, 'I''ll be back.', 'John Connor', 20),
(1, 1, 'Here''s looking at you, kid.', 'Rick Blaine', 18);

-- Sample Polls
INSERT INTO polls (title, description, created_by, expires_at) VALUES
('Best Movie Genre?', 'Vote for your favorite movie genre', 1, NOW() + INTERVAL '7 days'),
('Most Anticipated 2024 Release?', 'Which upcoming movie are you most excited about?', 1, NOW() + INTERVAL '30 days');

-- Sample Poll Options (for poll_id 1)
INSERT INTO poll_options (poll_id, option_text, vote_count) VALUES
(1, 'Action', 45),
(1, 'Comedy', 32),
(1, 'Drama', 28),
(1, 'Sci-Fi', 51);

-- Sample Poll Options (for poll_id 2)
INSERT INTO poll_options (poll_id, option_text, vote_count) VALUES
(2, 'Dune: Part Two', 67),
(2, 'Deadpool 3', 89),
(2, 'Joker 2', 54);

-- Sample Notifications (for user_id 1)
INSERT INTO notifications (user_id, type, title, message, link, is_read) VALUES
(1, 'follow', 'New Follower', 'john_doe started following you', '/profile/2', false),
(1, 'comment', 'New Comment', 'Someone commented on your review', '/review/1', false),
(1, 'like', 'Review Liked', 'Your review received 10 likes', '/review/1', true);

-- Sample User Reputation
INSERT INTO user_reputation (user_id, reputation_score, contributions_count) VALUES
(1, 150, 25)
ON CONFLICT (user_id) DO UPDATE 
SET reputation_score = 150, contributions_count = 25;

-- Sample Comments (assuming review_id 1 exists)
INSERT INTO comments (review_id, user_id, comment_text, upvotes) VALUES
(1, 1, 'Great review! I totally agree with your points.', 5),
(1, 1, 'Interesting perspective. I saw it differently though.', 3);

-- Sample User Follows (user 1 follows user 2)
INSERT INTO user_follows (follower_id, following_id) VALUES
(1, 2)
ON CONFLICT DO NOTHING;

-- Verify data
SELECT 'Trivia Count:' as info, COUNT(*) as count FROM trivia
UNION ALL
SELECT 'Goofs Count:', COUNT(*) FROM goofs
UNION ALL
SELECT 'Quotes Count:', COUNT(*) FROM quotes
UNION ALL
SELECT 'Polls Count:', COUNT(*) FROM polls
UNION ALL
SELECT 'Comments Count:', COUNT(*) FROM comments
UNION ALL
SELECT 'Notifications Count:', COUNT(*) FROM notifications;

-- Success message
SELECT '✓ Phase 3 sample data inserted successfully!' as status;
