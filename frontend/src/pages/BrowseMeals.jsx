import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mealService } from '../services/mealService';
import { useAuth } from '../context/AuthContext';

const BrowseMeals = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNearby, setShowNearby] = useState(false);
  const [maxDistance, setMaxDistance] = useState(2);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // 'distance' or 'price'

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to customer signup if not authenticated
      navigate('/signup/customer', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Request geolocation on component mount if user is a customer
  useEffect(() => {
    if (user?.role === 'customer' && !customerLocation) {
      requestGeolocation();
    }
  }, [user]);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCustomerLocation({ latitude, longitude });
        setLocationLoading(false);
      },
      (err) => {
        console.log('Geolocation error:', err.message);
        // Don't show error - just disable nearby view
        setLocationLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchMeals();
  }, [showNearby, maxDistance, sortBy]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      let data;
      if (showNearby) {
        data = await mealService.getNearbyMeals(maxDistance);
        // Sort meals by distance if available
        if (sortBy === 'distance') {
          data = data.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));
        } else if (sortBy === 'price') {
          data = data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
      } else {
        data = await mealService.getMeals();
        // Sort all meals by price or availability
        if (sortBy === 'price') {
          data = data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
      }
      setMeals(data);
      setError('');
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Please log in as a customer to view nearby meals');
        setShowNearby(false);
      } else {
        setError('Failed to load meals');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '3rem'
    }}>
      <div className="container-lg">
        {/* Header Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#212529',
            marginBottom: '0.5rem'
          }}>
            <i className="bi bi-shop me-2"></i>Discover Meals
          </h1>
          <p style={{
            color: '#757575',
            fontWeight: '300',
            fontSize: '1.1rem'
          }}>
            Find delicious home-cooked meals from talented local cooks
          </p>
        </div>

        {/* Location Info Card */}
        {user?.role === 'customer' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(229,90,36,0.05))',
            border: '2px solid rgba(255,107,53,0.2)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ margin: 0, color: '#212529', fontWeight: '500' }}>
                <i className="bi bi-geo-alt-fill me-2" style={{ color: '#FF6B35' }}></i>
                {customerLocation ? (
                  <>
                    <strong>Location detected!</strong> Showing meals near you
                  </>
                ) : (
                  <strong>Enable location to see meals near you</strong>
                )}
              </p>
              {customerLocation && (
                <p style={{ margin: '0.5rem 0 0 0', color: '#757575', fontSize: '0.9rem' }}>
                  {customerLocation.latitude.toFixed(4)}, {customerLocation.longitude.toFixed(4)}
                </p>
              )}
            </div>
            {!customerLocation && (
              <button 
                style={{
                  background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                  color: 'white',
                  border: 'none',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
                }}
                onClick={requestGeolocation}
                disabled={locationLoading}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.15)';
                }}
              >
                {locationLoading ? 'Detecting...' : 'Share My Location'}
              </button>
            )}
          </div>
        )}

        {/* Controls Section */}
        <div className="row g-3 align-items-center" style={{ marginBottom: '2.5rem' }}>
          <div className="col-12 col-md-4">
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#212529',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              <input
                type="checkbox"
                checked={showNearby}
                onChange={(e) => setShowNearby(e.target.checked)}
                disabled={!customerLocation && user?.role === 'customer'}
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '0.75rem',
                  cursor: 'pointer',
                  accentColor: '#FF6B35'
                }}
              />
              <i className="bi bi-geo-alt-fill" style={{ color: '#FF6B35', marginRight: '0.5rem' }}></i>
              Show Nearby Only
            </label>
          </div>

          {showNearby && (
            <div className="col-12 col-md-4">
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem',
                  border: '2px solid #E0E0E0',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="0.5">Within 500m</option>
                <option value="1">Within 1 km</option>
                <option value="2">Within 2 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
              </select>
            </div>
          )}

          <div className={`col-12 ${showNearby ? 'col-md-4' : 'col-md-4'}`}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E0E0E0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="distance">Sort by Distance</option>
              <option value="price">Sort by Price (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#FFE5E5',
            border: '2px solid #FF6B35',
            color: '#B30000',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#B30000'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Meals Grid */}
        <div className="row g-4">
          {meals.length === 0 ? (
            <div className="col-12" style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <i className="bi bi-search" style={{ fontSize: '4rem', color: '#BDBDBD' }}></i>
              <p style={{
                marginTop: '1.5rem',
                color: '#757575',
                fontWeight: '300',
                fontSize: '1.1rem'
              }}>
                {showNearby 
                  ? `No meals found within ${maxDistance}km of you. Try expanding the search radius!`
                  : 'No meals available yet. Check back soon!'}
              </p>
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="col-md-6 col-lg-4">
                <div style={{
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}>
                  {/* Meal Image */}
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    {meal.photo ? (
                      <img
                        src={meal.photo}
                        alt={meal.name}
                        style={{ 
                          width: '100%',
                          height: '220px', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, #F0F0F0, #E0E0E0)',
                          height: '220px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i className="bi bi-image" style={{ fontSize: '3rem', color: '#9E9E9E' }}></i>
                      </div>
                    )}
                    {/* Badge Overlay */}
                    {meal.dine_with_us_available && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        background: 'linear-gradient(135deg, #27AE60, #229954)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        <i className="bi bi-house-heart me-1"></i>Dine-In
                      </div>
                    )}
                    {showNearby && meal.distance_km !== undefined && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: '#FF6B35',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        backdropFilter: 'blur(4px)'
                      }}>
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {meal.distance_km < 1 
                          ? (meal.distance_km * 1000).toFixed(0) + 'm' 
                          : meal.distance_km.toFixed(1) + ' km'}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Meal Name */}
                    <h5 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#212529',
                      marginBottom: '0.75rem'
                    }}>
                      {meal.name}
                    </h5>

                    {/* Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {meal.average_meal_rating > 0 && (
                        <span style={{
                          background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(229,90,36,0.05))',
                          color: '#FF6B35',
                          padding: '0.375rem 0.875rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          <i className="bi bi-star-fill me-1"></i>
                          {meal.average_meal_rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p style={{
                      color: '#757575',
                      fontSize: '0.9rem',
                      fontWeight: '300',
                      marginBottom: '1rem',
                      lineHeight: '1.5',
                      flex: 1
                    }}>
                      {meal.description || 'No description available'}
                    </p>

                    {/* Cook Info */}
                    <div style={{
                      borderTop: '1px solid #E0E0E0',
                      paddingTop: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        color: '#212529',
                        fontWeight: '500'
                      }}>
                        <i className="bi bi-person-fill" style={{ color: '#FF6B35', marginRight: '0.5rem' }}></i>
                        {meal.cook_name}
                      </div>
                      {meal.cook_address && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#757575',
                          fontSize: '0.9rem',
                          fontWeight: '300'
                        }}>
                          <i className="bi bi-geo-alt-fill" style={{ color: '#FF6B35', marginRight: '0.5rem' }}></i>
                          {meal.cook_address}
                        </div>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto'
                    }}>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        Rs. {meal.price}
                      </span>
                      <Link 
                        to={`/meals/${meal.id}`} 
                        style={{
                          background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                          color: 'white',
                          border: 'none',
                          padding: '0.625rem 1.25rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <i className="bi bi-eye"></i>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseMeals;
