const db = require('../config/database');

async function cleanupDuplicates() {
  try {
    console.log('🧹 Cleaning up duplicate awards...');
    
    // Remove duplicate awards - keep only one of each
    await db.query(`
      DELETE FROM celebrity_awards a1 USING celebrity_awards a2 
      WHERE a1.id > a2.id 
      AND a1.celebrity_id = a2.celebrity_id 
      AND a1.award_name = a2.award_name 
      AND a1.category = a2.category 
      AND a1.year = a2.year
    `);
    
    console.log('✅ Duplicate awards removed!');
    
    // Remove duplicate social media
    await db.query(`
      DELETE FROM celebrity_social_media s1 USING celebrity_social_media s2 
      WHERE s1.id > s2.id 
      AND s1.celebrity_id = s2.celebrity_id 
      AND s1.platform = s2.platform
    `);
    
    console.log('✅ Duplicate social media removed!');
    console.log('🎉 Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanupDuplicates();