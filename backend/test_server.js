const http = require('http');

console.log('🧪 Testing backend server and images...\n');

// Test 1: Check if backend is running
const testBackend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5001/', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend server is running on port 5001');
        resolve(true);
      } else {
        console.log('❌ Backend server returned status:', res.statusCode);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log('❌ Backend server is NOT running!');
      console.log('   Please start it with: cd backend && npm run dev');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('❌ Backend server timeout - not responding');
      resolve(false);
    });
  });
};

// Test 2: Check if images are accessible
const testImage = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5001/images/gullyboy.jpg', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Images are being served correctly');
        console.log('   Test URL: http://localhost:5001/images/gullyboy.jpg');
        resolve(true);
      } else {
        console.log('❌ Images not accessible, status:', res.statusCode);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log('❌ Cannot access images');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('❌ Image request timeout');
      resolve(false);
    });
  });
};

// Test 3: Check movies API
const testMoviesAPI = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5001/api/movies', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const movies = JSON.parse(data);
          if (Array.isArray(movies) && movies.length > 0) {
            console.log(`✅ Movies API working - ${movies.length} movies found`);
            console.log(`   Sample: ${movies[0].title}`);
            resolve(true);
          } else {
            console.log('⚠️  Movies API returned empty array');
            resolve(false);
          }
        } catch (err) {
          console.log('❌ Movies API returned invalid JSON');
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Cannot access movies API');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('❌ Movies API timeout');
      resolve(false);
    });
  });
};

// Run all tests
(async () => {
  const backendOk = await testBackend();
  
  if (backendOk) {
    await testImage();
    await testMoviesAPI();
    
    console.log('\n📝 Summary:');
    console.log('─'.repeat(50));
    console.log('If all tests passed ✅:');
    console.log('  → Refresh your browser (Ctrl+Shift+R)');
    console.log('  → Images should now appear!');
    console.log('\nIf any test failed ❌:');
    console.log('  → Start backend: cd backend && npm run dev');
    console.log('  → Check PostgreSQL is running');
    console.log('  → Check Redis is running (optional)');
  }
})();
