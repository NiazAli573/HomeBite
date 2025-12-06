import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mealService } from '../services/mealService';
import { orderService } from '../services/orderService';

function PlaceOrder() {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [formData, setFormData] = useState({
    quantity: 1,
    delivery_type: 'pickup',
    payment_method: 'cash',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeal();
  }, [mealId]);

  const fetchMeal = async () => {
    try {
      const data = await mealService.getMeal(mealId);
      setMeal(data);
    } catch (err) {
      setError('Failed to load meal details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const calculateTotal = () => {
    if (!meal) return 0;
    const pricePerUnit = formData.delivery_type === 'dine_in' && meal.dine_price 
      ? parseFloat(meal.dine_price)
      : parseFloat(meal.price);
    return (pricePerUnit * formData.quantity).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        meal: parseInt(mealId),
        ...formData,
      };
      
      console.log('Submitting order:', orderData);
      const response = await orderService.createOrder(orderData);
      console.log('Order created:', response);
      navigate(`/orders/${response.id}`);
    } catch (err) {
      console.error('Order error:', err);
      console.error('Error response:', err.response?.data);
      
      // Handle different error formats
      let errorMessage = 'Failed to place order. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.meal || err.response.data.quantity) {
          // Handle field-specific errors
          const errors = Object.entries(err.response.data).map(([key, value]) => {
            return `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
          });
          errorMessage = errors.join('; ');
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
            <button onClick={() => navigate(-1)} style={{
              background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Go Back
            </button>
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
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: '#212529',
              marginBottom: '2rem'
            }}>
              <i className="bi bi-cart-check me-2" style={{ color: '#FF6B35' }}></i>
              Place Order
            </h1>

            {/* Meal Summary Card */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #FF6B35'
            }}>
              <h5 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#212529',
                marginBottom: '1rem'
              }}>
                Order Summary
              </h5>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                {meal.photo && (
                  <img
                    src={meal.photo}
                    alt={meal.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '0.75rem'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h6 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#212529',
                    marginBottom: '0.5rem'
                  }}>
                    {meal.name}
                  </h6>
                  <p style={{
                    color: '#757575',
                    fontWeight: '300',
                    marginBottom: '0.5rem'
                  }}>
                    <i className="bi bi-person-fill me-2" style={{ color: '#FF6B35' }}></i>
                    {meal.cook_name}
                  </p>
                  <p style={{
                    background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: 0
                  }}>
                    Rs. {meal.price}
                  </p>
                  <p style={{ color: '#BDBDBD', fontSize: '0.85rem', marginTop: '0.25rem' }}>per serving</p>
                </div>
              </div>
            </div>

            {/* Order Form Card */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              {error && (
                <div style={{
                  background: '#FFE5E5',
                  border: '2px solid #FF6B35',
                  color: '#B30000',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Quantity */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#212529',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    max={meal.quantity_available}
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6B35';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E0E0E0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <small style={{ color: '#BDBDBD', marginTop: '0.35rem', display: 'block' }}>
                    Available: {meal.quantity_available} servings
                  </small>
                </div>

                {/* Delivery Type */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '1rem',
                    color: '#212529',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    Order Type *
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '1rem'
                  }}>
                    {['pickup', 'delivery', meal.dine_with_us_available && 'dine_in'].filter(Boolean).map((type) => (
                      <label key={type} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '1rem',
                        border: formData.delivery_type === type ? '2px solid #FF6B35' : '2px solid #E0E0E0',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: formData.delivery_type === type ? 'rgba(255,107,53,0.05)' : 'white'
                      }}>
                        <input
                          type="radio"
                          name="delivery_type"
                          value={type}
                          checked={formData.delivery_type === type}
                          onChange={handleChange}
                          style={{
                            marginRight: '0.75rem',
                            cursor: 'pointer',
                            accentColor: '#FF6B35',
                            marginTop: '0.15rem'
                          }}
                        />
                        <div>
                          <div style={{
                            fontWeight: '600',
                            color: '#212529',
                            fontSize: '0.95rem',
                            marginBottom: '0.25rem'
                          }}>
                            {type === 'pickup' && <>
                              <i className="bi bi-bag me-1"></i>Pickup
                            </>}
                            {type === 'delivery' && <>
                              <i className="bi bi-truck me-1"></i>Delivery
                            </>}
                            {type === 'dine_in' && <>
                              <i className="bi bi-house-heart me-1"></i>Dine-In
                            </>}
                          </div>
                          <div style={{
                            color: '#FF6B35',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            Rs. {type === 'dine_in' && meal.dine_price ? meal.dine_price : meal.price}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formData.delivery_type === 'dine_in' && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(39,174,96,0.1), rgba(34,153,84,0.05))',
                      border: '2px solid rgba(39,174,96,0.2)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      marginTop: '1rem'
                    }}>
                      <i className="bi bi-info-circle me-2" style={{ color: '#27AE60' }}></i>
                      <span style={{ color: '#27AE60', fontWeight: '500' }}>
                        You'll dine at {meal.cook_name}'s place. Address: {meal.cook_address || 'Contact cook'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleChange}
                      style={{
                        marginRight: '0.75rem',
                        cursor: 'pointer',
                        accentColor: '#FF6B35'
                      }}
                    />
                    <i className="bi bi-cash-coin me-2" style={{ color: '#FF6B35', fontSize: '1.1rem' }}></i>
                    <span style={{ color: '#212529', fontWeight: '600' }}>
                      Cash on {formData.delivery_type === 'pickup' ? 'Pickup' : formData.delivery_type === 'dine_in' ? 'Visit' : 'Delivery'}
                    </span>
                  </label>
                </div>

                {/* Special Instructions */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#212529',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requests or dietary requirements..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6B35';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E0E0E0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Order Summary Box */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,107,53,0.05), rgba(229,90,36,0.02))',
                  border: '2px solid rgba(255,107,53,0.15)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <h6 style={{ color: '#212529', fontWeight: '700', marginBottom: '0.75rem' }}>Order Details:</h6>
                  <div style={{ display: 'grid', gap: '0.5rem', color: '#757575', fontSize: '0.95rem' }}>
                    <div><i className="bi bi-clock me-2"></i>Ready Time: <strong>{meal.ready_time}</strong></div>
                    <div><i className="bi bi-basket me-2"></i>Quantity: <strong>{formData.quantity} servings</strong></div>
                    <div><i className="bi bi-truck me-2"></i>Delivery: <strong>{formData.delivery_type === 'pickup' ? 'Pickup' : formData.delivery_type === 'dine_in' ? 'Dine-In' : 'Delivery'}</strong></div>
                    <div><i className="bi bi-cash-coin me-2"></i>Payment: <strong>Cash</strong></div>
                  </div>
                </div>

                {/* Total Amount */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                  borderRadius: '0.75rem',
                  marginBottom: '1.5rem',
                  color: 'white'
                }}>
                  <h6 style={{ margin: 0, fontWeight: '600' }}>Total Amount:</h6>
                  <h4 style={{ margin: 0, fontWeight: '900', fontSize: '1.75rem' }}>Rs. {calculateTotal()}</h4>
                </div>

                {/* Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: loading ? '#BDBDBD' : 'linear-gradient(135deg, #FF6B35, #E55A24)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
                    }}
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.15)';
                    }}
                  >
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Placing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Confirm Order
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                      background: 'white',
                      color: '#FF6B35',
                      border: '2px solid #FF6B35',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,107,53,0.05)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
