import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav style={{
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '2px solid #F0F0F0'
      }}>
        <div className="container-lg" style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{
              fontSize: '1.4rem',
              fontWeight: '900',
              color: '#FF6B35',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="bi bi-house-heart-fill"></i>
              HomeBite
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Desktop Menu */}
              <div style={{ display: 'none', '@media (min-width: 768px)': { display: 'flex' }, gap: '2rem', alignItems: 'center' }}>
                <Link to="/meals" style={{
                  color: '#212529',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                onMouseOut={(e) => e.target.style.color = '#212529'}>
                  <i className="bi bi-search me-1"></i>
                  Browse Meals
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                  <>
                    {user.is_cook && (
                      <>
                        <Link to="/dashboard" style={{
                          color: '#212529',
                          textDecoration: 'none',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                        onMouseOut={(e) => e.target.style.color = '#212529'}>
                          <i className="bi bi-speedometer2 me-1"></i>
                          Dashboard
                        </Link>
                        <Link to="/meals/my-meals" style={{
                          color: '#212529',
                          textDecoration: 'none',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                        onMouseOut={(e) => e.target.style.color = '#212529'}>
                          <i className="bi bi-egg-fried me-1"></i>
                          My Meals
                        </Link>
                      </>
                    )}
                    {!user.is_cook && (
                      <Link to="/orders/history" style={{
                        color: '#212529',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                      onMouseOut={(e) => e.target.style.color = '#212529'}>
                        <i className="bi bi-bag-check me-1"></i>
                        My Orders
                      </Link>
                    )}
                    {(user.is_superuser || user.role === 'admin') && (
                      <Link to="/admin/dashboard" style={{
                        color: '#212529',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                      onMouseOut={(e) => e.target.style.color = '#212529'}>
                        <i className="bi bi-speedometer2 me-1"></i>
                        Admin
                      </Link>
                    )}
                    <div style={{ position: 'relative' }}>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#212529',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '1rem'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                        onMouseOut={(e) => e.target.style.color = '#212529'}>
                        <i className="bi bi-person-circle me-1"></i>
                        {user.username}
                      </button>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'white',
                        color: '#E74C3C',
                        border: '2px solid #E74C3C',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.4rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#FFE5E5';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}>
                      <i className="bi bi-box-arrow-right me-1"></i>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={{
                      color: '#212529',
                      textDecoration: 'none',
                      fontWeight: '600',
                      padding: '0.5rem 1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                    onMouseOut={(e) => e.target.style.color = '#212529'}>
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Login
                    </Link>
                    <Link to="/signup" style={{
                      background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
        color: 'white',
        padding: '3rem 0 1rem',
        marginTop: '4rem'
      }}>
        <div className="container-lg" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h5 style={{ fontWeight: '900', marginBottom: '1rem', color: '#FF6B35' }}>
                <i className="bi bi-house-heart-fill"></i> HomeBite
              </h5>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
                Fresh, home-cooked meals from local cooks near your office. Connecting hungry customers with passionate home chefs.
              </p>
            </div>
            <div>
              <h6 style={{ fontWeight: '700', marginBottom: '1rem' }}>Quick Links</h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link to="/meals" style={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                    Browse Meals
                  </Link>
                </li>
                <li>
                  <Link to="/signup/cook" style={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#FF6B35'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                    Become a Cook
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 style={{ fontWeight: '700', marginBottom: '1rem' }}>Contact</h6>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                <i className="bi bi-envelope me-2" style={{ color: '#FF6B35' }}></i>
                support@homebite.com
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>
                <i className="bi bi-envelope me-2" style={{ color: '#FF6B35' }}></i>
                markhorsdev@gmail.com
              </p>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.5rem',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.85rem'
          }}>
            <p>&copy; 2025 HomeBite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
