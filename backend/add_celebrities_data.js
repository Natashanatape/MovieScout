const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

const celebrities = [
  { name: 'Leonardo DiCaprio', bio: 'American actor and film producer known for his work in biopics and period films.', birth_date: '1974-11-11', profile_image: 'https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg', known_for: 'Titanic, Inception, The Revenant' },
  { name: 'Tom Hanks', bio: 'American actor and filmmaker known for his comedic and dramatic roles.', birth_date: '1956-07-09', profile_image: 'https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg', known_for: 'Forrest Gump, Cast Away, Saving Private Ryan' },
  { name: 'Scarlett Johansson', bio: 'American actress and singer, one of the highest-grossing box office stars.', birth_date: '1984-11-22', profile_image: 'https://image.tmdb.org/t/p/w500/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg', known_for: 'Black Widow, Lost in Translation, Marriage Story' },
  { name: 'Robert Downey Jr.', bio: 'American actor known for his role as Iron Man in the Marvel Cinematic Universe.', birth_date: '1965-04-04', profile_image: 'https://image.tmdb.org/t/p/w500/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg', known_for: 'Iron Man, Sherlock Holmes, Avengers' },
  { name: 'Meryl Streep', bio: 'American actress often described as the best actress of her generation.', birth_date: '1949-06-22', profile_image: 'https://image.tmdb.org/t/p/w500/emAAzyK1rJ6aiMi0wsWYp51EC3h.jpg', known_for: 'The Devil Wears Prada, Sophie\'s Choice, Mamma Mia!' },
  { name: 'Brad Pitt', bio: 'American actor and film producer, recipient of various accolades.', birth_date: '1963-12-18', profile_image: 'https://image.tmdb.org/t/p/w500/ajNaPmXVVMJFg9GWmu6MJzTaXdV.jpg', known_for: 'Fight Club, Once Upon a Time in Hollywood, Troy' },
  { name: 'Jennifer Lawrence', bio: 'American actress known for her roles in both action and independent films.', birth_date: '1990-08-15', profile_image: 'https://image.tmdb.org/t/p/w500/k6l8BWX1yqfGt95enzEkHoPvON4.jpg', known_for: 'The Hunger Games, Silver Linings Playbook, X-Men' },
  { name: 'Denzel Washington', bio: 'American actor, director, and producer known for his dramatic roles.', birth_date: '1954-12-28', profile_image: 'https://image.tmdb.org/t/p/w500/jj2Gcobpopokal0YstuCQW0ldJ4.jpg', known_for: 'Training Day, Malcolm X, The Equalizer' },
  { name: 'Emma Stone', bio: 'American actress known for her versatility in both comedic and dramatic roles.', birth_date: '1988-11-06', profile_image: 'https://image.tmdb.org/t/p/w500/wqEypkRUUZEcFmPV4O4JpZznmNk.jpg', known_for: 'La La Land, Easy A, The Amazing Spider-Man' },
  { name: 'Morgan Freeman', bio: 'American actor and narrator known for his distinctive deep voice.', birth_date: '1937-06-01', profile_image: 'https://image.tmdb.org/t/p/w500/jPsLqiYGSofU4s6BjrxnefMfabb.jpg', known_for: 'The Shawshank Redemption, Million Dollar Baby, Se7en' },
  { name: 'Natalie Portman', bio: 'Israeli-American actress known for her roles in both blockbusters and independent films.', birth_date: '1981-06-09', profile_image: 'https://image.tmdb.org/t/p/w500/edPU5HxncLWa1YkgRPNkSd68ONG.jpg', known_for: 'Black Swan, V for Vendetta, Star Wars' },
  { name: 'Christian Bale', bio: 'English actor known for his intense method acting and physical transformations.', birth_date: '1974-01-30', profile_image: 'https://image.tmdb.org/t/p/w500/3qx2QFUbG6t6IlzR0F9k3Z6Yhf7.jpg', known_for: 'The Dark Knight, American Psycho, The Fighter' }
];

async function addCelebrities() {
  const client = await pool.connect();
  
  try {
    console.log('⭐ Adding celebrities...\n');
    
    // Check if persons table exists, if not create it
    await client.query(`
      CREATE TABLE IF NOT EXISTS persons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        biography TEXT,
        birth_date DATE,
        profile_image VARCHAR(500),
        known_for VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    for (const celeb of celebrities) {
      await client.query(
        `INSERT INTO persons (name, biography, birth_date, profile_image, known_for)
         VALUES ($1, $2, $3, $4, $5)`,
        [celeb.name, celeb.bio, celeb.birth_date, celeb.profile_image, celeb.known_for]
      );
      console.log(`  ✅ ${celeb.name}`);
    }
    
    console.log('\n✅ 12 celebrities added!');
    console.log('✅ Celebrities page is ready!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addCelebrities();
