const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

class CelebrityController {
  // Get all celebrities with pagination
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = '';
      let queryParams = [limit, offset];
      
      if (search.trim()) {
        whereClause = 'WHERE p.name ILIKE $3';
        queryParams.push(`%${search}%`);
      }

      const sql = `
        SELECT p.*, 
               COUNT(cc.id) as movie_count
        FROM persons p
        LEFT JOIN cast_crew cc ON p.id = cc.person_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY movie_count DESC, p.name ASC
        LIMIT $1 OFFSET $2
      `;

      const result = await pool.query(sql, queryParams);

      // Get total count
      const countSql = `SELECT COUNT(*) as total FROM persons p ${whereClause}`;
      const countParams = search.trim() ? [`%${search}%`] : [];
      const countResult = await pool.query(countSql, countParams);
      const total = parseInt(countResult.rows[0].total);

      res.json({
        celebrities: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get celebrities error:', error);
      res.status(500).json({ error: 'Failed to fetch celebrities' });
    }
  }

  // Get celebrity by ID with full details
  static async getById(req, res) {
    try {
      const { id } = req.params;

      // Get celebrity basic info
      const celebrityResult = await pool.query(`
        SELECT * FROM persons WHERE id = $1
      `, [id]);

      if (celebrityResult.rows.length === 0) {
        return res.status(404).json({ error: 'Celebrity not found' });
      }

      const celebrity = celebrityResult.rows[0];

      // Get filmography
      const filmographyResult = await pool.query(`
        SELECT m.id, m.title, m.release_date, m.poster_url,
               cc.role, cc.character_name, cc.department,
               COALESCE(AVG(r.rating), 0) as average_rating
        FROM cast_crew cc
        JOIN movies m ON cc.movie_id = m.id
        LEFT JOIN ratings r ON m.id = r.movie_id
        WHERE cc.person_id = $1
        GROUP BY m.id, cc.role, cc.character_name, cc.department
        ORDER BY m.release_date DESC
      `, [id]);

      res.json({
        celebrity,
        movies: filmographyResult.rows
      });
    } catch (error) {
      console.error('Get celebrity error:', error);
      res.status(500).json({ error: 'Failed to fetch celebrity' });
    }
  }

  // Search celebrities
  static async search(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length < 2) {
        return res.json({ celebrities: [] });
      }

      const result = await pool.query(`
        SELECT c.id, c.name, c.profile_image, c.known_for,
               COUNT(cc.id) as movie_count
        FROM celebrities c
        LEFT JOIN cast_crew cc ON c.id = cc.celebrity_id
        WHERE c.name ILIKE $1
        GROUP BY c.id
        ORDER BY movie_count DESC, c.name ASC
        LIMIT 20
      `, [`%${q}%`]);

      res.json({ celebrities: result.rows });
    } catch (error) {
      console.error('Search celebrities error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }

  // Get popular celebrities
  static async getPopular(req, res) {
    try {
      const { limit = 10 } = req.query;

      const result = await pool.query(`
        SELECT p.*, COUNT(cc.id) as movie_count
        FROM persons p
        LEFT JOIN cast_crew cc ON p.id = cc.person_id
        GROUP BY p.id
        ORDER BY movie_count DESC
        LIMIT $1
      `, [limit]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get popular celebrities error:', error);
      res.status(500).json({ error: 'Failed to fetch popular celebrities' });
    }
  }

  // Get celebrities born today
  static async getBornToday(req, res) {
    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      const result = await pool.query(`
        SELECT p.*, 
               EXTRACT(YEAR FROM AGE(p.birth_date)) as age,
               COUNT(cc.id) as movie_count
        FROM persons p
        LEFT JOIN cast_crew cc ON p.id = cc.person_id
        WHERE EXTRACT(MONTH FROM p.birth_date) = $1 
        AND EXTRACT(DAY FROM p.birth_date) = $2
        AND p.birth_date IS NOT NULL
        GROUP BY p.id
        ORDER BY movie_count DESC
      `, [month, day]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get born today error:', error);
      res.status(500).json({ error: 'Failed to fetch celebrities born today' });
    }
  }

  // Get celebrity filmography
  static async getFilmography(req, res) {
    try {
      const { id } = req.params;
      const { department = 'all' } = req.query;

      let whereClause = 'WHERE cc.celebrity_id = $1';
      let queryParams = [id];

      if (department !== 'all') {
        whereClause += ' AND cc.department = $2';
        queryParams.push(department);
      }

      const result = await pool.query(`
        SELECT m.id, m.title, m.release_date, m.poster_url,
               cc.role, cc.character_name, cc.department,
               COALESCE(AVG(r.rating), 0) as average_rating,
               COUNT(r.id) as rating_count
        FROM cast_crew cc
        JOIN movies m ON cc.movie_id = m.id
        LEFT JOIN ratings r ON m.id = r.movie_id
        ${whereClause}
        GROUP BY m.id, cc.role, cc.character_name, cc.department
        ORDER BY m.release_date DESC
      `, queryParams);

      res.json(result.rows);
    } catch (error) {
      console.error('Get filmography error:', error);
      res.status(500).json({ error: 'Failed to fetch filmography' });
    }
  }

  // TEMPORARY: Fix celebrity data
  static async fixData(req, res) {
    try {
      console.log('🔄 Starting celebrity data fix...');
      
      // Add awards first
      console.log('Adding awards...');
      await pool.query(`
        INSERT INTO celebrity_awards (celebrity_id, award_name, category, year, won) VALUES
        (1, 'Academy Award', 'Best Actor', 2016, TRUE),
        (1, 'Golden Globe', 'Best Actor', 2016, TRUE),
        (2, 'Tony Award', 'Best Actress', 2010, TRUE),
        (2, 'BAFTA Award', 'Best Actress', 2020, FALSE),
        (3, 'Golden Globe', 'Best Actor', 2010, TRUE),
        (4, 'Academy Award', 'Best Actress', 2018, TRUE),
        (4, 'Golden Globe', 'Best Actress', 2018, TRUE),
        (5, 'Academy Award', 'Best Actor', 1994, TRUE),
        (5, 'Academy Award', 'Best Actor', 1995, TRUE)
        ON CONFLICT DO NOTHING
      `);
      console.log('✅ Awards added!');

      // Add social media
      console.log('Adding social media...');
      await pool.query(`
        INSERT INTO celebrity_social_media (celebrity_id, platform, profile_url) VALUES
        (1, 'instagram', 'https://instagram.com/leonardodicaprio'),
        (2, 'instagram', 'https://instagram.com/scarlettjohanssonofficial'),
        (3, 'instagram', 'https://instagram.com/robertdowneyjr'),
        (4, 'instagram', 'https://instagram.com/margotrobbie'),
        (5, 'instagram', 'https://instagram.com/tomhanks')
        ON CONFLICT DO NOTHING
      `);
      console.log('✅ Social media added!');

      res.json({ 
        message: 'Celebrity data fixed successfully!',
        awards: 'Added',
        social: 'Added'
      });
    } catch (error) {
      console.error('❌ Fix data error:', error.message);
      res.status(500).json({ 
        error: 'Failed to fix data',
        details: error.message 
      });
    }
  }

  // TEMPORARY: Clean duplicates
  static async cleanDuplicates(req, res) {
    try {
      // Remove duplicate celebrities first
      await pool.query(`
        DELETE FROM celebrities c1 USING celebrities c2 
        WHERE c1.id > c2.id 
        AND c1.name = c2.name
      `);
      
      // Remove duplicate awards
      await pool.query(`
        DELETE FROM celebrity_awards a1 USING celebrity_awards a2 
        WHERE a1.id > a2.id 
        AND a1.celebrity_id = a2.celebrity_id 
        AND a1.award_name = a2.award_name 
        AND a1.category = a2.category 
        AND a1.year = a2.year
      `);
      
      // Remove duplicate social media
      await pool.query(`
        DELETE FROM celebrity_social_media s1 USING celebrity_social_media s2 
        WHERE s1.id > s2.id 
        AND s1.celebrity_id = s2.celebrity_id 
        AND s1.platform = s2.platform
      `);

      res.json({ message: 'All duplicates cleaned successfully!' });
    } catch (error) {
      console.error('Clean error:', error);
      res.status(500).json({ error: 'Failed to clean duplicates' });
    }
  }

  // TEMPORARY: Reset all celebrities
  static async resetCelebrities(req, res) {
    try {
      // Delete all celebrity data
      await pool.query('DELETE FROM celebrity_social_media');
      await pool.query('DELETE FROM celebrity_awards');
      await pool.query('DELETE FROM celebrities');
      
      // Insert fresh data
      await pool.query(`
        INSERT INTO celebrities (name, birth_date, birth_place, biography, profile_image, height, known_for) VALUES
        ('Leonardo DiCaprio', '1974-11-11', 'Los Angeles, California, USA', 'Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biographical and period films, he has received numerous accolades, including an Academy Award and three Golden Globe Awards. DiCaprio began his career in the late 1980s by appearing in television commercials. He achieved international stardom with Titanic (1997) and has since starred in critically acclaimed films like The Departed, Inception, and The Revenant.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 183, 'Titanic, Inception, The Wolf of Wall Street'),
        ('Scarlett Johansson', '1984-11-22', 'New York City, New York, USA', 'Scarlett Ingrid Johansson is an American actress and singer. The world''s highest-paid actress in 2018 and 2019, she has featured multiple times on the Forbes Celebrity 100 list. Johansson is particularly known for her work in the Marvel Cinematic Universe as Black Widow. She has been nominated for two Academy Awards and has won a Tony Award. Her versatile performances span from indie dramas to blockbuster action films.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', 160, 'Black Widow, Marriage Story, Jojo Rabbit'),
        ('Robert Downey Jr.', '1965-04-04', 'New York City, New York, USA', 'Robert John Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles, then a resurgence of commercial success later in his career. He is best known for playing Tony Stark/Iron Man in the Marvel Cinematic Universe. Downey has also starred in Sherlock Holmes films and received acclaim for his dramatic performances in Chaplin and Tropic Thunder.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 174, 'Iron Man, Sherlock Holmes, Avengers'),
        ('Margot Robbie', '1990-07-02', 'Dalby, Queensland, Australia', 'Margot Elise Robbie is an Australian actress and producer. Known for her work in both blockbuster and independent films, she has received various accolades, including nominations for three Academy Awards and five BAFTA Awards. Robbie gained international recognition with The Wolf of Wall Street and has since starred in critically acclaimed films like I, Tonya, Lady Bird, and the blockbuster hit Barbie. She is also a successful producer through her company LuckyChap Entertainment.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 168, 'Barbie, I, Tonya, The Wolf of Wall Street'),
        ('Tom Hanks', '1956-07-09', 'Concord, California, USA', 'Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide. Hanks has won two Academy Awards for Best Actor for Philadelphia and Forrest Gump. He is known for his everyman persona and has starred in numerous beloved films including Cast Away, Saving Private Ryan, Toy Story franchise, and Apollo 13. He is considered one of America''s cultural icons.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 183, 'Forrest Gump, Cast Away, Saving Private Ryan')
      `);
      
      // Add awards
      await pool.query(`
        INSERT INTO celebrity_awards (celebrity_id, award_name, category, year, won) VALUES
        (1, 'Academy Award', 'Best Actor', 2016, true),
        (1, 'Golden Globe', 'Best Actor', 2016, true),
        (2, 'Tony Award', 'Best Actress', 2010, true),
        (2, 'BAFTA Award', 'Best Actress', 2020, false),
        (3, 'Golden Globe', 'Best Actor', 2010, true),
        (4, 'Academy Award', 'Best Actress', 2018, true),
        (4, 'Golden Globe', 'Best Actress', 2018, true),
        (5, 'Academy Award', 'Best Actor', 1994, true),
        (5, 'Academy Award', 'Best Actor', 1995, true)
      `);
      
      // Add social media
      await pool.query(`
        INSERT INTO celebrity_social_media (celebrity_id, platform, profile_url) VALUES
        (1, 'instagram', 'https://instagram.com/leonardodicaprio'),
        (2, 'instagram', 'https://instagram.com/scarlettjohanssonofficial'),
        (3, 'instagram', 'https://instagram.com/robertdowneyjr'),
        (4, 'instagram', 'https://instagram.com/margotrobbie'),
        (5, 'instagram', 'https://instagram.com/tomhanks')
      `);

      res.json({ message: 'Celebrities reset successfully! Only 5 clean entries now.' });
    } catch (error) {
      console.error('Reset error:', error);
      res.status(500).json({ error: 'Failed to reset celebrities' });
    }
  }
}

module.exports = CelebrityController;