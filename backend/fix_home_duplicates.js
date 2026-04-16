// Fix duplicate posters on home page by creating different movie sets

const fixHomeDuplicates = () => {
  console.log('🔍 DUPLICATE POSTER ISSUE FOUND:');
  console.log('');
  console.log('❌ Problem: Same movies showing in multiple sections on Home page');
  console.log('');
  console.log('📍 Duplicate Sections:');
  console.log('   1. Trending: movies.slice(0, 6) - First 6 movies');
  console.log('   2. New Releases: movies.slice(6, 12) - Movies 7-12');
  console.log('   3. This Week\'s Highlights: movies.slice(2, 5) - Movies 3-5 (OVERLAP!)');
  console.log('   4. Popular Movies: movies - All movies (OVERLAP!)');
  console.log('   5. Top Rated 2026: movies.slice(0, 4) - First 4 movies (OVERLAP!)');
  console.log('   6. Hidden Gems: movies.slice(3, 8) - Movies 4-8 (OVERLAP!)');
  console.log('');
  console.log('✅ Solution: Use different movie ranges for each section');
  console.log('');
  console.log('📝 Recommended Fix:');
  console.log('   - Trending: movies.slice(0, 6)');
  console.log('   - New Releases: movies.slice(6, 12)');
  console.log('   - This Week\'s Highlights: movies.slice(12, 15)');
  console.log('   - Popular Movies: movies.slice(15, 31) // Show 16 movies');
  console.log('   - Top Rated 2026: movies.slice(31, 35)');
  console.log('   - Hidden Gems: movies.slice(35, 40)');
  console.log('');
  console.log('🎯 This will ensure no duplicate posters across sections!');
};

fixHomeDuplicates();