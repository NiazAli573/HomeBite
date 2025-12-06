import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrderHistory();
      setOrders(data);
    } catch (err) {
      setError('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'bg-warning',
      confirmed: 'bg-info',
      ready: 'bg-primary',
      completed: 'bg-success',
      cancelled: 'bg-danger',
    };
    return statusClasses[status] || 'bg-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFC107',
      confirmed: '#17A2B8',
      ready: '#FF6B35',
      completed: '#27AE60',
      cancelled: '#DC3545',
    };
    return colors[status] || '#6C757D';
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
          <p style={{ marginTop: '1rem', color: '#757575', fontWeight: '300' }}>Loading orders...</p>
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
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '900',
          color: '#212529',
          marginBottom: '2rem'
        }}>
          <i className="bi bi-bag-check me-2" style={{ color: '#FF6B35' }}></i>
          My Orders
        </h1>

        {error && (
          <div style={{
            background: '#FFE5E5',
            border: '2px solid #FF6B35',
            color: '#B30000',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#BDBDBD', display: 'block', marginBottom: '1rem' }}></i>
            <p style={{ color: '#757575', fontSize: '1.1rem', fontWeight: '300', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
            <Link to="/meals" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
              color: 'white',
              border: 'none',
              padding: '0.875rem 1.75rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
            }}>
              <i className="bi bi-shop me-2"></i>
              Browse Meals
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order.id} style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderLeft: '4px solid #FF6B35'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
              onClick={() => window.location.href = `/orders/${order.id}`}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}>
                  {/* Meal Image */}
                  {order.meal_details?.photo && (
                    <img
                      src={order.meal_details.photo}
                      alt={order.meal_details.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '0.75rem'
                      }}
                    />
                  )}

                  {/* Order Info */}
                  <div>
                    <h5 style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: '#212529',
                      marginBottom: '0.5rem'
                    }}>
                      {order.meal_details?.name}
                    </h5>
                    <p style={{ color: '#757575', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                      <i className="bi bi-person-fill me-2" style={{ color: '#FF6B35' }}></i>
                      {order.meal_details?.cook_name}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '1.5rem',
                      flexWrap: 'wrap',
                      color: '#BDBDBD',
                      fontSize: '0.9rem'
                    }}>
                      <span><i className="bi bi-calendar me-1"></i>{formatDate(order.created_at)}</span>
                      <span><i className="bi bi-basket me-1"></i>Qty: {order.quantity}</span>
                      <span><i className="bi bi-truck me-1"></i>{order.delivery_type === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-block',
                      background: getStatusColor(order.status),
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                      textTransform: 'capitalize',
                      boxShadow: `0 4px 12px ${getStatusColor(order.status)}40`
                    }}>
                      {order.status}
                    </div>
                    <p style={{
                      background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      margin: '0.5rem 0'
                    }}>
                      Rs. {order.total_price}
                    </p>
                    <Link
                      to={`/orders/${order.id}`}
                      style={{
                        display: 'inline-block',
                        background: 'white',
                        color: '#FF6B35',
                        border: '2px solid #FF6B35',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255,107,53,0.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      View Details <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
