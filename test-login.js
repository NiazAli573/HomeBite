const https = require('https');

const BACKEND = 'web-production-ef53f.up.railway.app';
const API_BASE = `https://${BACKEND}/api`;

// Step 1: Get CSRF token
function getCsrfToken() {
  return new Promise((resolve, reject) => {
    https.get(`${API_BASE}/auth/csrf/`, (res) => {
      let cookies = res.headers['set-cookie'] || [];
      let csrfToken = null;
      
      cookies.forEach(cookie => {
        if (cookie.includes('csrftoken=')) {
          csrfToken = cookie.split('csrftoken=')[1].split(';')[0];
        }
      });
      
      resolve(csrfToken);
    }).on('error', reject);
  });
}

// Step 2: Test login
function testLogin(csrfToken, username, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      username: username,
      password: password
    });

    const options = {
      hostname: BACKEND,
      path: '/api/auth/login/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Origin': 'https://home-bite-13041.vercel.app',
        'X-CSRFToken': csrfToken || '',
        'Cookie': csrfToken ? `csrftoken=${csrfToken}` : ''
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        console.log('\n📊 Login Test Results:');
        console.log('Status Code:', res.statusCode);
        console.log('CORS Headers:', res.headers['access-control-allow-origin']);
        console.log('\nResponse Body:');
        try {
          const json = JSON.parse(body);
          console.log(JSON.stringify(json, null, 2));
        } catch (e) {
          console.log(body.substring(0, 500));
        }
        
        if (res.statusCode === 200) {
          console.log('\n✅ Login endpoint is working!');
        } else if (res.statusCode === 401) {
          console.log('\n⚠️  Login failed - Invalid credentials (this is expected if user doesn\'t exist)');
        } else if (res.statusCode === 403) {
          console.log('\n❌ CSRF error');
        } else if (res.statusCode === 500) {
          console.log('\n❌ Server error - Check backend logs');
        } else {
          console.log('\n❌ Unexpected error');
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('Request error:', e.message);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

// Run test
console.log('🔍 Testing Login Endpoint...\n');
console.log('Step 1: Getting CSRF token...');

getCsrfToken()
  .then(token => {
    if (token) {
      console.log('✅ CSRF token obtained');
    } else {
      console.log('⚠️  No CSRF token in response');
    }
    console.log('\nStep 2: Testing login with test credentials...');
    // Test with a username that probably doesn't exist
    return testLogin(token, 'testuser', 'testpass');
  })
  .catch(err => {
    console.error('❌ Test failed:', err.message);
  });


