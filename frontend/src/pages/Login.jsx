import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username, password);
      // Get the user role and redirect to appropriate dashboard
      const userRole = response?.user?.role || location.state?.userRole;
      
      if (userRole === 'cook') {
        navigate('/dashboard', { replace: true });
      } else if (userRole === 'customer') {
        navigate('/customer/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '2rem 0'
    }}>
      <div className="container-sm">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#212529', marginBottom: '0.5rem' }}>
                Welcome Back
              </h1>
              <p style={{ color: '#757575', fontWeight: '300', fontSize: '1rem' }}>
                Sign in to your HomeBite account
              </p>
            </div>

            {/* Card */}
            <div className="card border-0" style={{
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
            }}>
              <div className="card-body p-5">
                {error && (
                  <div style={{
                    backgroundColor: '#F8D7DA',
                    borderLeft: '4px solid #E74C3C',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ color: '#721C24', fontWeight: '500' }}>
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="username" style={{
                      fontWeight: '500',
                      color: '#212529',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Enter your username"
                      style={{
                        border: '2px solid #E0E0E0',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>

                  {/* Password Field */}
                  <div style={{ marginBottom: '2rem' }}>
                    <label htmlFor="password" style={{
                      fontWeight: '500',
                      color: '#212529',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      style={{
                        border: '2px solid #E0E0E0',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: loading ? '#999' : 'linear-gradient(135deg, #FF6B35, #E55A24)',
                      color: 'white',
                      border: 'none',
                      padding: '0.875rem 1.5rem',
                      fontWeight: '500',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      marginBottom: '1rem',
                      boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
                    }}
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.target.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!loading) {
                        e.target.style.boxShadow = '0 4px 12px rgba(255,107,53,0.15)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '1.5rem 0'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }}></div>
                  <span style={{ padding: '0 1rem', color: '#757575', fontSize: '0.875rem' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }}></div>
                </div>

                {/* Sign Up Link */}
                <p style={{ textAlign: 'center', color: '#757575', fontWeight: '300', marginBottom: '0' }}>
                  Don't have an account?{' '}
                  <Link to="/signup" style={{ color: '#FF6B35', fontWeight: '500', textDecoration: 'none' }}>
                    Create one now
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Message */}
            <p style={{
              textAlign: 'center',
              color: '#757575',
              fontSize: '0.875rem',
              marginTop: '2rem',
              fontWeight: '300'
            }}>
              <i className="bi bi-shield-check me-1"></i> Your account is secure and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
