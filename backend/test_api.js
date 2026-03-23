const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test movies endpoint
    const moviesRes = await axios.get('http://localhost:5001/api/movies');
    console.log('Movies endpoint:', moviesRes.data.length, 'movies found');
    
    // Test TV shows endpoint
    const tvRes = await axios.get('http://localhost:5001/api/movies/tv-shows');
    console.log('TV Shows endpoint:', tvRes.data.length, 'shows found');
    
    // Test popular endpoint
    const popularRes = await axios.get('http://localhost:5001/api/movies/popular');
    console.log('Popular endpoint:', popularRes.data.length, 'movies found');
    
    // Test trending endpoint
    const trendingRes = await axios.get('http://localhost:5001/api/movies/trending');
    console.log('Trending endpoint:', trendingRes.data.length, 'movies found');
    
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
}

testAPI();