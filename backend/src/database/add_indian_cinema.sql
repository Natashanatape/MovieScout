-- Add Indian Cinema Support
-- Migration: add_indian_cinema_support.sql

-- Add language and country columns
ALTER TABLE movies 
ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English',
ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS industry VARCHAR(50);

-- Create indexes for better search
CREATE INDEX IF NOT EXISTS idx_movies_language ON movies(language);
CREATE INDEX IF NOT EXISTS idx_movies_country ON movies(country);
CREATE INDEX IF NOT EXISTS idx_movies_industry ON movies(industry);

-- Update existing movies to English/USA
UPDATE movies SET language = 'English', country = 'USA' WHERE language IS NULL;

-- Insert Bollywood Movies
INSERT INTO movies (title, description, release_date, runtime, poster_url, language, country, industry) VALUES
('3 Idiots', 'Two friends embark on a quest for a lost buddy. On this journey, they encounter a long-forgotten bet, a wedding they must crash, and a funeral that goes impossibly out of control.', '2009-12-25', 170, 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg', 'Hindi', 'India', 'Bollywood'),
('Dangal', 'A biopic of Mahavir Singh Phogat, who taught wrestling to his daughters Geeta and Babita Phogat. Geeta Phogat was India''s first female wrestler to win at the 2010 Commonwealth Games.', '2016-12-23', 161, 'https://image.tmdb.org/t/p/w500/lNkDYKmrVem4S9pRVbqbgzKpEXS.jpg', 'Hindi', 'India', 'Bollywood'),
('PK', 'An alien on Earth loses the only device he can use to communicate with his spaceship. His innocent nature and child-like questions force the country to evaluate the impact of religion on its people.', '2014-12-19', 153, 'https://image.tmdb.org/t/p/w500/9V1fXMzE1OPjKpEjBXq8Pk6m5Km.jpg', 'Hindi', 'India', 'Bollywood'),
('Bajrangi Bhaijaan', 'A young mute girl from Pakistan loses herself in India with no way to head back. A devoted man with a magnanimous spirit undertakes the task to get her back to her motherland and unite her with her family.', '2015-07-17', 163, 'https://image.tmdb.org/t/p/w500/4SyzsHdI7h28VKhqYuqpukej0hG.jpg', 'Hindi', 'India', 'Bollywood'),
('Taare Zameen Par', 'An eight-year-old boy is thought to be a lazy trouble-maker, until the new art teacher has the patience and compassion to discover the real problem behind his struggles in school.', '2007-12-21', 165, 'https://image.tmdb.org/t/p/w500/gM1xoF6pzvPIjWUhHz0Eh5YqQdZ.jpg', 'Hindi', 'India', 'Bollywood');

-- Insert Marathi Movies
INSERT INTO movies (title, description, release_date, runtime, poster_url, language, country, industry) VALUES
('Sairat', 'A young couple from different castes fall in love and elope, but their happiness is short-lived when their families catch up with them.', '2016-04-29', 174, 'https://image.tmdb.org/t/p/w500/sairat_poster.jpg', 'Marathi', 'India', 'Marathi Cinema'),
('Natsamrat', 'An aging actor, who has been a celebrated star of Marathi theatre, struggles with his retirement and the changing dynamics of his family.', '2016-01-01', 165, 'https://image.tmdb.org/t/p/w500/natsamrat_poster.jpg', 'Marathi', 'India', 'Marathi Cinema'),
('Court', 'An aging folk singer is arrested on charges of inciting a sewage worker''s suicide through his performances. The trial that follows is a satirical look at the Indian judicial system.', '2014-09-05', 116, 'https://image.tmdb.org/t/p/w500/court_poster.jpg', 'Marathi', 'India', 'Marathi Cinema');

-- Insert South Indian Movies
INSERT INTO movies (title, description, release_date, runtime, poster_url, language, country, industry) VALUES
('Baahubali: The Beginning', 'In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples.', '2015-07-10', 159, 'https://image.tmdb.org/t/p/w500/6TdiOQl7fKAGVsJMN4P4VGY0RCz.jpg', 'Telugu', 'India', 'Tollywood'),
('Baahubali 2: The Conclusion', 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.', '2017-04-28', 167, 'https://image.tmdb.org/t/p/w500/lkOZcsXcOLZYeJ2YxJd3vSldvU4.jpg', 'Telugu', 'India', 'Tollywood'),
('KGF Chapter 1', 'In the 1970s, a fierce rebel rises against brutal oppression and becomes the symbol of hope to legions of downtrodden people.', '2018-12-21', 156, 'https://image.tmdb.org/t/p/w500/kgf1_poster.jpg', 'Kannada', 'India', 'Sandalwood'),
('RRR', 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.', '2022-03-25', 187, 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg', 'Telugu', 'India', 'Tollywood');

COMMIT;
