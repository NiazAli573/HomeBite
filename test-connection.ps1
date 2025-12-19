# Test Frontend-Backend Connectivity

Write-Host "🔍 Testing HomeBite Frontend-Backend Connection...`n" -ForegroundColor Cyan

# Test 1: Backend API Root
Write-Host "1️⃣ Testing Backend API Root..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://web-production-ef53f.up.railway.app/api/" -UseBasicParsing
    Write-Host "   ✅ Backend API: Accessible (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   📄 Response Length: $($response.Content.Length) bytes" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Backend API: Error - $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 502) {
        Write-Host "   ⚠️  502 Bad Gateway - Railway backend might be deploying or down" -ForegroundColor Yellow
        Write-Host "   💡 Check Railway Dashboard for deployment status" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 2: CSRF Endpoint
Write-Host "2️⃣ Testing CSRF Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://web-production-ef53f.up.railway.app/api/auth/csrf/" -UseBasicParsing
    Write-Host "   ✅ CSRF Endpoint: Accessible (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   📄 Response: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ CSRF Endpoint: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: CORS Headers
Write-Host "3️⃣ Testing CORS Configuration..." -ForegroundColor Yellow
try {
    $headers = @{
        'Origin' = 'https://home-bite-13041.vercel.app'
    }
    $response = Invoke-WebRequest -Uri "https://web-production-ef53f.up.railway.app/api/auth/csrf/" -Headers $headers -UseBasicParsing
    
    $corsHeaders = @()
    if ($response.Headers['Access-Control-Allow-Origin']) {
        $corsHeaders += "Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])"
    }
    if ($response.Headers['Access-Control-Allow-Credentials']) {
        $corsHeaders += "Access-Control-Allow-Credentials: $($response.Headers['Access-Control-Allow-Credentials'])"
    }
    
    if ($corsHeaders.Count -gt 0) {
        Write-Host "   ✅ CORS Headers Present:" -ForegroundColor Green
        $corsHeaders | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
    } else {
        Write-Host "   ⚠️  No CORS headers found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ CORS Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Frontend
Write-Host "4️⃣ Testing Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://home-bite-13041.vercel.app" -UseBasicParsing
    Write-Host "   ✅ Frontend: Accessible (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   🌐 URL: https://home-bite-13041.vercel.app" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Frontend: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "   • Backend URL: https://web-production-ef53f.up.railway.app/api" -ForegroundColor White
Write-Host "   • Frontend URL: https://home-bite-13041.vercel.app" -ForegroundColor White
Write-Host "   • VITE_API_URL should be set in Vercel" -ForegroundColor White
Write-Host "`n💡 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. If backend shows 502, check Railway Dashboard for deployment status" -ForegroundColor Yellow
Write-Host "   2. Verify VITE_API_URL is set in Vercel Dashboard" -ForegroundColor Yellow
Write-Host "   3. Test in browser: https://home-bite-13041.vercel.app" -ForegroundColor Yellow
Write-Host "   4. Check browser console (F12) for any errors" -ForegroundColor Yellow

