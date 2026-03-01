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
  { name: 'Leonardo DiCaprio', birth_date: '1974-11-11', profile_image: 'https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg', known_for: 'Titanic, Inception, The Revenant' },
  { name: 'Tom Hanks', birth_date: '1956-07-09', profile_image: 'https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg', known_for: 'Forrest Gump, Cast Away, Saving Private Ryan' },
  { name: 'Morgan Freeman', birth_date: '1937-06-01', profile_image: 'https://image.tmdb.org/t/p/w500/jPsLqiYGSofU4s6BjrxnefMfabb.jpg', known_for: 'The Shawshank Redemption, The Dark Knight' },
  { name: 'Christian Bale', birth_date: '1974-01-30', profile_image: 'https://image.tmdb.org/t/p/w500/3qx2QFUbG6t6IlzR0F9k3Z6Yhf7.jpg', known_for: 'The Dark Knight, American Psycho' },
  { name: 'Al Pacino', birth_date: '1940-04-25', profile_image: 'https://image.tmdb.org/t/p/w500/2dGBb1fOcNdZjtQToVPFxXjm4ke.jpg', known_for: 'The Godfather, Scarface' },
  { name: 'Robert De Niro', birth_date: '1943-08-17', profile_image: 'https://image.tmdb.org/t/p/w500/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg', known_for: 'Taxi Driver, Goodfellas' },
  { name: 'Brad Pitt', birth_date: '1963-12-18', profile_image: 'https://image.tmdb.org/t/p/w500/ajNaPmXVVMJFg9GWmu6MJzTaXdV.jpg', known_for: 'Fight Club, Once Upon a Time in Hollywood' },
  { name: 'Keanu Reeves', birth_date: '1964-09-02', profile_image: 'https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg', known_for: 'The Matrix, John Wick' },
  { name: 'Samuel L. Jackson', birth_date: '1948-12-21', profile_image: 'https://image.tmdb.org/t/p/w500/AiAYAqwpM5xmiFrAIeQvUXDCVvo.jpg', known_for: 'Pulp Fiction, Avengers' },
  { name: 'Scarlett Johansson', birth_date: '1984-11-22', profile_image: 'https://image.tmdb.org/t/p/w500/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg', known_for: 'Avengers, Lost in Translation' },
  { name: 'Meryl Streep', birth_date: '1949-06-22', profile_image: 'https://image.tmdb.org/t/p/w500/emAAzyK1rJ6aiMi0wsWYp51EC3h.jpg', known_for: 'The Devil Wears Prada, Sophie\'s Choice' },
  { name: 'Denzel Washington', birth_date: '1954-12-28', profile_image: 'https://image.tmdb.org/t/p/w500/jj2Gcobpopokal0YstuCQW0ldJ4.jpg', known_for: 'Training Day, Malcolm X' }
];

async function addCelebrities() {
  const client = await pool.connect();
  
  try {
    console.log('⭐ ADDING CELEBRITIES...\n');

    for (const celeb of celebrities) {
      const result = await client.query(
        `INSERT INTO persons (name, birth_date, profile_image, known_for) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [celeb.name, celeb.birth_date, celeb.profile_image, celeb.known_for]
      );
      console.log(`✅ Added: ${celeb.name} (ID: ${result.rows[0].id})`);
    }

    console.log('\n✅ ALL CELEBRITIES ADDED!\n');

    const result = await client.query(`SELECT id, name, known_for FROM persons ORDER BY id`);
    console.log('📊 CELEBRITIES IN DATABASE:\n');
    result.rows.forEach(row => {
      console.log(`${row.id}. ${row.name} - ${row.known_for}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addCelebrities();
