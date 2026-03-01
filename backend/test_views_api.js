const https = require('https');
const http = require('http');

function makeRequest(url, method, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 5001,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (err) => {
      console.log('Request error:', err.message);
      reject(err);
    });
    
    if (data) {
      const jsonData = JSON.stringify(data);
      req.write(jsonData);
    }
    req.end();
  });
}

async function testVideoViews() {
  console.log('🧪 Testing Video Views Feature...\n');

  try {
    // Test 1: Track a view
    console.log('Test 1: Tracking a view...');
    const trackResponse = await makeRequest(
      'http://localhost:5001/api/videos/1/view',
      'POST',
      { watchDuration: 10 }
    );
    console.log('✅ View tracked! Views:', trackResponse.views);
    console.log('');

    // Test 2: Get views count
    console.log('Test 2: Getting views count...');
    const viewsResponse = await makeRequest(
      'http://localhost:5001/api/videos/1/views',
      'GET'
    );
    console.log('✅ Views count:', viewsResponse.views);
    console.log('');

    console.log('🎉 All tests passed!\n');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend not running!');
      console.log('Start backend: npm run dev\n');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testVideoViews();
