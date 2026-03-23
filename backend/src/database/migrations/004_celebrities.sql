-- Celebrity Tables
CREATE TABLE IF NOT EXISTS celebrities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    birth_place VARCHAR(255),
    death_date DATE,
    biography TEXT,
    profile_image VARCHAR(500),
    height INTEGER, -- in cm
    known_for VARCHAR(255),
    imdb_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS celebrity_awards (
    id SERIAL PRIMARY KEY,
    celebrity_id INTEGER REFERENCES celebrities(id) ON DELETE CASCADE,
    award_name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    year INTEGER,
    won BOOLEAN DEFAULT FALSE,
    movie_id INTEGER REFERENCES movies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS celebrity_social_media (
    id SERIAL PRIMARY KEY,
    celebrity_id INTEGER REFERENCES celebrities(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- twitter, instagram, facebook
    profile_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update cast_crew table to link with celebrities
ALTER TABLE cast_crew ADD COLUMN IF NOT EXISTS celebrity_id INTEGER REFERENCES celebrities(id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_celebrities_name ON celebrities(name);
CREATE INDEX IF NOT EXISTS idx_celebrity_awards_celebrity_id ON celebrity_awards(celebrity_id);
CREATE INDEX IF NOT EXISTS idx_celebrity_social_celebrity_id ON celebrity_social_media(celebrity_id);

-- Sample celebrity data
INSERT INTO celebrities (name, birth_date, birth_place, biography, profile_image, height, known_for) VALUES
('Leonardo DiCaprio', '1974-11-11', 'Los Angeles, California, USA', 'Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biographical and period films, he has received numerous accolades.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 183, 'Titanic, Inception, The Wolf of Wall Street'),
('Scarlett Johansson', '1984-11-22', 'New York City, New York, USA', 'Scarlett Ingrid Johansson is an American actress. The world''s highest-paid actress in 2018 and 2019, she has featured multiple times on the Forbes Celebrity 100 list.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop', 160, 'Black Widow, Marriage Story, Jojo Rabbit'),
('Robert Downey Jr.', '1965-04-04', 'New York City, New York, USA', 'Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 174, 'Iron Man, Sherlock Holmes, Avengers'),
('Margot Robbie', '1990-07-02', 'Dalby, Queensland, Australia', 'Margot Elise Robbie is an Australian actress and producer. Known for her work in both blockbuster and independent films, she has received various accolades.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 168, 'Barbie, I, Tonya, The Wolf of Wall Street'),
('Tom Hanks', '1956-07-09', 'Concord, California, USA', 'Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 183, 'Forrest Gump, Cast Away, Saving Private Ryan')
ON CONFLICT DO NOTHING;

-- Sample awards
INSERT INTO celebrity_awards (celebrity_id, award_name, category, year, won, movie_id) VALUES
(1, 'Academy Award', 'Best Actor', 2016, TRUE, 1),
(1, 'Golden Globe', 'Best Actor', 2014, TRUE, 1),
(2, 'BAFTA Award', 'Best Actress', 2020, FALSE, 2),
(3, 'Golden Globe', 'Best Actor', 2010, TRUE, 3),
(4, 'Academy Award', 'Best Actress', 2018, TRUE, 4),
(5, 'Academy Award', 'Best Actor', 1995, TRUE, 1)
ON CONFLICT DO NOTHING;

-- Sample social media
INSERT INTO celebrity_social_media (celebrity_id, platform, profile_url) VALUES
(1, 'instagram', 'https://instagram.com/leonardodicaprio'),
(2, 'instagram', 'https://instagram.com/scarlettjohanssonofficial'),
(3, 'instagram', 'https://instagram.com/robertdowneyjr'),
(4, 'instagram', 'https://instagram.com/margotrobbie'),
(5, 'instagram', 'https://instagram.com/tomhanks')
ON CONFLICT DO NOTHING;