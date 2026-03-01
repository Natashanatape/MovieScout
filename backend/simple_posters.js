const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const simplePosters = [
  { title: 'Scam 1992', poster: 'https://picsum.photos/seed/scam1992/300/450' },
  { title: 'Panchayat', poster: 'https://picsum.photos/seed/panchayat/300/450' },
  { title: 'Mirzapur', poster: 'https://picsum.photos/seed/mirzapur/300/450' },
  { title: 'Sacred Games', poster: 'https://picsum.photos/seed/sacredgames/300/450' },
  { title: 'The Kapil Sharma Show', poster: 'https://picsum.photos/seed/kapilsharma/300/450' },
  { title: 'Mahabharat', poster: 'https://picsum.photos/seed/mahabharat/300/450' },
  { title: 'Taarak Mehta Ka Ooltah Chashmah', poster: 'https://picsum.photos/seed/tmkoc/300/450' },
  { title: 'CID', poster: 'https://picsum.photos/seed/cid/300/450' },
  { title: 'Ramayan', poster: 'https://picsum.photos/seed/ramayan/300/450' },
  { title: 'Bigg Boss', poster: 'https://picsum.photos/seed/biggboss/300/450' },
  { title: 'Koffee with Karan', poster: 'https://picsum.photos/seed/koffeewithkaran/300/450' },
  { title: 'Sarabhai vs Sarabhai', poster: 'https://picsum.photos/seed/sarabhai/300/450' },
  { title: 'Kaun Banega Crorepati', poster: 'https://picsum.photos/seed/kbc/300/450' },
  { title: 'Yeh Rishta Kya Kehlata Hai', poster: 'https://picsum.photos/seed/yehrishta/300/450' },
  { title: 'Balika Vadhu', poster: 'https://picsum.photos/seed/balikavadhu/300/450' }
];

async function updateSimplePosters() {
  const client = await pool.connect();
  
  try {
    console.log('🖼️  Updating with simple placeholder posters...\n');
    
    for (const show of simplePosters) {
      await client.query(
        `UPDATE movies SET poster_url = $1 WHERE title = $2 AND type = 'tv_show'`,
        [show.poster, show.title]
      );
      console.log(`✅ ${show.title}`);
    }
    
    console.log('\n✅ Done! Refresh browser now!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updateSimplePosters();
