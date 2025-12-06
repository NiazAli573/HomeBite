import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'cook') {
        navigate('/dashboard', { replace: true });
      } else if (user.role === 'customer') {
        navigate('/customer/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
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
          <p style={{ marginTop: '1rem', color: '#757575', fontWeight: '300' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #E55A24 50%, #2C3E50 100%)',
        color: 'white',
        padding: '6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          transform: 'translate(100px, -100px)'
        }}></div>
        
        <div className="container-lg" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            minHeight: '450px'
          }}>
            <div>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                marginBottom: '1.5rem',
                lineHeight: '1.2',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                Fresh, Home-Cooked<br />
                <span style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Meals Near You
                </span>
              </h1>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: '300',
                marginBottom: '2rem',
                lineHeight: '1.6',
                opacity: 0.95
              }}>
                Discover delicious homemade meals from talented local cooks in your neighborhood. Skip the fast food, enjoy real food!
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <Link to="/meals" style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#212529',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 25px rgba(255,215,0,0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(255,215,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,215,0,0.3)';
                }}>
                  <i className="bi bi-search"></i> Browse Meals
                </Link>
                <Link to="/signup/cook" style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid white',
                  padding: '0.875rem 1.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <i className="bi bi-person-plus"></i> Become a Cook
                </Link>
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                fontSize: '3rem'
              }}>
                <i className="bi bi-egg-fried" style={{ color: '#FFD700' }}></i>
                <i className="bi bi-cup-hot" style={{ color: '#FFD700' }}></i>
                <i className="bi bi-basket" style={{ color: '#FFD700' }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
        padding: '5rem 0'
      }}>
        <div className="container-lg">
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#212529',
              marginBottom: '0.75rem'
            }}>
              How It Works
            </h2>
            <p style={{
              color: '#757575',
              fontWeight: '300',
              fontSize: '1.1rem'
            }}>
              Get fresh, delicious meals in just 3 simple steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: 'bi-geo-alt', title: 'Set Your Location', desc: 'Enter your office location to find nearby home cooks within 1-2 km radius.' },
              { icon: 'bi-cart-check', title: 'Choose Your Meal', desc: 'Browse available meals, check ratings, and place your order with just a few clicks.' },
              { icon: 'bi-bag-check', title: 'Pickup or Delivery', desc: 'Pick up your fresh meal or get it delivered. Pay with cash - simple and secure!' }
            ].map((step, idx) => (
              <div key={idx} style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: `linear-gradient(135deg, #FF6B35, #E55A24)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2rem',
                  color: 'white'
                }}>
                  <i className={`bi ${step.icon}`}></i>
                </div>
                <h5 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#212529',
                  marginBottom: '0.75rem'
                }}>
                  {step.title}
                </h5>
                <p style={{
                  color: '#757575',
                  fontWeight: '300',
                  lineHeight: '1.6'
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Customers */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container-lg">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '900',
                color: '#212529',
                marginBottom: '1.5rem'
              }}>
                For Office Workers and Hostelites
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: 'bi-check-circle-fill', title: 'Fresh & Healthy', desc: 'Home-cooked meals made with love' },
                  { icon: 'bi-check-circle-fill', title: 'Hyperlocal', desc: 'Find cooks within 1-2 km of your office' },
                  { icon: 'bi-check-circle-fill', title: 'Affordable', desc: 'Save money compared to restaurants' },
                  { icon: 'bi-check-circle-fill', title: 'Verified Ratings', desc: 'Read reviews from real customers' },
                  { icon: 'bi-check-circle-fill', title: 'Cash Payment', desc: 'Simple and hassle-free' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <i className={`bi ${item.icon}`} style={{ color: '#27AE60', fontSize: '1.3rem', marginTop: '0.25rem' }}></i>
                    <div>
                      <strong style={{ color: '#212529', display: 'block', marginBottom: '0.25rem' }}>{item.title}:</strong>
                      <span style={{ color: '#757575', fontWeight: '300' }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/signup" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                cursor: 'pointer',
                marginTop: '2rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.15)';
              }}>
                Get Started
              </Link>
            </div>
            <div style={{ textAlign: 'center' }}>
              <i className="bi bi-person-check" style={{ fontSize: '6rem', color: '#FF6B35' }}></i>
            </div>
          </div>
        </div>
      </section>

      {/* For Cooks */}
      <section style={{
        background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
        padding: '5rem 0'
      }}>
        <div className="container-lg">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div style={{ order: 'revert-layer' }}>
              <i className="bi bi-person-workspace" style={{ fontSize: '6rem', color: '#FF6B35' }}></i>
            </div>
            <div>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '900',
                color: '#212529',
                marginBottom: '1.5rem'
              }}>
                For Home Cooks
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: 'bi-check-circle-fill', title: 'Earn Extra Income', desc: 'Make money doing what you love' },
                  { icon: 'bi-check-circle-fill', title: 'Flexible Schedule', desc: 'Cook when you want' },
                  { icon: 'bi-check-circle-fill', title: 'Local Market', desc: 'Serve nearby customers only' },
                  { icon: 'bi-check-circle-fill', title: 'Build Reputation', desc: 'Get ratings and grow your business' },
                  { icon: 'bi-check-circle-fill', title: 'Easy Setup', desc: 'Start selling in minutes' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <i className={`bi ${item.icon}`} style={{ color: '#27AE60', fontSize: '1.3rem', marginTop: '0.25rem' }}></i>
                    <div>
                      <strong style={{ color: '#212529', display: 'block', marginBottom: '0.25rem' }}>{item.title}:</strong>
                      <span style={{ color: '#757575', fontWeight: '300' }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/signup/cook" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                cursor: 'pointer',
                marginTop: '2rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.15)';
              }}>
                Become a Cook
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #E55A24 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container-lg">
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: '900',
            marginBottom: '1rem'
          }}>
            Ready to Experience HomeBite?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '2rem',
            opacity: 0.95
          }}>
            Join our community of food lovers and home cooks today!
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/meals" style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#212529',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(255,215,0,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(255,215,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,215,0,0.3)';
            }}>
              Browse Meals
            </Link>
            <Link to="/signup" style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '0.875rem 1.875rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
