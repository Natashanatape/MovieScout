const db = require('../config/database');

const createTables = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // User profiles
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        display_name VARCHAR(100),
        bio TEXT,
        profile_image_url VARCHAR(500),
        location VARCHAR(100),
        website VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Movies table
    await db.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        release_date DATE,
        runtime INTEGER,
        poster_url VARCHAR(500),
        backdrop_url VARCHAR(500),
        average_rating DECIMAL(3,1) DEFAULT 0,
        rating_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Genres
    await db.query(`
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    // Movie genres
    await db.query(`
      CREATE TABLE IF NOT EXISTS movie_genres (
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (movie_id, genre_id)
      );
    `);

    // Persons (actors, directors, etc.)
    await db.query(`
      CREATE TABLE IF NOT EXISTS persons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        profile_image VARCHAR(500),
        birth_date DATE,
        biography TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Cast and crew
    await db.query(`
      CREATE TABLE IF NOT EXISTS cast_crew (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        person_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        character_name VARCHAR(255),
        department VARCHAR(100),
        "order" INTEGER
      );
    `);

    // Ratings
    await db.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id)
      );
    `);

    // Reviews
    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        review_text TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        helpful_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Review votes
    await db.query(`
      CREATE TABLE IF NOT EXISTS review_votes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
        vote_type VARCHAR(10) CHECK (vote_type IN ('helpful', 'not_helpful')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, review_id)
      );
    `);

    // Watchlist
    await db.query(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id)
      );
    `);

    // Search History
    await db.query(`
      CREATE TABLE IF NOT EXISTS search_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        search_query TEXT,
        filters_json JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Celebrities
    await db.query(`
      CREATE TABLE IF NOT EXISTS celebrities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        birth_date DATE,
        birth_place VARCHAR(255),
        death_date DATE,
        biography TEXT,
        profile_image VARCHAR(500),
        height INTEGER,
        known_for VARCHAR(255),
        imdb_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Celebrity Awards
    await db.query(`
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
    `);

    // Celebrity Social Media
    await db.query(`
      CREATE TABLE IF NOT EXISTS celebrity_social_media (
        id SERIAL PRIMARY KEY,
        celebrity_id INTEGER REFERENCES celebrities(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        profile_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Update cast_crew to link with celebrities
    await db.query(`
      ALTER TABLE cast_crew ADD COLUMN IF NOT EXISTS celebrity_id INTEGER REFERENCES celebrities(id);
    `);

    // Create indexes
    await db.query('CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_ratings_movie ON ratings(movie_id);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_reviews_movie ON reviews(movie_id);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_celebrities_name ON celebrities(name);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_celebrity_awards_celebrity_id ON celebrity_awards(celebrity_id);');

    // Insert sample celebrities
    await db.query(`
      INSERT INTO celebrities (name, birth_date, birth_place, biography, profile_image, height, known_for) VALUES
      ('Leonardo DiCaprio', '1974-11-11', 'Los Angeles, California, USA', 'Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biographical and period films, he has received numerous accolades, including an Academy Award and three Golden Globe Awards. DiCaprio began his career in the late 1980s by appearing in television commercials. He achieved international stardom with Titanic (1997) and has since starred in critically acclaimed films like The Departed, Inception, and The Revenant.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 183, 'Titanic, Inception, The Wolf of Wall Street'),
      ('Scarlett Johansson', '1984-11-22', 'New York City, New York, USA', 'Scarlett Ingrid Johansson is an American actress and singer. The world''s highest-paid actress in 2018 and 2019, she has featured multiple times on the Forbes Celebrity 100 list. Johansson is particularly known for her work in the Marvel Cinematic Universe as Black Widow. She has been nominated for two Academy Awards and has won a Tony Award. Her versatile performances span from indie dramas to blockbuster action films.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', 160, 'Black Widow, Marriage Story, Jojo Rabbit'),
      ('Robert Downey Jr.', '1965-04-04', 'New York City, New York, USA', 'Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles, then a resurgence of commercial success later in his career. He is best known for playing Tony Stark/Iron Man in the Marvel Cinematic Universe. Downey has also starred in Sherlock Holmes films and received acclaim for his dramatic performances in Chaplin and Tropic Thunder.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 174, 'Iron Man, Sherlock Holmes, Avengers'),
      ('Margot Robbie', '1990-07-02', 'Dalby, Queensland, Australia', 'Margot Elise Robbie is an Australian actress and producer. Known for her work in both blockbuster and independent films, she has received various accolades, including nominations for three Academy Awards and five BAFTA Awards. Robbie gained international recognition with The Wolf of Wall Street and has since starred in critically acclaimed films like I, Tonya, Lady Bird, and the blockbuster hit Barbie. She is also a successful producer through her company LuckyChap Entertainment.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 168, 'Barbie, I, Tonya, The Wolf of Wall Street'),
      ('Tom Hanks', '1956-07-09', 'Concord, California, USA', 'Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide. Hanks has won two Academy Awards for Best Actor for Philadelphia and Forrest Gump. He is known for his everyman persona and has starred in numerous beloved films including Cast Away, Saving Private Ryan, Toy Story franchise, and Apollo 13. He is considered one of America''s cultural icons.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 183, 'Forrest Gump, Cast Away, Saving Private Ryan')
      ON CONFLICT DO NOTHING;
    `);

    // Add celebrity awards
    await db.query(`
      DELETE FROM celebrity_social_media;
      DELETE FROM celebrity_awards;
      DELETE FROM celebrities;
      ALTER SEQUENCE celebrities_id_seq RESTART WITH 1;
      
      INSERT INTO celebrities (name, birth_date, birth_place, biography, profile_image, height, known_for) VALUES
      ('Leonardo DiCaprio', '1974-11-11', 'Los Angeles, California, USA', 'Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biographical and period films, he has received numerous accolades, including an Academy Award and three Golden Globe Awards. DiCaprio began his career in the late 1980s by appearing in television commercials. He achieved international stardom with Titanic (1997) and has since starred in critically acclaimed films like The Departed, Inception, and The Revenant.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 183, 'Titanic, Inception, The Wolf of Wall Street'),
      ('Scarlett Johansson', '1984-11-22', 'New York City, New York, USA', 'Scarlett Ingrid Johansson is an American actress and singer. The worlds highest-paid actress in 2018 and 2019, she has featured multiple times on the Forbes Celebrity 100 list. Johansson is particularly known for her work in the Marvel Cinematic Universe as Black Widow. She has been nominated for two Academy Awards and has won a Tony Award. Her versatile performances span from indie dramas to blockbuster action films.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', 160, 'Black Widow, Marriage Story, Jojo Rabbit'),
      ('Robert Downey Jr.', '1965-04-04', 'New York City, New York, USA', 'Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles, then a resurgence of commercial success later in his career. He is best known for playing Tony Stark/Iron Man in the Marvel Cinematic Universe. Downey has also starred in Sherlock Holmes films and received acclaim for his dramatic performances in Chaplin and Tropic Thunder.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 174, 'Iron Man, Sherlock Holmes, Avengers'),
      ('Margot Robbie', '1990-07-02', 'Dalby, Queensland, Australia', 'Margot Elise Robbie is an Australian actress and producer. Known for her work in both blockbuster and independent films, she has received various accolades, including nominations for three Academy Awards and five BAFTA Awards. Robbie gained international recognition with The Wolf of Wall Street and has since starred in critically acclaimed films like I, Tonya, Lady Bird, and the blockbuster hit Barbie. She is also a successful producer through her company LuckyChap Entertainment.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 168, 'Barbie, I, Tonya, The Wolf of Wall Street'),
      ('Tom Hanks', '1956-07-09', 'Concord, California, USA', 'Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide. Hanks has won two Academy Awards for Best Actor for Philadelphia and Forrest Gump. He is known for his everyman persona and has starred in numerous beloved films including Cast Away, Saving Private Ryan, Toy Story franchise, and Apollo 13. He is considered one of Americas cultural icons.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 183, 'Forrest Gump, Cast Away, Saving Private Ryan');
      
      INSERT INTO celebrity_awards (celebrity_id, award_name, category, year, won) VALUES
      (1, 'Academy Award', 'Best Actor', 2016, true),
      (1, 'Golden Globe', 'Best Actor', 2016, true),
      (2, 'Tony Award', 'Best Actress', 2010, true),
      (2, 'BAFTA Award', 'Best Actress', 2020, false),
      (3, 'Golden Globe', 'Best Actor', 2010, true),
      (4, 'Academy Award', 'Best Actress', 2018, true),
      (4, 'Golden Globe', 'Best Actress', 2018, true),
      (5, 'Academy Award', 'Best Actor', 1994, true),
      (5, 'Academy Award', 'Best Actor', 1995, true);
      
      INSERT INTO celebrity_social_media (celebrity_id, platform, profile_url) VALUES
      (1, 'instagram', 'https://instagram.com/leonardodicaprio'),
      (2, 'instagram', 'https://instagram.com/scarlettjohanssonofficial'),
      (3, 'instagram', 'https://instagram.com/robertdowneyjr'),
      (4, 'instagram', 'https://instagram.com/margotrobbie'),
      (5, 'instagram', 'https://instagram.com/tomhanks');
    `);

    // Add videos table
    await db.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        video_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        video_type VARCHAR(50) NOT NULL,
        duration INTEGER,
        quality VARCHAR(20) DEFAULT '720p',
        source VARCHAR(50) DEFAULT 'youtube',
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add video indexes
    await db.query('CREATE INDEX IF NOT EXISTS idx_videos_movie_id ON videos(movie_id);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_videos_type ON videos(video_type);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(is_featured);');

    // Add sample videos
    await db.query(`
      INSERT INTO videos (movie_id, title, video_url, thumbnail_url, video_type, duration, quality, source, is_featured) VALUES
      (1, 'The Shawshank Redemption - Official Trailer', 'https://www.youtube.com/embed/6hB3S9bIaco', 'https://img.youtube.com/vi/6hB3S9bIaco/maxresdefault.jpg', 'trailer', 150, '1080p', 'youtube', true),
      (1, 'Behind the Scenes - The Shawshank Redemption', 'https://www.youtube.com/embed/PLl99DlL6b4', 'https://img.youtube.com/vi/PLl99DlL6b4/maxresdefault.jpg', 'behind_scenes', 300, '720p', 'youtube', false),
      (2, 'The Godfather - Trailer', 'https://www.youtube.com/embed/sY1S34973zA', 'https://img.youtube.com/vi/sY1S34973zA/maxresdefault.jpg', 'trailer', 180, '1080p', 'youtube', true),
      (3, 'The Dark Knight - Official Trailer', 'https://www.youtube.com/embed/EXeTwQWrcwY', 'https://img.youtube.com/vi/EXeTwQWrcwY/maxresdefault.jpg', 'trailer', 155, '1080p', 'youtube', true),
      (3, 'The Dark Knight - Behind the Scenes', 'https://www.youtube.com/embed/0OYBEquZ_j0', 'https://img.youtube.com/vi/0OYBEquZ_j0/maxresdefault.jpg', 'behind_scenes', 420, '720p', 'youtube', false),
      (4, 'Pulp Fiction - Trailer', 'https://www.youtube.com/embed/s7EdQ4FqbhY', 'https://img.youtube.com/vi/s7EdQ4FqbhY/maxresdefault.jpg', 'trailer', 140, '1080p', 'youtube', true),
      (5, 'Inception - Official Trailer', 'https://www.youtube.com/embed/YoHD9XEInc0', 'https://img.youtube.com/vi/YoHD9XEInc0/maxresdefault.jpg', 'trailer', 148, '1080p', 'youtube', true),
      (5, 'Inception - Making Of', 'https://www.youtube.com/embed/ginQNMiRu2w', 'https://img.youtube.com/vi/ginQNMiRu2w/maxresdefault.jpg', 'behind_scenes', 600, '720p', 'youtube', false),
      (6, 'Fight Club - Trailer', 'https://www.youtube.com/embed/SUXWAEX2jlg', 'https://img.youtube.com/vi/SUXWAEX2jlg/maxresdefault.jpg', 'trailer', 120, '1080p', 'youtube', true),
      (7, 'Forrest Gump - Official Trailer', 'https://www.youtube.com/embed/bLvqoHBptjg', 'https://img.youtube.com/vi/bLvqoHBptjg/maxresdefault.jpg', 'trailer', 165, '1080p', 'youtube', true),
      (8, 'The Matrix - Trailer', 'https://www.youtube.com/embed/vKQi3bBA1y8', 'https://img.youtube.com/vi/vKQi3bBA1y8/maxresdefault.jpg', 'trailer', 135, '1080p', 'youtube', true)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ All tables created successfully!');
    
    // Add videos data
    await db.query(`
      INSERT INTO videos (movie_id, title, video_url, thumbnail_url, video_type, duration, quality, source, is_featured) VALUES
      (1, 'The Shawshank Redemption - Official Trailer', 'https://www.youtube.com/embed/6hB3S9bIaco', 'https://img.youtube.com/vi/6hB3S9bIaco/maxresdefault.jpg', 'trailer', 150, '1080p', 'youtube', true),
      (2, 'The Godfather - Trailer', 'https://www.youtube.com/embed/sY1S34973zA', 'https://img.youtube.com/vi/sY1S34973zA/maxresdefault.jpg', 'trailer', 180, '1080p', 'youtube', true),
      (3, 'The Dark Knight - Official Trailer', 'https://www.youtube.com/embed/EXeTwQWrcwY', 'https://img.youtube.com/vi/EXeTwQWrcwY/maxresdefault.jpg', 'trailer', 155, '1080p', 'youtube', true),
      (4, 'Pulp Fiction - Trailer', 'https://www.youtube.com/embed/s7EdQ4FqbhY', 'https://img.youtube.com/vi/s7EdQ4FqbhY/maxresdefault.jpg', 'trailer', 140, '1080p', 'youtube', true),
      (5, 'Inception - Official Trailer', 'https://www.youtube.com/embed/YoHD9XEInc0', 'https://img.youtube.com/vi/YoHD9XEInc0/maxresdefault.jpg', 'trailer', 148, '1080p', 'youtube', true),
      (6, 'Fight Club - Trailer', 'https://www.youtube.com/embed/SUXWAEX2jlg', 'https://img.youtube.com/vi/SUXWAEX2jlg/maxresdefault.jpg', 'trailer', 120, '1080p', 'youtube', true),
      (7, 'Forrest Gump - Official Trailer', 'https://www.youtube.com/embed/bLvqoHBptjg', 'https://img.youtube.com/vi/bLvqoHBptjg/maxresdefault.jpg', 'trailer', 165, '1080p', 'youtube', true),
      (8, 'The Matrix - Trailer', 'https://www.youtube.com/embed/vKQi3bBA1y8', 'https://img.youtube.com/vi/vKQi3bBA1y8/maxresdefault.jpg', 'trailer', 135, '1080p', 'youtube', true)
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Videos added successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

if (require.main === module) {
  createTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createTables;
