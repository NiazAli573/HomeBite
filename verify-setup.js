#!/usr/bin/env node

/**
 * Verification script to check if frontend-backend connectivity is configured correctly
 * Run this after setting up environment variables
 */

const https = require('https');

const FRONTEND_URL = 'https://home-bite-13041.vercel.app';
const BACKEND_URL = 'https://web-production-ef53f.up.railway.app';
const BACKEND_API_URL = `${BACKEND_URL}/api`;

console.log('🔍 Verifying HomeBite Frontend-Backend Setup...\n');

// Test 1: Check Backend API Root
console.log('1️⃣ Testing Backend API...');
testBackend(`${BACKEND_API_URL}/`, 'Backend API Root');

// Test 2: Check CSRF Endpoint
console.log('\n2️⃣ Testing CSRF Endpoint...');
testBackend(`${BACKEND_API_URL}/auth/csrf/`, 'CSRF Endpoint');

// Test 3: Check Frontend
console.log('\n3️⃣ Testing Frontend...');
testFrontend(FRONTEND_URL);

function testBackend(url, name) {
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 400) {
        console.log(`   ✅ ${name}: Accessible (Status: ${res.statusCode})`);
        if (data) {
          try {
            const json = JSON.parse(data);
            console.log(`   📄 Response: ${JSON.stringify(json).substring(0, 100)}...`);
          } catch (e) {
            console.log(`   📄 Response received`);
          }
        }
      } else {
        console.log(`   ⚠️  ${name}: Status ${res.statusCode}`);
      }
    });
  }).on('error', (err) => {
    console.log(`   ❌ ${name}: Error - ${err.message}`);
    console.log(`   💡 Check if Railway backend is running`);
  });
}

function testFrontend(url) {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log(`   ✅ Frontend: Accessible (Status: ${res.statusCode})`);
      console.log(`   🌐 URL: ${url}`);
    } else {
      console.log(`   ⚠️  Frontend: Status ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.log(`   ❌ Frontend: Error - ${err.message}`);
  });
}

console.log('\n📋 Next Steps:');
console.log('   1. Set VITE_API_URL in Vercel Dashboard');
console.log(`   2. Value should be: ${BACKEND_API_URL}`);
console.log('   3. Redeploy Vercel frontend');
console.log('   4. Test in browser: https://home-bite-13041.vercel.app\n');
