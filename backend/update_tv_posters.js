const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const posterUpdates = [
  { title: 'Breaking Bad', poster: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' },
  { title: 'Game of Thrones', poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg' },
  { title: 'Stranger Things', poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
  { title: 'The Crown', poster: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg' },
  { title: 'The Mandalorian', poster: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg' },
  { title: 'The Office', poster: 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg' },
  { title: 'Friends', poster: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg' },
  { title: 'The Witcher', poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg' },
  { title: 'Peaky Blinders', poster: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg' },
  { title: 'Money Heist', poster: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg' },
  { title: 'Sherlock', poster: 'https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg' },
  { title: 'The Boys', poster: 'https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg' },
  { title: 'Wednesday', poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg' },
  { title: 'The Last of Us', poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg' },
  { title: 'House of the Dragon', poster: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg' },
  { title: 'Taarak Mehta Ka Ooltah Chashmah', poster: 'https://upload.wikimedia.org/wikipedia/en/d/d8/Taarak_Mehta_Ka_Ooltah_Chashmah.jpg' },
  { title: 'CID', poster: 'https://upload.wikimedia.org/wikipedia/en/9/9a/CID_%28Indian_TV_series%29.jpg' },
  { title: 'Kaun Banega Crorepati', poster: 'https://upload.wikimedia.org/wikipedia/en/8/89/Kaun_Banega_Crorepati_logo.jpg' },
  { title: 'The Kapil Sharma Show', poster: 'https://upload.wikimedia.org/wikipedia/en/f/fc/The_Kapil_Sharma_Show.jpg' },
  { title: 'Mahabharat', poster: 'https://upload.wikimedia.org/wikipedia/en/2/28/Mahabharat_2013_TV_series_poster.jpg' },
  { title: 'Ramayan', poster: 'https://upload.wikimedia.org/wikipedia/en/2/20/Ramayan_title.jpg' },
  { title: 'Bigg Boss', poster: 'https://upload.wikimedia.org/wikipedia/en/4/43/Bigg_Boss_16_poster.jpg' },
  { title: 'Koffee with Karan', poster: 'https://upload.wikimedia.org/wikipedia/en/4/4f/Koffee_with_Karan_Season_8.jpg' },
  { title: 'Sarabhai vs Sarabhai', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Sarabhai_vs_Sarabhai.jpg' },
  { title: 'Mirzapur', poster: 'https://image.tmdb.org/t/p/w500/lj0xPWN59qjXbp5V1iK9PescbbG.jpg' },
  { title: 'Sacred Games', poster: 'https://image.tmdb.org/t/p/w500/xJlFLs0DlR8S5LdIvLlADxQ6Uw8.jpg' },
  { title: 'Scam 1992', poster: 'https://image.tmdb.org/t/p/w500/8TOYlMKfrkXZLBKGKn5fFLWEGse.jpg' },
  { title: 'Panchayat', poster: 'https://image.tmdb.org/t/p/w500/4MVXzfuemPIjJM1aWzF0Y0rFLWy.jpg' }
];

async function updatePosters() {
  const client = await pool.connect();
  
  try {
    console.log('🖼️  Updating TV Show Posters...\n');
    
    for (const show of posterUpdates) {
      await client.query(
        `UPDATE movies SET poster_url = $1 WHERE title = $2 AND type = 'tv_show'`,
        [show.poster, show.title]
      );
      console.log(`✅ Updated: ${show.title}`);
    }
    
    // Add views (rating_count) to all TV shows
    await client.query(`
      UPDATE movies 
      SET rating_count = FLOOR(RANDOM() * 5000000 + 500000)::INTEGER
      WHERE type = 'tv_show' AND rating_count IS NULL
    `);
    
    console.log('\n✅ Added view counts to all TV shows!');
    console.log('\n🎉 All posters and views updated!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updatePosters();
