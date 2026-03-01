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
      const { page = 1, limit = 20, months = 3 } = req.query;
      const offset = (page - 1) * limit;
      
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + parseInt(months));

      const result = await pool.query(`
        SELECT m.*, ur.release_date, ur.release_type, ur.anticipation_score,
               COALESCE(AVG(r.rating), 0) as average_rating,
               COUNT(DISTINCT r.id) as rating_count
        FROM upcoming_releases ur
        JOIN movies m ON ur.movie_id = m.id
        LEFT JOIN ratings r ON m.id = r.movie_id
        WHERE ur.release_date >= CURRENT_DATE 
        AND ur.release_date <= $1
        GROUP BY m.id, ur.release_date, ur.release_type, ur.anticipation_score
        ORDER BY ur.release_date ASC
        LIMIT $2 OFFSET $3
      `, [futureDate, limit, offset]);

      const countResult = await pool.query(`
        SELECT COUNT(*) as total FROM upcoming_releases 
        WHERE release_date >= CURRENT_DATE AND release_date <= $1
      `, [futureDate]);

      res.json({
        movies: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          pages: Math.ceil(countResult.rows[0].total / limit)
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
      const result = await pool.query(`
        SELECT m.*, bo.weekend_rank, bo.weekend_gross, 
               bo.total_gross, bo.theater_count, bo.date
        FROM box_office bo
        JOIN movies m ON bo.movie_id = m.id
        WHERE bo.date = (SELECT MAX(date) FROM box_office)
        ORDER BY bo.weekend_rank ASC
        LIMIT 10
      `);

      res.json(result.rows);
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
