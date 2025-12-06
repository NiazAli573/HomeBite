/**
 * HomeBite Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Auto-hide alerts after 5 seconds
    var alerts = document.querySelectorAll('.alert:not(.alert-info):not(.alert-warning)');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Confirm delete actions
    var deleteButtons = document.querySelectorAll('[data-confirm]');
    deleteButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            if (!confirm(this.dataset.confirm || 'Are you sure?')) {
                e.preventDefault();
            }
        });
    });
    
    // Add loading state to forms
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function() {
            var submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.disabled = true;
                var originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading"></span> Processing...';
                
                // Re-enable after 10 seconds as fallback
                setTimeout(function() {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 10000);
            }
        });
    });
});

/**
 * Get user's current location
 * @param {function} callback - Callback with (lat, lng) or (null, null) on error
 */
function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                callback(position.coords.latitude, position.coords.longitude);
            },
            function(error) {
                console.error('Geolocation error:', error);
                callback(null, null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    } else {
        console.error('Geolocation not supported');
        callback(null, null);
    }
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Earth's radius in km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(deg) {
    return deg * Math.PI / 180;
}

/**
 * Format price in PKR
 * @param {number} amount - Amount to format
 * @returns {string} Formatted price string
 */
function formatPrice(amount) {
    return 'PKR ' + Math.round(amount).toLocaleString();
}

/**
 * Format time for display
 * @param {string} timeStr - Time string (HH:MM:SS)
 * @returns {string} Formatted time (h:mm A)
 */
function formatTime(timeStr) {
    var parts = timeStr.split(':');
    var hours = parseInt(parts[0]);
    var minutes = parts[1];
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return hours + ':' + minutes + ' ' + ampm;
}
