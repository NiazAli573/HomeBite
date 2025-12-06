import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mealService } from '../services/mealService';
import { useAuth } from '../context/AuthContext';

const MealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeal();
  }, [id]);

  const fetchMeal = async () => {
    try {
      const data = await mealService.getMeal(id);
      console.log('Meal data loaded:', data);
      setMeal(data);
      setError('');
    } catch (err) {
      console.error('Error loading meal:', err);
      setError('Failed to load meal details');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (!user) {
      navigate('/login', { state: { from: `/meals/${id}` } });
      return;
    }
    navigate(`/orders/place/${id}`);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="bi bi-hourglass-split" style={{ fontSize: '3rem', color: '#FF6B35', animation: 'spin 2s linear infinite' }}></i>
          <p style={{ marginTop: '1rem', color: '#757575', fontWeight: '300' }}>Loading meal details...</p>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
        minHeight: '100vh',
        padding: '2rem 0'
      }}>
        <div className="container-lg">
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <i className="bi bi-exclamation-circle" style={{ fontSize: '2rem', color: '#FF6B35', display: 'block', marginBottom: '1rem' }}></i>
            <p style={{ color: '#757575', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{error || 'Meal not found'}</p>
            <Link to="/meals" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              <i className="bi bi-arrow-left me-2"></i>
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
      minHeight: '100vh',
      padding: '2rem 0 3rem 0'
    }}>
      <div className="container-lg">
        <div className="row" style={{ gap: '2rem' }}>
          {/* Meal Image */}
          <div className="col-lg-6">
            {meal.photo ? (
              <img
                src={meal.photo}
                alt={meal.name}
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'cover',
                  borderRadius: '1rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)'
                }}
              />
            ) : (
              <div 
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <i className="bi bi-image" style={{ fontSize: '4rem', color: '#BDBDBD' }}></i>
              </div>
            )}
          </div>

          {/* Meal Details */}
          <div className="col-lg-6">
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#212529', marginBottom: '1rem' }}>
                {meal.name}
              </h1>
              <div style={{
                display: 'inline-block',
                background: meal.is_available ? '#27AE60' : '#6C757D',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                <i className={`bi bi-${meal.is_available ? 'check-circle' : 'x-circle'} me-2`}></i>
                {meal.is_available ? 'Available' : 'Not Available'}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              Rs. {meal.price}
            </div>
            <p style={{ color: '#BDBDBD', fontSize: '0.95rem', marginBottom: '1.5rem' }}>per serving</p>

            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <h5 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#212529', marginBottom: '1rem' }}>
                <i className="bi bi-file-text me-2" style={{ color: '#FF6B35' }}></i>
                Description
              </h5>
              <p style={{ color: '#757575', lineHeight: '1.6', margin: 0 }}>
                {meal.description || 'No description available'}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  <i className="bi bi-clock me-1"></i> Ready Time
                </p>
                <p style={{ color: '#212529', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                  {meal.ready_time}
                </p>
              </div>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  <i className="bi bi-basket me-1"></i> Available
                </p>
                <p style={{ color: '#212529', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                  {meal.quantity_available} servings
                </p>
              </div>
            </div>

            {/* Cook Information */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #FF6B35'
            }}>
              <h5 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#212529', marginBottom: '1rem' }}>
                <i className="bi bi-person-fill me-2" style={{ color: '#FF6B35' }}></i>
                Cook Information
              </h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <i className="bi bi-person-circle" style={{ fontSize: '2.5rem', color: '#FF6B35' }}></i>
                <div>
                  <h6 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
                    {meal.cook_name}
                  </h6>
                  {meal.cook_rating && parseFloat(meal.cook_rating) > 0 ? (
                    <div style={{ color: '#FFB800' }}>
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star${
                            i < Math.round(parseFloat(meal.cook_rating)) ? '-fill' : ''
                          }`}
                        />
                      ))}
                      <span style={{ color: '#757575', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                        ({parseFloat(meal.cook_rating).toFixed(1)})
                      </span>
                    </div>
                  ) : (
                    <p style={{ color: '#757575', fontSize: '0.9rem', margin: 0 }}>No ratings yet</p>
                  )}
                </div>
              </div>
              {meal.cook_address && (
                <div style={{ color: '#757575', fontSize: '0.95rem' }}>
                  <i className="bi bi-geo-alt-fill me-2" style={{ color: '#FF6B35' }}></i>
                  {meal.cook_address}
                </div>
              )}
            </div>

            {/* Order Button */}
            {meal.is_available ? (
              <button
                onClick={handleOrder}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(255,107,53,0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.2)';
                }}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Order Now
              </button>
            ) : (
              <div style={{
                background: '#FFE5E5',
                border: '2px solid #FF6B35',
                color: '#B30000',
                borderRadius: '0.75rem',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <i className="bi bi-exclamation-triangle me-2"></i>
                This meal is currently not available for ordering.
              </div>
            )}

            {/* Back Button */}
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/meals" style={{
                display: 'inline-block',
                background: 'white',
                color: '#FF6B35',
                border: '2px solid #FF6B35',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                <i className="bi bi-arrow-left me-2"></i>
                Back to Browse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
