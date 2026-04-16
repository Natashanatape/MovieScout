const db = require('./src/config/database');

const updateBollywoodPosters = async () => {
  const updates = [
    { id: 40, title: '3 Idiots', poster_url: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw_NBAq0Y.jpg' },
    { id: 43, title: 'Lagaan', poster_url: 'https://image.tmdb.org/t/p/w500/fUqVIjnfRKtqAMBLVF2NjHh4bOZ.jpg' },
    { id: 44, title: 'Taare Zameen Par', poster_url: 'https://image.tmdb.org/t/p/w500/lhKGLTnNTKl4VHUeNNKZbcBXUKm.jpg' },
    { id: 47, title: 'Bajrangi Bhaijaan', poster_url: 'https://image.tmdb.org/t/p/w500/4lI3MKvOlAn9b0QqK7CCWbJBJxz.jpg' },
    { id: 48, title: 'Andhadhun', poster_url: 'https://image.tmdb.org/t/p/w500/h6lHFB8Vl4dTGKgcVCTyicWKmqJ.jpg' },
    { id: 49, title: 'Gully Boy', poster_url: 'https://image.tmdb.org/t/p/w500/5LvpDDgLhJCXbw8VNlhvmKZyiUb.jpg' }
  ];

  try {
    console.log('🎬 Updating Bollywood movie posters...\n');
    
    for (const movie of updates) {
      await db.query(
        'UPDATE movies SET poster_url = $1 WHERE id = $2',
        [movie.poster_url, movie.id]
      );
      console.log(`✅ Updated ${movie.title} poster`);
    }
    
    console.log('\n🎯 All Bollywood movie posters updated successfully!');
    
    // Verify updates
    const result = await db.query(
      'SELECT id, title, poster_url FROM movies WHERE id IN (40, 43, 44, 47, 48, 49) ORDER BY id'
    );
    
    console.log('\n📋 Updated posters:');
    result.rows.forEach(movie => {
      console.log(`${movie.id}. ${movie.title}`);
      console.log(`   ${movie.poster_url}\n`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
};

updateBollywoodPosters();