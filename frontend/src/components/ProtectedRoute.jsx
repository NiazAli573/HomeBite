import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
