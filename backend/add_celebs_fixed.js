const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'imdb_clone',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const celebrities = [
  { name: 'Leonardo DiCaprio', birth_date: '1974-11-11', profile_image: 'https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg', biography: 'Known for Titanic, Inception, The Revenant' },
  { name: 'Tom Hanks', birth_date: '1956-07-09', profile_image: 'https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg', biography: 'Known for Forrest Gump, Cast Away, Saving Private Ryan' },
  { name: 'Morgan Freeman', birth_date: '1937-06-01', profile_image: 'https://image.tmdb.org/t/p/w500/jPsLqiYGSofU4s6BjrxnefMfabb.jpg', biography: 'Known for The Shawshank Redemption, The Dark Knight' },
  { name: 'Christian Bale', birth_date: '1974-01-30', profile_image: 'https://image.tmdb.org/t/p/w500/3qx2QFUbG6t6IlzR0F9k3Z6Yhf7.jpg', biography: 'Known for The Dark Knight, American Psycho' },
  { name: 'Al Pacino', birth_date: '1940-04-25', profile_image: 'https://image.tmdb.org/t/p/w500/2dGBb1fOcNdZjtQToVPFxXjm4ke.jpg', biography: 'Known for The Godfather, Scarface' },
  { name: 'Robert De Niro', birth_date: '1943-08-17', profile_image: 'https://image.tmdb.org/t/p/w500/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg', biography: 'Known for Taxi Driver, Goodfellas' },
  { name: 'Brad Pitt', birth_date: '1963-12-18', profile_image: 'https://image.tmdb.org/t/p/w500/ajNaPmXVVMJFg9GWmu6MJzTaXdV.jpg', biography: 'Known for Fight Club, Once Upon a Time in Hollywood' },
  { name: 'Keanu Reeves', birth_date: '1964-09-02', profile_image: 'https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg', biography: 'Known for The Matrix, John Wick' },
  { name: 'Samuel L. Jackson', birth_date: '1948-12-21', profile_image: 'https://image.tmdb.org/t/p/w500/AiAYAqwpM5xmiFrAIeQvUXDCVvo.jpg', biography: 'Known for Pulp Fiction, Avengers' },
  { name: 'Scarlett Johansson', birth_date: '1984-11-22', profile_image: 'https://image.tmdb.org/t/p/w500/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg', biography: 'Known for Avengers, Lost in Translation' },
  { name: 'Meryl Streep', birth_date: '1949-06-22', profile_image: 'https://image.tmdb.org/t/p/w500/emAAzyK1rJ6aiMi0wsWYp51EC3h.jpg', biography: 'Known for The Devil Wears Prada, Sophie\'s Choice' },
  { name: 'Denzel Washington', birth_date: '1954-12-28', profile_image: 'https://image.tmdb.org/t/p/w500/jj2Gcobpopokal0YstuCQW0ldJ4.jpg', biography: 'Known for Training Day, Malcolm X' }
];

async function addCelebrities() {
  const client = await pool.connect();
  
  try {
    console.log('⭐ ADDING CELEBRITIES...\n');

    for (const celeb of celebrities) {
      const result = await client.query(
        `INSERT INTO persons (name, birth_date, profile_image, biography) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [celeb.name, celeb.birth_date, celeb.profile_image, celeb.biography]
      );
      console.log(`✅ ${celeb.name}`);
    }

    console.log('\n✅ DONE! Total:', celebrities.length);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addCelebrities();
