import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker';

const CookSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    kitchen_address: '',
    latitude: '',
    longitude: '',
    bio: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  const { signupCook } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleKitchenLocationSelect = (locationData) => {
    setFormData({
      ...formData,
      kitchen_address: locationData.address,
      latitude: locationData.lat,
      longitude: locationData.lng,
    });
    setLocationMessage('✓ Kitchen location selected successfully!');
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
      const data = { ...formData };
      if (profileImage) {
        data.profile_image = profileImage;
      }
      await signupCook(data);
      navigate('/dashboard');
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
          <div className="col-md-10 col-lg-8">
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
                Become a HomeBite Cook
              </h1>
              <p style={{
                color: '#757575',
                fontWeight: '300',
                fontSize: '1rem'
              }}>
                Share your cooking skills and earn extra income
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
                {/* Personal Information Section */}
                <div style={{
                  paddingBottom: '1.5rem',
                  borderBottom: '2px solid #E0E0E0',
                  marginBottom: '1.5rem'
                }}>
                  <h5 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#212529',
                    marginBottom: '1.5rem'
                  }}>
                    <i className="bi bi-person-fill" style={{ color: '#FF6B35', marginRight: '0.5rem' }}></i>
                    Personal Information
                  </h5>

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
                      }}>First Name *</label>
                      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#212529',
                        fontWeight: '500',
                        fontSize: '0.95rem'
                      }}>Last Name *</label>
                      <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                  </div>

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
                      }}>Username *</label>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#212529',
                        fontWeight: '500',
                        fontSize: '0.95rem'
                      }}>Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#212529',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>Phone Number *</label>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#212529',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>Profile Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '0.75rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', cursor: 'pointer' }} />
                    {profileImage && <p style={{ color: '#27AE60', fontSize: '0.85rem', marginTop: '0.5rem' }}>✓ Image selected: {profileImage.name}</p>}
                  </div>
                </div>

                {/* Kitchen Information Section */}
                <div style={{
                  paddingBottom: '1.5rem',
                  borderBottom: '2px solid #E0E0E0',
                  marginBottom: '1.5rem'
                }}>
                  <h5 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#212529',
                    marginBottom: '1.5rem'
                  }}>
                    <i className="bi bi-shop" style={{ color: '#FF6B35', marginRight: '0.5rem' }}></i>
                    Kitchen Information
                  </h5>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#212529',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>Kitchen Address *</label>
                    
                    <LocationPicker 
                      onLocationSelect={handleKitchenLocationSelect}
                      initialAddress={formData.kitchen_address}
                      initialLat={formData.latitude}
                      initialLng={formData.longitude}
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

                    {/* Hidden coordinate fields for form submission */}
                    <input type="hidden" name="kitchen_address" value={formData.kitchen_address} />
                    <input type="hidden" name="latitude" value={formData.latitude} />
                    <input type="hidden" name="longitude" value={formData.longitude} />
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#212529',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                    }}>Bio (Tell customers about yourself)</label>
                    <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.3s ease', resize: 'vertical' }} onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </div>

                {/* Account Security Section */}
                <div style={{
                  marginBottom: '1.5rem'
                }}>
                  <h5 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#212529',
                    marginBottom: '1.5rem'
                  }}>
                    <i className="bi bi-lock-fill" style={{ color: '#FF6B35', marginRight: '0.5rem' }}></i>
                    Account Security
                  </h5>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#212529',
                        fontWeight: '500',
                        fontSize: '0.95rem'
                      }}>Password *</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#212529',
                        fontWeight: '500',
                        fontSize: '0.95rem'
                      }}>Confirm Password *</label>
                      <input type="password" name="password2" value={formData.password2} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #E0E0E0', borderRadius: '0.5rem', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
                    </div>
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
                    boxShadow: '0 4px 12px rgba(255,107,53,0.15)',
                    marginBottom: '1rem'
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
                      <i className="bi bi-shop me-2"></i>
                      Sign Up as Cook
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div style={{
                borderTop: '1px solid #E0E0E0',
                margin: '1.5rem 0'
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

export default CookSignup;
