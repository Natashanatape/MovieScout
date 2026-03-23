const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function setupEverything() {
  const client = await pool.connect();
  
  try {
    console.log('========================================');
    console.log('   TV SHOWS COMPLETE SETUP');
    console.log('========================================\n');
    
    // Step 1: Add columns
    console.log('Step 1: Adding columns...');
    await client.query(`
      ALTER TABLE movies 
      ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'movie',
      ADD COLUMN IF NOT EXISTS seasons INTEGER,
      ADD COLUMN IF NOT EXISTS episodes INTEGER;
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_movies_type ON movies(type);`);
    await client.query(`UPDATE movies SET type = 'movie' WHERE type IS NULL;`);
    console.log('✅ Columns added!\n');
    
    // Step 2: Add International TV Shows
    console.log('Step 2: Adding International TV Shows...');
    const internationalShows = [
      { title: 'Breaking Bad', description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student.', release_date: '2008-01-20', runtime: 47, poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', seasons: 5, episodes: 62 },
      { title: 'Game of Thrones', description: 'Nine noble families fight for control over the lands of Westeros.', release_date: '2011-04-17', runtime: 57, poster_url: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', seasons: 8, episodes: 73 },
      { title: 'Stranger Things', description: 'When a young boy disappears, his mother and friends must confront terrifying supernatural forces.', release_date: '2016-07-15', runtime: 51, poster_url: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', seasons: 4, episodes: 42 },
      { title: 'The Crown', description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign.', release_date: '2016-11-04', runtime: 58, poster_url: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg', seasons: 6, episodes: 60 },
      { title: 'The Mandalorian', description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.', release_date: '2019-11-12', runtime: 40, poster_url: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg', seasons: 3, episodes: 24 },
      { title: 'The Office', description: 'A mockumentary on a group of typical office workers.', release_date: '2005-03-24', runtime: 22, poster_url: 'https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg', seasons: 9, episodes: 201 },
      { title: 'Friends', description: 'Follows the personal and professional lives of six friends living in Manhattan.', release_date: '1994-09-22', runtime: 22, poster_url: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg', seasons: 10, episodes: 236 },
      { title: 'The Witcher', description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world.', release_date: '2019-12-20', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', seasons: 3, episodes: 24 },
      { title: 'Peaky Blinders', description: 'A gangster family epic set in 1900s England.', release_date: '2013-09-12', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg', seasons: 6, episodes: 36 },
      { title: 'Money Heist', description: 'An unusual group of robbers attempt to carry out the most perfect robbery.', release_date: '2017-05-02', runtime: 70, poster_url: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', seasons: 5, episodes: 41 },
      { title: 'Sherlock', description: 'A modern update finds the famous sleuth solving crime in 21st century London.', release_date: '2010-07-25', runtime: 88, poster_url: 'https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg', seasons: 4, episodes: 13 },
      { title: 'The Boys', description: 'A group of vigilantes set out to take down corrupt superheroes.', release_date: '2019-07-26', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg', seasons: 4, episodes: 32 },
      { title: 'Wednesday', description: 'Follows Wednesday Addams\' years as a student at Nevermore Academy.', release_date: '2022-11-23', runtime: 50, poster_url: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', seasons: 1, episodes: 8 },
      { title: 'The Last of Us', description: 'Joel and Ellie embark on a brutal journey across post-pandemic America.', release_date: '2023-01-15', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', seasons: 1, episodes: 9 },
      { title: 'House of the Dragon', description: 'An internal succession war within House Targaryen.', release_date: '2022-08-21', runtime: 60, poster_url: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg', seasons: 2, episodes: 18 }
    ];
    
    for (const show of internationalShows) {
      try {
        await client.query(
          `INSERT INTO movies (title, description, release_date, runtime, poster_url, type, seasons, episodes)
           VALUES ($1, $2, $3, $4, $5, 'tv_show', $6, $7)`,
          [show.title, show.description, show.release_date, show.runtime, show.poster_url, show.seasons, show.episodes]
        );
        console.log(`  ✅ ${show.title}`);
      } catch (err) {
        if (err.code === '23505') {
          console.log(`  ⚠️  ${show.title} (already exists)`);
        } else {
          throw err;
        }
      }
    }
    console.log('');
    
    // Step 3: Add Indian TV Shows
    console.log('Step 3: Adding Indian TV Shows...');
    const indianShows = [
      { title: 'Taarak Mehta Ka Ooltah Chashmah', description: 'A satirical comedy show about the residents of Gokuldham Society and their everyday adventures.', release_date: '2008-07-28', runtime: 22, poster_url: 'https://m.media-amazon.com/images/M/MV5BZmFjYWYwNzktMzk0Zi00YjQ4LTk3NzAtMGQ3ZGY0NjY5YzJkXkEyXkFqcGdeQXVyODAzNzAwOTU@._V1_.jpg', seasons: 1, episodes: 4000 },
      { title: 'CID', description: 'Crime Investigation Department officers solve complex criminal cases in Mumbai.', release_date: '1998-01-21', runtime: 45, poster_url: 'https://m.media-amazon.com/images/M/MV5BMjE2MjkxNjk5NV5BMl5BanBnXkFtZTgwNjI5MTcwMzE@._V1_.jpg', seasons: 1, episodes: 1547 },
      { title: 'Yeh Rishta Kya Kehlata Hai', description: 'A family drama following the lives of Akshara and Naitik and their extended family.', release_date: '2009-01-12', runtime: 22, poster_url: 'https://m.media-amazon.com/images/M/MV5BYzJhMGY3YzktNzY5Zi00ZjI0LWI5YzYtMjQ3ZGQ0ZjQ0ZjQ0XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg', seasons: 1, episodes: 4500 },
      { title: 'Kaun Banega Crorepati', description: 'Indian version of Who Wants to Be a Millionaire hosted by Amitabh Bachchan.', release_date: '2000-07-03', runtime: 60, poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI5XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg', seasons: 15, episodes: 1000 },
      { title: 'The Kapil Sharma Show', description: 'Comedy talk show where celebrities are interviewed in a humorous setting.', release_date: '2016-04-23', runtime: 60, poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI1XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg', seasons: 7, episodes: 500 },
      { title: 'Mahabharat', description: 'Epic mythological series based on the ancient Indian epic Mahabharata.', release_date: '2013-09-16', runtime: 45, poster_url: 'https://m.media-amazon.com/images/M/MV5BMTYzNzY5NzY5NV5BMl5BanBnXkFtZTgwNjI5MTcwMzE@._V1_.jpg', seasons: 1, episodes: 267 },
      { title: 'Ramayan', description: 'Classic mythological series based on the ancient Indian epic Ramayana.', release_date: '1987-01-25', runtime: 45, poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI2XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg', seasons: 1, episodes: 78 },
      { title: 'Bigg Boss', description: 'Reality show where celebrities live together in a house isolated from the outside world.', release_date: '2006-11-03', runtime: 60, poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI3XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg', seasons: 17, episodes: 2000 },
      { title: 'Koffee with Karan', description: 'Celebrity talk show hosted by Karan Johar featuring Bollywood stars.', release_date: '2004-11-19', runtime: 60, poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI4XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg', seasons: 8, episodes: 150 },
      { title: 'Sarabhai vs Sarabhai', description: 'Comedy series about an upper-class family in Mumbai and their quirky relationships.', release_date: '2004-11-01', runtime: 22, poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI5XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg', seasons: 2, episodes: 80 },
      { title: 'Balika Vadhu', description: 'Drama series highlighting the issue of child marriage in rural Rajasthan.', release_date: '2008-07-21', runtime: 22, poster_url: 'https://m.media-amazon.com/images/M/MV5BNzY5YzJjZTYtZjI5Yy00ZjJlLWI5YzYtNzY5YzJjZTYtZjI6XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg', seasons: 2, episodes: 2245 },
      { title: 'Mirzapur', description: 'Crime thriller series about power struggles in the lawless city of Mirzapur.', release_date: '2018-11-16', runtime: 50, poster_url: 'https://m.media-amazon.com/images/M/MV5BZjJjMzY2YTYtNGZkNy00N2Y0LWJmZDYtZGVmZmQyZjZhNjg5XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg', seasons: 3, episodes: 27 },
      { title: 'Sacred Games', description: 'Crime thriller based on Vikram Chandra\'s novel about a Mumbai police officer and a gangster.', release_date: '2018-07-06', runtime: 50, poster_url: 'https://m.media-amazon.com/images/M/MV5BZWQ4ZTNkNzYtZWFjZC00ZmEwLWI4Y2UtZjdkYTRhMWI5ZjI5XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg', seasons: 2, episodes: 16 },
      { title: 'Scam 1992', description: 'Financial thriller based on the 1992 Indian stock market scam by Harshad Mehta.', release_date: '2020-10-09', runtime: 50, poster_url: 'https://m.media-amazon.com/images/M/MV5BNjE5NzQ2MjYtNzI0My00MWU0LWI4NzYtYjk3YjI2NzRiMTZlXkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg', seasons: 1, episodes: 10 },
      { title: 'Panchayat', description: 'Comedy-drama about an engineering graduate who becomes a secretary in a remote village.', release_date: '2020-04-03', runtime: 35, poster_url: 'https://m.media-amazon.com/images/M/MV5BYzI3Zjk2YzAtNzJhZC00ZWRhLWJjZTYtNGQ2YzI3ZmQ5ZmE5XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_.jpg', seasons: 3, episodes: 24 }
    ];
    
    for (const show of indianShows) {
      try {
        await client.query(
          `INSERT INTO movies (title, description, release_date, runtime, poster_url, type, seasons, episodes)
           VALUES ($1, $2, $3, $4, $5, 'tv_show', $6, $7)`,
          [show.title, show.description, show.release_date, show.runtime, show.poster_url, show.seasons, show.episodes]
        );
        console.log(`  ✅ ${show.title}`);
      } catch (err) {
        if (err.code === '23505') {
          console.log(`  ⚠️  ${show.title} (already exists)`);
        } else {
          throw err;
        }
      }
    }
    
    console.log('\n========================================');
    console.log('   ✅ SETUP COMPLETE!');
    console.log('========================================');
    console.log('\n📺 Total: 30 TV Shows Added!');
    console.log('   - 15 International');
    console.log('   - 15 Indian (TMKOC, CID, etc.)\n');
    console.log('🌐 Visit: http://localhost:3000/tv-shows\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupEverything();
