import { Link } from 'react-router-dom';

const SignupChoice = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
      minHeight: '100vh',
      padding: '4rem 0'
    }}>
      <div className="container-lg">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#212529',
            marginBottom: '0.75rem'
          }}>
            Join HomeBite Community
          </h1>
          <p style={{
            color: '#757575',
            fontWeight: '300',
            fontSize: '1.125rem',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Choose your role and start your journey with us
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="row g-4 justify-content-center">
          {/* Customer Card */}
          <div className="col-md-6 col-lg-5">
            <div className="card h-100 border-0" style={{
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }} onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
            }}>
              <div className="card-body p-5" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {/* Icon */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '2.5rem',
                  color: 'white'
                }}>
                  <i className="bi bi-bag-heart-fill"></i>
                </div>

                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#212529',
                  marginBottom: '1rem'
                }}>
                  I'm a Customer
                </h3>
                <p style={{
                  color: '#757575',
                  fontWeight: '300',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem',
                  fontSize: '1rem'
                }}>
                  Order delicious, authentic home-cooked meals from talented local cooks near you
                </p>

                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  width: '100%',
                  marginBottom: '1.5rem',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a4e69' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#27AE60', fontSize: '1.1rem' }}></i>
                    <span style={{ fontSize: '0.95rem' }}>Fresh meals delivered daily</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a4e69' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#27AE60', fontSize: '1.1rem' }}></i>
                    <span style={{ fontSize: '0.95rem' }}>Support local cooks</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a4e69' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#27AE60', fontSize: '1.1rem' }}></i>
                    <span style={{ fontSize: '0.95rem' }}>Easy online ordering</span>
                  </div>
                </div>

                <Link
                  to="/signup/customer"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 1.5rem',
                    fontWeight: '500',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-person-plus me-2"></i> Sign Up as Customer
                </Link>
              </div>
            </div>
          </div>

          {/* Cook Card */}
          <div className="col-md-6 col-lg-5">
            <div className="card h-100 border-0" style={{
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }} onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
            }}>
              <div className="card-body p-5" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {/* Icon */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  background: 'linear-gradient(135deg, #27AE60, #229954)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '2.5rem',
                  color: 'white'
                }}>
                  <i className="bi bi-shop"></i>
                </div>

                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#212529',
                  marginBottom: '1rem'
                }}>
                  I'm a Cook
                </h3>
                <p style={{
                  color: '#757575',
                  fontWeight: '300',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem',
                  fontSize: '1rem'
                }}>
                  Earn income by selling your delicious home-cooked meals to nearby customers
                </p>

                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  width: '100%',
                  marginBottom: '1.5rem',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a4e69' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#27AE60', fontSize: '1.1rem' }}></i>
                    <span style={{ fontSize: '0.95rem' }}>Flexible working hours</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a4e69' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#27AE60', fontSize: '1.1rem' }}></i>
                    <span style={{ fontSize: '0.95rem' }}>Build your customer base</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a4e69' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#27AE60', fontSize: '1.1rem' }}></i>
                    <span style={{ fontSize: '0.95rem' }}>Easy meal management</span>
                  </div>
                </div>

                <Link
                  to="/signup/cook"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #27AE60, #229954)',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 1.5rem',
                    fontWeight: '500',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(39,174,96,0.15)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(39,174,96,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(39,174,96,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-shop me-2"></i> Sign Up as Cook
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ color: '#757575', fontWeight: '300' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#FF6B35', fontWeight: '500', textDecoration: 'none' }}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupChoice;
