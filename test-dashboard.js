const https = require('https');

const BACKEND = 'web-production-ef53f.up.railway.app';
const API_BASE = `https://${BACKEND}/api`;

// Test dashboard endpoints
function testDashboardEndpoint(path, name) {
  return new Promise((resolve) => {
    https.get(`${API_BASE}${path}`, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        console.log(`\n📊 ${name}:`);
        console.log(`   Status: ${res.statusCode}`);
        if (res.statusCode === 401 || res.statusCode === 403) {
          console.log(`   ⚠️  Authentication required (expected if not logged in)`);
        } else if (res.statusCode === 200) {
          console.log(`   ✅ Working`);
        } else {
          console.log(`   ❌ Error`);
          try {
            const json = JSON.parse(body);
            console.log(`   Response: ${JSON.stringify(json).substring(0, 200)}`);
          } catch (e) {
            console.log(`   Response: ${body.substring(0, 200)}`);
          }
        }
        resolve();
      });
    }).on('error', (err) => {
      console.log(`\n❌ ${name}: ${err.message}`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('🔍 Testing Dashboard API Endpoints...\n');
  
  await testDashboardEndpoint('/dashboard/cook/stats/', 'Cook Stats Endpoint');
  await testDashboardEndpoint('/dashboard/cook/todays-orders/', 'Cook Today\'s Orders Endpoint');
  await testDashboardEndpoint('/dashboard/customer/stats/', 'Customer Stats Endpoint');
  
  console.log('\n💡 Note: 401/403 errors are expected if not authenticated');
  console.log('   If you see 500 errors, there might be a backend issue');
}

runTests();


