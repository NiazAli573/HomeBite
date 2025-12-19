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

// Step 2: Test signup
function testSignup(csrfToken) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'TestPass123!',
      password2: 'TestPass123!',
      first_name: 'Test',
      last_name: 'User',
      phone: '+923001234567',
      customer_type: 'office_worker'
    });

    const options = {
      hostname: BACKEND,
      path: '/api/auth/signup/customer/',
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
        console.log('\n📊 Signup Test Results:');
        console.log('Status Code:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));
        console.log('\nResponse Body:');
        try {
          const json = JSON.parse(body);
          console.log(JSON.stringify(json, null, 2));
        } catch (e) {
          console.log(body.substring(0, 500));
        }
        
        if (res.statusCode === 201) {
          console.log('\n✅ Signup successful!');
        } else if (res.statusCode === 400) {
          console.log('\n⚠️  Signup failed - Validation error (check response for details)');
        } else if (res.statusCode === 403) {
          console.log('\n❌ CSRF error - Token issue');
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
console.log('🔍 Testing Signup Endpoint...\n');
console.log('Step 1: Getting CSRF token...');

getCsrfToken()
  .then(token => {
    if (token) {
      console.log('✅ CSRF token obtained:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️  No CSRF token in response (might still work)');
    }
    console.log('\nStep 2: Testing signup...');
    return testSignup(token);
  })
  .catch(err => {
    console.error('❌ Test failed:', err.message);
  });

