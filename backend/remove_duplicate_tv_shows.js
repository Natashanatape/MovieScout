const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imdb_clone',
  password: 'postgres',
  port: 5432,
});

async function removeDuplicates() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking for duplicate TV shows...\n');
    
    // Find duplicates
    const duplicates = await client.query(`
      SELECT title, COUNT(*) as count
      FROM movies
      WHERE type = 'tv_show'
      GROUP BY title
      HAVING COUNT(*) > 1
    `);
    
    if (duplicates.rows.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }
    
    console.log(`Found ${duplicates.rows.length} duplicate titles:\n`);
    duplicates.rows.forEach(row => {
      console.log(`  - ${row.title} (${row.count} copies)`);
    });
    
    console.log('\n🗑️  Removing duplicates (keeping newest)...\n');
    
    // Delete duplicates, keep only the one with highest ID (newest)
    await client.query(`
      DELETE FROM movies
      WHERE id IN (
        SELECT id
        FROM (
          SELECT id, title,
                 ROW_NUMBER() OVER (PARTITION BY title ORDER BY id DESC) as rn
          FROM movies
          WHERE type = 'tv_show'
        ) t
        WHERE rn > 1
      )
    `);
    
    console.log('✅ Duplicates removed!\n');
    
    // Show final count
    const final = await client.query(`
      SELECT COUNT(*) as total FROM movies WHERE type = 'tv_show'
    `);
    
    console.log(`📺 Total TV Shows: ${final.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

removeDuplicates();
