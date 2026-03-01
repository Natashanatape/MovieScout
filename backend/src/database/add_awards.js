const db = require('../config/database');

async function addAwards() {
  try {
    console.log('🏆 Adding celebrity awards...');
    
    // Simple awards insert
    await db.query(`
      INSERT INTO celebrity_awards (celebrity_id, award_name, category, year, won) VALUES
      (1, 'Academy Award', 'Best Actor', 2016, true),
      (1, 'Golden Globe', 'Best Actor', 2016, true),
      (2, 'Tony Award', 'Best Actress', 2010, true),
      (2, 'BAFTA Award', 'Best Actress', 2020, false),
      (3, 'Golden Globe', 'Best Actor', 2010, true),
      (4, 'Academy Award', 'Best Actress', 2018, true),
      (4, 'Golden Globe', 'Best Actress', 2018, true),
      (5, 'Academy Award', 'Best Actor', 1994, true),
      (5, 'Academy Award', 'Best Actor', 1995, true)
    `);
    
    console.log('✅ Awards added successfully!');
    
    // Add social media
    await db.query(`
      INSERT INTO celebrity_social_media (celebrity_id, platform, profile_url) VALUES
      (1, 'instagram', 'https://instagram.com/leonardodicaprio'),
      (2, 'instagram', 'https://instagram.com/scarlettjohanssonofficial'),
      (3, 'instagram', 'https://instagram.com/robertdowneyjr'),
      (4, 'instagram', 'https://instagram.com/margotrobbie'),
      (5, 'instagram', 'https://instagram.com/tomhanks')
    `);
    
    console.log('✅ Social media added successfully!');
    console.log('🎉 All celebrity data complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addAwards();