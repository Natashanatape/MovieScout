const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const indianTVShows = [
  {
    title: 'Taarak Mehta Ka Ooltah Chashmah',
    description: 'A satirical comedy show about the residents of Gokuldham Society and their everyday adventures.',
    release_date: '2008-07-28',
    runtime: 22,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BZmFjYWYwNzktMzk0Zi00YjQ4LTk3NzAtMGQ3ZGY0NjY5YzJkXkEyXkFqcGdeQXVyODAzNzAwOTU@._V1_.jpg',
    type: 'tv_show',
    seasons: 1,
    episodes: 4000
  },
  {
    title: 'CID',
    description: 'Crime Investigation Department officers solve complex criminal cases in Mumbai.',
    release_date: '1998-01-21',
    runtime: 45,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjE2MjkxNjk5NV5BMl5BanBnXkFtZTgwNjI5MTcwMzE@._V1_.jpg',
    type: 'tv_show',
    seasons: 1,
    episodes: 1547
  },
  {
    title: 'Yeh Rishta Kya Kehlata Hai',
    description: 'A family drama following the lives of Akshara and Naitik and their extended family.',
    release_date: '2009-01-12',
    runtime: 22,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYzJhMGY3YzktNzY5Zi00ZjI0LWI5YzYtMjQ3ZGQ0ZjQ0ZjQ0XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg',
    type: 'tv_show',
    seasons: 1,
    episodes: 4500
  },
  {
    title: 'Kaun Banega Crorepati',
    description: 'Indian version of Who Wants to Be a Millionaire hosted by Amitabh Bachchan.',
    release_date: '2000-07-03',
    runtime: 60,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI5XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg',
    type: 'tv_show',
    seasons: 15,
    episodes: 1000
  },
  {
    title: 'The Kapil Sharma Show',
    description: 'Comedy talk show where celebrities are interviewed in a humorous setting.',
    release_date: '2016-04-23',
    runtime: 60,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI1XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg',
    type: 'tv_show',
    seasons: 7,
    episodes: 500
  },
  {
    title: 'Mahabharat',
    description: 'Epic mythological series based on the ancient Indian epic Mahabharata.',
    release_date: '2013-09-16',
    runtime: 45,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYzNzY5NzY5NV5BMl5BanBnXkFtZTgwNjI5MTcwMzE@._V1_.jpg',
    type: 'tv_show',
    seasons: 1,
    episodes: 267
  },
  {
    title: 'Ramayan',
    description: 'Classic mythological series based on the ancient Indian epic Ramayana.',
    release_date: '1987-01-25',
    runtime: 45,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI2XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg',
    type: 'tv_show',
    seasons: 1,
    episodes: 78
  },
  {
    title: 'Bigg Boss',
    description: 'Reality show where celebrities live together in a house isolated from the outside world.',
    release_date: '2006-11-03',
    runtime: 60,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI3XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg',
    type: 'tv_show',
    seasons: 17,
    episodes: 2000
  },
  {
    title: 'Koffee with Karan',
    description: 'Celebrity talk show hosted by Karan Johar featuring Bollywood stars.',
    release_date: '2004-11-19',
    runtime: 60,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI4XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg',
    type: 'tv_show',
    seasons: 8,
    episodes: 150
  },
  {
    title: 'Sarabhai vs Sarabhai',
    description: 'Comedy series about an upper-class family in Mumbai and their quirky relationships.',
    release_date: '2004-11-01',
    runtime: 22,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI5XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg',
    type: 'tv_show',
    seasons: 2,
    episodes: 80
  },
  {
    title: 'Balika Vadhu',
    description: 'Drama series highlighting the issue of child marriage in rural Rajasthan.',
    release_date: '2008-07-21',
    runtime: 22,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI6XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg',
    type: 'tv_show',
    seasons: 2,
    episodes: 2245
  },
  {
    title: 'Mirzapur',
    description: 'Crime thriller series about power struggles in the lawless city of Mirzapur.',
    release_date: '2018-11-16',
    runtime: 50,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BZjJjMzY2YTYtNGZkNy00N2Y0LWJmZDYtZGVmZmQyZjZhNjg5XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg',
    type: 'tv_show',
    seasons: 3,
    episodes: 27
  },
  {
    title: 'Sacred Games',
    description: 'Crime thriller based on Vikram Chandra\'s novel about a Mumbai police officer and a gangster.',
    release_date: '2018-07-06',
    runtime: 50,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BZWQ4ZTNkNzYtZWFjZC00ZmEwLWI4Y2UtZjdkYTRhMWI5ZjI5XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg',
    type: 'tv_show',
    seasons: 2,
    episodes: 16
  },
  {
    title: 'Scam 1992',
    description: 'Financial thriller based on the 1992 Indian stock market scam by Harshad Mehta.',
    release_date: '2020-10-09',
    runtime: 50,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNjE5NzQ2MjYtNzI0My00MWU0LWI4NzYtYjk3YjI2NzRiMTZlXkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg',
    type: 'tv_show',
    seasons: 1,
    episodes: 10
  },
  {
    title: 'Panchayat',
    description: 'Comedy-drama about an engineering graduate who becomes a secretary in a remote village.',
    release_date: '2020-04-03',
    runtime: 35,
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYzI3Zjk2YzAtNzJhZC00ZWRhLWJjZTYtNGQ2YzI3ZmQ5ZmE5XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg',
    type: 'tv_show',
    seasons: 3,
    episodes: 24
  }
];

async function addIndianTVShows() {
  const client = await pool.connect();
  
  try {
    console.log('🇮🇳 Adding Indian TV Shows...\n');
    
    for (const show of indianTVShows) {
      const query = `
        INSERT INTO movies (title, description, release_date, runtime, poster_url, type, seasons, episodes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (title) DO UPDATE 
        SET description = EXCLUDED.description,
            type = EXCLUDED.type,
            seasons = EXCLUDED.seasons,
            episodes = EXCLUDED.episodes
        RETURNING id, title;
      `;
      
      const result = await client.query(query, [
        show.title,
        show.description,
        show.release_date,
        show.runtime,
        show.poster_url,
        show.type,
        show.seasons,
        show.episodes
      ]);
      
      console.log(`✅ Added: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
    }
    
    console.log('\n🎉 All Indian TV shows added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addIndianTVShows();
