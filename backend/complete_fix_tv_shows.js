const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function completeFixTVShows() {
  const client = await pool.connect();
  
  try {
    console.log('========================================');
    console.log('   COMPLETE TV SHOWS FIX');
    console.log('========================================\n');
    
    // Step 1: Delete ALL TV shows
    console.log('Step 1: Removing all existing TV shows...');
    await client.query(`DELETE FROM movies WHERE type = 'tv_show'`);
    console.log('✅ Cleared!\n');
    
    // Step 2: Insert fresh data with proper posters and views
    console.log('Step 2: Adding fresh TV shows with proper data...\n');
    
    const tvShows = [
      { title: 'Breaking Bad', desc: 'A high school chemistry teacher turned methamphetamine producer.', date: '2008-01-20', runtime: 47, poster: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg', seasons: 5, episodes: 62, views: 2500000 },
      { title: 'Game of Thrones', desc: 'Nine noble families fight for control over Westeros.', date: '2011-04-17', runtime: 57, poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', seasons: 8, episodes: 73, views: 3200000 },
      { title: 'Stranger Things', desc: 'When a young boy disappears, supernatural forces emerge.', date: '2016-07-15', runtime: 51, poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', seasons: 4, episodes: 42, views: 2800000 },
      { title: 'The Crown', desc: 'The political rivalries and romance of Queen Elizabeth II.', date: '2016-11-04', runtime: 58, poster: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg', seasons: 6, episodes: 60, views: 1900000 },
      { title: 'The Mandalorian', desc: 'A lone bounty hunter in the outer reaches of the galaxy.', date: '2019-11-12', runtime: 40, poster: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg', seasons: 3, episodes: 24, views: 2100000 },
      { title: 'The Office', desc: 'A mockumentary on typical office workers.', date: '2005-03-24', runtime: 22, poster: 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg', seasons: 9, episodes: 201, views: 3500000 },
      { title: 'Friends', desc: 'Six friends living in Manhattan navigate life and love.', date: '1994-09-22', runtime: 22, poster: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg', seasons: 10, episodes: 236, views: 4200000 },
      { title: 'The Witcher', desc: 'Geralt of Rivia, a monster hunter, struggles to find his place.', date: '2019-12-20', runtime: 60, poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', seasons: 3, episodes: 24, views: 1800000 },
      { title: 'Peaky Blinders', desc: 'A gangster family epic set in 1900s England.', date: '2013-09-12', runtime: 60, poster: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg', seasons: 6, episodes: 36, views: 2200000 },
      { title: 'Money Heist', desc: 'Robbers attempt the most perfect robbery in Spanish history.', date: '2017-05-02', runtime: 70, poster: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', seasons: 5, episodes: 41, views: 2600000 },
      { title: 'Sherlock', desc: 'A modern update of the famous sleuth solving crimes.', date: '2010-07-25', runtime: 88, poster: 'https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg', seasons: 4, episodes: 13, views: 2400000 },
      { title: 'The Boys', desc: 'Vigilantes take down corrupt superheroes.', date: '2019-07-26', runtime: 60, poster: 'https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg', seasons: 4, episodes: 32, views: 2300000 },
      { title: 'Wednesday', desc: 'Wednesday Addams at Nevermore Academy.', date: '2022-11-23', runtime: 50, poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', seasons: 1, episodes: 8, views: 1700000 },
      { title: 'The Last of Us', desc: 'Joel and Ellie journey across post-pandemic America.', date: '2023-01-15', runtime: 60, poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', seasons: 1, episodes: 9, views: 2000000 },
      { title: 'House of the Dragon', desc: 'A succession war within House Targaryen.', date: '2022-08-21', runtime: 60, poster: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg', seasons: 2, episodes: 18, views: 2100000 },
      { title: 'Taarak Mehta Ka Ooltah Chashmah', desc: 'Comedy about residents of Gokuldham Society.', date: '2008-07-28', runtime: 22, poster: 'https://upload.wikimedia.org/wikipedia/en/d/d8/Taarak_Mehta_Ka_Ooltah_Chashmah.jpg', seasons: 1, episodes: 4000, views: 5000000 },
      { title: 'CID', desc: 'Crime Investigation Department solves complex cases.', date: '1998-01-21', runtime: 45, poster: 'https://upload.wikimedia.org/wikipedia/en/9/9a/CID_%28Indian_TV_series%29.jpg', seasons: 1, episodes: 1547, views: 3800000 },
      { title: 'Kaun Banega Crorepati', desc: 'Indian version of Who Wants to Be a Millionaire.', date: '2000-07-03', runtime: 60, poster: 'https://upload.wikimedia.org/wikipedia/en/8/89/Kaun_Banega_Crorepati_logo.jpg', seasons: 15, episodes: 1000, views: 4500000 },
      { title: 'The Kapil Sharma Show', desc: 'Comedy talk show with celebrity interviews.', date: '2016-04-23', runtime: 60, poster: 'https://upload.wikimedia.org/wikipedia/en/f/fc/The_Kapil_Sharma_Show.jpg', seasons: 7, episodes: 500, views: 3200000 },
      { title: 'Mahabharat', desc: 'Epic mythological series based on Mahabharata.', date: '2013-09-16', runtime: 45, poster: 'https://upload.wikimedia.org/wikipedia/en/2/28/Mahabharat_2013_TV_series_poster.jpg', seasons: 1, episodes: 267, views: 2900000 },
      { title: 'Ramayan', desc: 'Classic mythological series based on Ramayana.', date: '1987-01-25', runtime: 45, poster: 'https://upload.wikimedia.org/wikipedia/en/2/20/Ramayan_title.jpg', seasons: 1, episodes: 78, views: 3500000 },
      { title: 'Bigg Boss', desc: 'Reality show with celebrities in an isolated house.', date: '2006-11-03', runtime: 60, poster: 'https://upload.wikimedia.org/wikipedia/en/4/43/Bigg_Boss_16_poster.jpg', seasons: 17, episodes: 2000, views: 4000000 },
      { title: 'Koffee with Karan', desc: 'Celebrity talk show hosted by Karan Johar.', date: '2004-11-19', runtime: 60, poster: 'https://upload.wikimedia.org/wikipedia/en/4/4f/Koffee_with_Karan_Season_8.jpg', seasons: 8, episodes: 150, views: 2500000 },
      { title: 'Sarabhai vs Sarabhai', desc: 'Comedy about an upper-class Mumbai family.', date: '2004-11-01', runtime: 22, poster: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Sarabhai_vs_Sarabhai.jpg', seasons: 2, episodes: 80, views: 1800000 },
      { title: 'Mirzapur', desc: 'Crime thriller about power struggles in Mirzapur.', date: '2018-11-16', runtime: 50, poster: 'https://image.tmdb.org/t/p/w500/lj0xPWN59qjXbp5V1iK9PescbbG.jpg', seasons: 3, episodes: 27, views: 2700000 },
      { title: 'Sacred Games', desc: 'Mumbai police officer and gangster thriller.', date: '2018-07-06', runtime: 50, poster: 'https://image.tmdb.org/t/p/w500/xJlFLs0DlR8S5LdIvLlADxQ6Uw8.jpg', seasons: 2, episodes: 16, views: 2400000 },
      { title: 'Scam 1992', desc: 'Financial thriller based on 1992 stock market scam.', date: '2020-10-09', runtime: 50, poster: 'https://image.tmdb.org/t/p/w500/8TOYlMKfrkXZLBKGKn5fFLWEGse.jpg', seasons: 1, episodes: 10, views: 2200000 },
      { title: 'Panchayat', desc: 'Engineering graduate becomes village secretary.', date: '2020-04-03', runtime: 35, poster: 'https://image.tmdb.org/t/p/w500/4MVXzfuemPIjJM1aWzF0Y0rFLWy.jpg', seasons: 3, episodes: 24, views: 2000000 }
    ];
    
    for (const show of tvShows) {
      await client.query(
        `INSERT INTO movies (title, description, release_date, runtime, poster_url, type, seasons, episodes, rating_count)
         VALUES ($1, $2, $3, $4, $5, 'tv_show', $6, $7, $8)`,
        [show.title, show.desc, show.date, show.runtime, show.poster, show.seasons, show.episodes, show.views]
      );
      console.log(`  ✅ ${show.title}`);
    }
    
    console.log('\n========================================');
    console.log('   ✅ COMPLETE! 28 TV SHOWS ADDED');
    console.log('========================================\n');
    console.log('🌐 Visit: http://localhost:3000/tv-shows\n');
    console.log('⚠️  IMPORTANT: Restart backend server!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

completeFixTVShows();
