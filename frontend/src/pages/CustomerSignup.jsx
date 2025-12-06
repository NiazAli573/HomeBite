import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker';

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    customer_type: 'office_worker', // office_worker or hostel_student
    location_address: '',
    location_lat: '',
    location_lng: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  const { signupCustomer } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelect = (locationData) => {
    setFormData({
      ...formData,
      location_address: locationData.address,
      location_lat: locationData.lat,
      location_lng: locationData.lng,
    });
    setLocationMessage('✓ Location selected successfully!');
    setTimeout(() => setLocationMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signupCustomer(formData);
      navigate('/meals');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
      minHeight: '100vh',
      padding: '2rem 0 3rem 0'
    }}>
      <div className="container-lg">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#212529',
                marginBottom: '0.5rem'
              }}>
                Create Your Account
              </h1>
              <p style={{
                color: '#757575',
                fontWeight: '300',
                fontSize: '1rem'
              }}>
                Join us and enjoy fresh, home-cooked meals delivered to you
              </p>
            </div>

            {/* Card */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              padding: '2.5rem'
            }}>
              {/* Error Alert */}
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
                {/* Name Fields */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#212529',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
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
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#212529',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
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
                  </div>
                </div>

                {/* Username */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#212529',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
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
                </div>

                {/* Email */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#212529',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
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
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#212529',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
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
                </div>

                {/* Customer Type Selection */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#212529',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    Are you an Office Worker or Hostel Student? *
                  </label>
                  <select
                    name="customer_type"
                    value={formData.customer_type}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
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
                    <option value="office_worker">Office Worker</option>
                    <option value="hostel_student">Hostel Student</option>
                  </select>
                </div>

                {/* Location Section */}
                <div style={{
                  background: 'linear-gradient(135deg, #F0F7FF 0%, #F8FCFF 100%)',
                  border: '2px solid #3498DB',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <h5 style={{
                    color: '#2C3E50',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    fontSize: '0.95rem'
                  }}>
                    <i className="bi bi-geo-alt me-2" style={{ color: '#3498DB' }}></i>
                    Select Your Location (For Finding Nearby Meals)
                  </h5>

                  <LocationPicker 
                    onLocationSelect={handleLocationSelect}
                    initialAddress={formData.location_address}
                    initialLat={formData.location_lat}
                    initialLng={formData.location_lng}
                  />

                  {locationMessage && (
                    <div style={{
                      background: '#E8F5E9',
                      border: '2px solid #27AE60',
                      color: '#27AE60',
                      borderRadius: '0.75rem',
                      padding: '0.75rem 1rem',
                      marginTop: '1rem',
                      fontSize: '0.9rem'
                    }}>
                      <i className="bi bi-check-circle me-2"></i>
                      {locationMessage}
                    </div>
                  )}
                </div>

                {/* Passwords */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#212529',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
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
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#212529',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="password2"
                      value={formData.password2}
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
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Sign Up
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div style={{
                borderTop: '1px solid #E0E0E0',
                margin: '2rem 0'
              }}></div>

              {/* Sign In Link */}
              <div style={{
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#757575',
                  fontWeight: '300',
                  marginBottom: 0
                }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{
                    color: '#FF6B35',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSignup;
