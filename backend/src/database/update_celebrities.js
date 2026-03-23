const db = require('../config/database');

async function updateCelebrityData() {
  try {
    // Update celebrity biographies and fix images
    await db.query(`
      UPDATE celebrities SET 
        biography = CASE 
          WHEN name = 'Leonardo DiCaprio' THEN 'Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biographical and period films, he has received numerous accolades, including an Academy Award and three Golden Globe Awards. DiCaprio began his career in the late 1980s by appearing in television commercials. He achieved international stardom with Titanic (1997) and has since starred in critically acclaimed films like The Departed, Inception, and The Revenant.'
          WHEN name = 'Scarlett Johansson' THEN 'Scarlett Ingrid Johansson is an American actress and singer. The world''s highest-paid actress in 2018 and 2019, she has featured multiple times on the Forbes Celebrity 100 list. Johansson is particularly known for her work in the Marvel Cinematic Universe as Black Widow. She has been nominated for two Academy Awards and has won a Tony Award. Her versatile performances span from indie dramas to blockbuster action films.'
          WHEN name = 'Robert Downey Jr.' THEN 'Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles, then a resurgence of commercial success later in his career. He is best known for playing Tony Stark/Iron Man in the Marvel Cinematic Universe. Downey has also starred in Sherlock Holmes films and received acclaim for his dramatic performances in Chaplin and Tropic Thunder.'
          WHEN name = 'Margot Robbie' THEN 'Margot Elise Robbie is an Australian actress and producer. Known for her work in both blockbuster and independent films, she has received various accolades, including nominations for three Academy Awards and five BAFTA Awards. Robbie gained international recognition with The Wolf of Wall Street and has since starred in critically acclaimed films like I, Tonya, Lady Bird, and the blockbuster hit Barbie. She is also a successful producer through her company LuckyChap Entertainment.'
          WHEN name = 'Tom Hanks' THEN 'Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide. Hanks has won two Academy Awards for Best Actor for Philadelphia and Forrest Gump. He is known for his everyman persona and has starred in numerous beloved films including Cast Away, Saving Private Ryan, Toy Story franchise, and Apollo 13. He is considered one of America''s cultural icons.'
        END,
        profile_image = CASE 
          WHEN name = 'Scarlett Johansson' THEN 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
          ELSE profile_image
        END
      WHERE name IN ('Leonardo DiCaprio', 'Scarlett Johansson', 'Robert Downey Jr.', 'Margot Robbie', 'Tom Hanks');
    `);

    // Connect celebrities to existing movies via cast_crew
    // First, let's add celebrity_id to cast_crew for existing movies
    await pool.query(`
      UPDATE cast_crew SET celebrity_id = CASE 
        WHEN person_id = 1 THEN 1  -- Leonardo DiCaprio
        WHEN person_id = 2 THEN 2  -- Scarlett Johansson  
        WHEN person_id = 3 THEN 3  -- Robert Downey Jr.
        WHEN person_id = 4 THEN 4  -- Margot Robbie
        WHEN person_id = 5 THEN 5  -- Tom Hanks
      END
      WHERE person_id IN (1, 2, 3, 4, 5);
    `);

    // Add some sample filmography connections
    await db.query(`
      INSERT INTO cast_crew (movie_id, person_id, celebrity_id, role, character_name, department) VALUES
      (1, 1, 1, 'Actor', 'Dom Cobb', 'Acting'),
      (2, 2, 2, 'Actor', 'Natasha Romanoff', 'Acting'),
      (3, 3, 3, 'Actor', 'Tony Stark', 'Acting'),
      (4, 4, 4, 'Actor', 'Harley Quinn', 'Acting'),
      (5, 5, 5, 'Actor', 'Forrest Gump', 'Acting'),
      (6, 1, 1, 'Actor', 'Jordan Belfort', 'Acting'),
      (7, 3, 3, 'Actor', 'Sherlock Holmes', 'Acting'),
      (8, 5, 5, 'Actor', 'Chuck Noland', 'Acting')
      ON CONFLICT DO NOTHING;
    `);

    // Add some awards
    await db.query(`
      INSERT INTO celebrity_awards (celebrity_id, award_name, category, year, won, movie_id) VALUES
      (1, 'Academy Award', 'Best Actor', 2016, TRUE, 1),
      (1, 'Golden Globe', 'Best Actor', 2014, TRUE, 6),
      (2, 'BAFTA Award', 'Best Actress', 2020, FALSE, 2),
      (3, 'Golden Globe', 'Best Actor', 2010, TRUE, 3),
      (4, 'Academy Award', 'Best Actress', 2018, TRUE, 4),
      (5, 'Academy Award', 'Best Actor', 1995, TRUE, 5),
      (5, 'Academy Award', 'Best Actor', 1994, TRUE, 5)
      ON CONFLICT DO NOTHING;
    `);

    // Add social media
    await db.query(`
      INSERT INTO celebrity_social_media (celebrity_id, platform, profile_url) VALUES
      (1, 'instagram', 'https://instagram.com/leonardodicaprio'),
      (2, 'instagram', 'https://instagram.com/scarlettjohanssonofficial'),
      (3, 'instagram', 'https://instagram.com/robertdowneyjr'),
      (4, 'instagram', 'https://instagram.com/margotrobbie'),
      (5, 'instagram', 'https://instagram.com/tomhanks')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Celebrity data updated successfully!');
    console.log('✅ Extended biographies added');
    console.log('✅ Fixed Scarlett Johansson image');
    console.log('✅ Added filmography connections');
    console.log('✅ Added awards and social media');
    
  } catch (error) {
    console.error('❌ Error updating celebrity data:', error);
  }
}

updateCelebrityData();