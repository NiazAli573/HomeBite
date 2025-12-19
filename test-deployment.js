const https = require('https');

const FRONTEND_URL = 'https://home-bite-13041.vercel.app';
const BACKEND_API = 'https://web-production-ef53f.up.railway.app/api';

console.log('🔍 Testing HomeBite Deployment...\n');
console.log('Frontend:', FRONTEND_URL);
console.log('Backend API:', BACKEND_API);
console.log('');

let testsPassed = 0;
let testsFailed = 0;

function test(url, name, checkResponse = null) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const success = res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 400;
        if (success) {
          console.log(`✅ ${name}: Status ${res.statusCode}`);
          if (checkResponse && checkResponse(data, res)) {
            testsPassed++;
          } else if (!checkResponse) {
            testsPassed++;
          } else {
            testsFailed++;
            console.log(`   ⚠️  Response check failed`);
          }
        } else {
          console.log(`❌ ${name}: Status ${res.statusCode}`);
          testsFailed++;
        }
        resolve();
      });
    }).on('error', (err) => {
      console.log(`❌ ${name}: ${err.message}`);
      testsFailed++;
      resolve();
    });
  });
}

async function runTests() {
  console.log('1️⃣ Testing Backend API Root...');
  await test(`${BACKEND_API}/`, 'Backend API Root');
  
  console.log('\n2️⃣ Testing CSRF Endpoint...');
  await test(`${BACKEND_API}/auth/csrf/`, 'CSRF Endpoint', (data) => {
    return data.includes('csrf') || data.includes('detail');
  });
  
  console.log('\n3️⃣ Testing Auth User Endpoint...');
  await test(`${BACKEND_API}/auth/user/`, 'Auth User Endpoint');
  
  console.log('\n4️⃣ Testing Meals API...');
  await test(`${BACKEND_API}/meals/`, 'Meals API');
  
  console.log('\n5️⃣ Testing Frontend...');
  await test(FRONTEND_URL, 'Frontend');
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  console.log(`   📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('');
  
  if (testsFailed === 0) {
    console.log('🎉 All tests passed! Deployment is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Open frontend in browser: ' + FRONTEND_URL);
  console.log('   2. Open DevTools (F12) → Console tab');
  console.log('   3. Check for any errors');
  console.log('   4. Try login/signup functionality');
  console.log('   5. Check Network tab for API requests');
}

runTests();

