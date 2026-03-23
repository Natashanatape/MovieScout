const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

class Phase4Controller {
  // Coming Soon - Get upcoming releases
  static async getComingSoon(req, res) {
    try {
      // Comprehensive upcoming movies data
      const upcomingMovies = [
        { id: 1001, title: 'Deadpool 3', description: 'The Merc with a Mouth joins the MCU in this highly anticipated sequel.', release_date: '2025-07-26', runtime: 120, poster_url: 'https://image.tmdb.org/t/p/w500/4q2hz2m8hubgooA6onFwqEYYWWS.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1002, title: 'Avatar: Fire and Ash', description: 'The journey continues on Pandora with new tribes and adventures.', release_date: '2025-12-19', runtime: 180, poster_url: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1003, title: 'Mission: Impossible 8', description: 'Ethan Hunt faces his most dangerous mission yet in this epic conclusion.', release_date: '2025-06-28', runtime: 150, poster_url: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1004, title: 'Fantastic Four', description: 'Marvel\'s First Family finally joins the MCU in this reboot.', release_date: '2025-07-25', runtime: 135, poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1005, title: 'Jurassic World Rebirth', description: 'Dinosaurs return in a new adventure with fresh characters.', release_date: '2025-07-02', runtime: 140, poster_url: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1006, title: 'Superman: Legacy', description: 'A new Superman for a new generation in James Gunn\'s DC Universe.', release_date: '2025-07-11', runtime: 145, poster_url: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1007, title: 'The Batman Part II', description: 'Robert Pattinson returns as the Dark Knight in this sequel.', release_date: '2025-10-03', runtime: 155, poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1008, title: 'Blade', description: 'Mahershala Ali brings the vampire hunter to the MCU.', release_date: '2025-11-07', runtime: 130, poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1009, title: 'Fast X: Part 2', description: 'The Fast saga continues with more high-octane action.', release_date: '2025-04-04', runtime: 140, poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1010, title: 'Shrek 5', description: 'Everyone\'s favorite ogre returns for another adventure.', release_date: '2025-12-23', runtime: 95, poster_url: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1011, title: 'Toy Story 5', description: 'Woody and Buzz return for another heartwarming adventure.', release_date: '2025-06-19', runtime: 100, poster_url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1012, title: 'John Wick: Chapter 5', description: 'Keanu Reeves returns as the legendary assassin.', release_date: '2025-05-23', runtime: 125, poster_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1013, title: 'Spider-Man 4', description: 'Tom Holland swings back as your friendly neighborhood Spider-Man.', release_date: '2025-07-16', runtime: 135, poster_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1014, title: 'Dune: Part Three', description: 'The epic conclusion to Paul Atreides\' journey.', release_date: '2025-12-18', runtime: 165, poster_url: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' },
        { id: 1015, title: 'Avengers: Secret Wars', description: 'The biggest Marvel event comes to the big screen.', release_date: '2025-05-01', runtime: 180, poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', average_rating: 0, rating_count: 0, release_type: 'Theatrical' }
      ];

      res.json({
        movies: upcomingMovies,
        pagination: {
          page: 1,
          limit: 20,
          total: upcomingMovies.length,
          pages: 1
        }
      });
    } catch (error) {
      console.error('Get coming soon error:', error);
      res.status(500).json({ error: 'Failed to fetch upcoming releases' });
    }
  }

  // Set reminder for upcoming movie
  static async setReminder(req, res) {
    try {
      const userId = req.user.id;
      const { movieId } = req.params;
      const { remindDate, notificationType = 'both' } = req.body;

      console.log('Setting reminder:', { userId, movieId, remindDate, notificationType });

      await pool.query(`
        INSERT INTO release_reminders (user_id, movie_id, remind_date, notification_type)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, movie_id) 
        DO UPDATE SET remind_date = $3, notification_type = $4, updated_at = CURRENT_TIMESTAMP
      `, [userId, movieId, remindDate, notificationType]);

      res.json({ message: 'Reminder set successfully' });
    } catch (error) {
      console.error('Set reminder error:', error.message);
      res.status(500).json({ error: 'Failed to set reminder', details: error.message });
    }
  }

  // Delete reminder
  static async deleteReminder(req, res) {
    try {
      const userId = req.user.id;
      const { movieId } = req.params;

      const result = await pool.query(`
        DELETE FROM release_reminders 
        WHERE user_id = $1 AND movie_id = $2
        RETURNING id
      `, [userId, movieId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Reminder not found' });
      }

      res.json({ message: 'Reminder deleted successfully' });
    } catch (error) {
      console.error('Delete reminder error:', error);
      res.status(500).json({ error: 'Failed to delete reminder' });
    }
  }

  // Get user's all reminders
  static async getUserReminders(req, res) {
    try {
      const userId = req.user.id;

      const result = await pool.query(`
        SELECT rr.*, m.title, m.poster_path, m.release_date,
               ur.release_type, ur.anticipation_score
        FROM release_reminders rr
        JOIN movies m ON rr.movie_id = m.id
        LEFT JOIN upcoming_releases ur ON m.id = ur.movie_id
        WHERE rr.user_id = $1 AND rr.remind_date >= CURRENT_DATE
        ORDER BY rr.remind_date ASC
      `, [userId]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get user reminders error:', error);
      res.status(500).json({ error: 'Failed to fetch reminders' });
    }
  }

  // Update reminder settings
  static async updateReminderSettings(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { remindDate, notificationType } = req.body;

      const result = await pool.query(`
        UPDATE release_reminders 
        SET remind_date = COALESCE($1, remind_date),
            notification_type = COALESCE($2, notification_type),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 AND user_id = $4
        RETURNING *
      `, [remindDate, notificationType, id, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Reminder not found' });
      }

      res.json({ message: 'Reminder updated successfully', reminder: result.rows[0] });
    } catch (error) {
      console.error('Update reminder error:', error);
      res.status(500).json({ error: 'Failed to update reminder' });
    }
  }

  // Box Office - Get weekend box office
  static async getBoxOfficeWeekend(req, res) {
    try {
      // Current weekend box office data
      const boxOfficeData = [
        { id: 133, title: 'Spider-Man: No Way Home', poster_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', weekend_rank: 1, weekend_gross: 85000000, total_gross: 610000000, theater_count: 4336 },
        { id: 134, title: 'Top Gun: Maverick', poster_url: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', weekend_rank: 2, weekend_gross: 44000000, total_gross: 718000000, theater_count: 4164 },
        { id: 135, title: 'Avatar: The Way of Water', poster_url: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg', weekend_rank: 3, weekend_gross: 38000000, total_gross: 684000000, theater_count: 4202 },
        { id: 136, title: 'Black Panther: Wakanda Forever', poster_url: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', weekend_rank: 4, weekend_gross: 32000000, total_gross: 453000000, theater_count: 4258 },
        { id: 137, title: 'Jurassic World Dominion', poster_url: 'https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg', weekend_rank: 5, weekend_gross: 28000000, total_gross: 376000000, theater_count: 4676 },
        { id: 138, title: 'Doctor Strange in the Multiverse of Madness', poster_url: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', weekend_rank: 6, weekend_gross: 25000000, total_gross: 411000000, theater_count: 4534 },
        { id: 139, title: 'Minions: The Rise of Gru', poster_url: 'https://image.tmdb.org/t/p/w500/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg', weekend_rank: 7, weekend_gross: 22000000, total_gross: 369000000, theater_count: 4391 },
        { id: 140, title: 'Thor: Love and Thunder', poster_url: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', weekend_rank: 8, weekend_gross: 20000000, total_gross: 343000000, theater_count: 4375 },
        { id: 141, title: 'Lightyear', poster_url: 'https://image.tmdb.org/t/p/w500/ox4goZd956BxqJH6iLwhWPL9ct4.jpg', weekend_rank: 9, weekend_gross: 18000000, total_gross: 226000000, theater_count: 4255 },
        { id: 142, title: 'The Batman', poster_url: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', weekend_rank: 10, weekend_gross: 16000000, total_gross: 369000000, theater_count: 4217 },
        { id: 143, title: 'Sonic the Hedgehog 2', poster_url: 'https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg', weekend_rank: 11, weekend_gross: 14000000, total_gross: 190000000, theater_count: 4032 },
        { id: 144, title: 'Fantastic Beasts: The Secrets of Dumbledore', poster_url: 'https://image.tmdb.org/t/p/w500/jrgifaYeUtTnaH7NF5Drkgjg2MB.jpg', weekend_rank: 12, weekend_gross: 12000000, total_gross: 95000000, theater_count: 3835 },
        { id: 145, title: 'Morbius', poster_url: 'https://image.tmdb.org/t/p/w500/6JjfSchsU6daXk2AKX8EEBjO3Fm.jpg', weekend_rank: 13, weekend_gross: 10000000, total_gross: 73000000, theater_count: 3108 },
        { id: 146, title: 'The Northman', poster_url: 'https://image.tmdb.org/t/p/w500/zhLKlUaF1SEpO58ppHIAyENkwgw.jpg', weekend_rank: 14, weekend_gross: 8500000, total_gross: 34000000, theater_count: 3234 },
        { id: 147, title: 'Everything Everywhere All at Once', poster_url: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', weekend_rank: 15, weekend_gross: 7200000, total_gross: 107000000, theater_count: 2220 }
      ];

      res.json(boxOfficeData);
    } catch (error) {
      console.error('Get box office error:', error);
      res.status(500).json({ error: 'Failed to fetch box office data' });
    }
  }

  // Box Office - Get movie box office details
  static async getMovieBoxOffice(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT * FROM box_office 
        WHERE movie_id = $1 
        ORDER BY date DESC
      `, [id]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get movie box office error:', error);
      res.status(500).json({ error: 'Failed to fetch box office data' });
    }
  }

  // TV Episodes - Get seasons for TV show
  static async getTVSeasons(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT * FROM tv_seasons 
        WHERE tv_show_id = $1 
        ORDER BY season_number ASC
      `, [id]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get TV seasons error:', error);
      res.status(500).json({ error: 'Failed to fetch seasons' });
    }
  }

  // TV Episodes - Get episodes for season
  static async getSeasonEpisodes(req, res) {
    try {
      const { id, seasonNum } = req.params;
      const userId = req.user?.id;

      const seasonResult = await pool.query(`
        SELECT id FROM tv_seasons 
        WHERE tv_show_id = $1 AND season_number = $2
      `, [id, seasonNum]);

      if (seasonResult.rows.length === 0) {
        return res.status(404).json({ error: 'Season not found' });
      }

      const seasonId = seasonResult.rows[0].id;

      let query = `
        SELECT e.*
        ${userId ? ', CASE WHEN ewh.id IS NOT NULL THEN true ELSE false END as watched' : ''}
        FROM tv_episodes e
      `;

      if (userId) {
        query += `
          LEFT JOIN episode_watch_history ewh 
          ON e.id = ewh.episode_id AND ewh.user_id = $2
        `;
      }

      query += ` WHERE e.season_id = $1 ORDER BY e.episode_number ASC`;

      const params = userId ? [seasonId, userId] : [seasonId];
      const result = await pool.query(query, params);

      res.json(result.rows);
    } catch (error) {
      console.error('Get season episodes error:', error);
      res.status(500).json({ error: 'Failed to fetch episodes' });
    }
  }

  // Mark episode as watched
  static async markEpisodeWatched(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await pool.query(`
        INSERT INTO episode_watch_history (user_id, episode_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, episode_id) DO NOTHING
      `, [userId, id]);

      res.json({ message: 'Episode marked as watched' });
    } catch (error) {
      console.error('Mark episode watched error:', error);
      res.status(500).json({ error: 'Failed to mark episode as watched' });
    }
  }

  // Technical Specs - Get movie technical specifications
  static async getTechnicalSpecs(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT * FROM technical_specs WHERE movie_id = $1
      `, [id]);

      res.json(result.rows[0] || {});
    } catch (error) {
      console.error('Get technical specs error:', error);
      res.status(500).json({ error: 'Failed to fetch technical specs' });
    }
  }

  // Release Dates - Get movie release dates
  static async getReleaseDates(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT * FROM release_dates 
        WHERE movie_id = $1 
        ORDER BY release_date ASC
      `, [id]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get release dates error:', error);
      res.status(500).json({ error: 'Failed to fetch release dates' });
    }
  }

  // Companies - Get movie companies
  static async getMovieCompanies(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT c.*, mc.role_type 
        FROM movie_companies mc
        JOIN companies c ON mc.company_id = c.id
        WHERE mc.movie_id = $1
        ORDER BY mc.role_type, c.name
      `, [id]);

      res.json(result.rows);
    } catch (error) {
      console.error('Get movie companies error:', error);
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  }
}

module.exports = Phase4Controller;
