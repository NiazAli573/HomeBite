import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await orderService.cancelOrder(id);
      fetchOrder();
    } catch (err) {
      alert('Failed to cancel order');
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
      month: 'long',
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
          <p style={{ marginTop: '1rem', color: '#757575', fontWeight: '300' }}>Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
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
            <p style={{ color: '#757575', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{error || 'Order not found'}</p>
            <button onClick={() => navigate('/orders/history')} style={{
              background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              <i className="bi bi-arrow-left me-2"></i>
              Back to Orders
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
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#212529',
                margin: 0
              }}>
                <i className="bi bi-receipt me-2" style={{ color: '#FF6B35' }}></i>
                Order Details
              </h1>
              <div style={{
                background: getStatusColor(order.status),
                color: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.95rem',
                textTransform: 'capitalize',
                boxShadow: `0 4px 12px ${getStatusColor(order.status)}40`
              }}>
                {order.status}
              </div>
            </div>

            {/* Order Info Card */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #FF6B35'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Order ID</p>
                  <p style={{ color: '#212529', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>#{order.id}</p>
                </div>
                <div>
                  <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Order Date</p>
                  <p style={{ color: '#212529', fontSize: '1rem', margin: 0 }}>{formatDate(order.created_at)}</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #E0E0E0', paddingTop: '1.5rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem'
                }}>
                  <div>
                    <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Payment</p>
                    <p style={{ color: '#212529', margin: 0 }}>
                      <i className="bi bi-cash-coin me-2" style={{ color: '#FF6B35' }}></i>
                      Cash on {order.delivery_type === 'pickup' ? 'Pickup' : 'Delivery'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Delivery</p>
                    <p style={{ color: '#212529', margin: 0 }}>
                      <i className={`bi bi-${order.delivery_type === 'pickup' ? 'bag' : 'truck'} me-2`} style={{ color: '#FF6B35' }}></i>
                      {order.delivery_type === 'pickup' ? 'Pickup' : 'Delivery'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Details Card */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <h5 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#212529',
                marginBottom: '1rem'
              }}>
                <i className="bi bi-basket me-2" style={{ color: '#FF6B35' }}></i>
                Meal Details
              </h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {order.meal_details?.photo && (
                  <img
                    src={order.meal_details.photo}
                    alt={order.meal_details.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '0.75rem'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h6 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#212529', marginBottom: '0.5rem' }}>{order.meal_details?.name}</h6>
                  <p style={{ color: '#757575', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    <i className="bi bi-person-fill me-2" style={{ color: '#FF6B35' }}></i>
                    {order.meal_details?.cook_name}
                  </p>
                  <p style={{ color: '#212529', margin: 0 }}>
                    <strong>Quantity:</strong> {order.quantity} servings
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#BDBDBD', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total</p>
                  <p style={{
                    background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: 0
                  }}>
                    Rs. {order.total_price}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {order.notes && (
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                <h5 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#212529',
                  marginBottom: '1rem'
                }}>
                  <i className="bi bi-chat-dots me-2" style={{ color: '#FF6B35' }}></i>
                  Special Instructions
                </h5>
                <p style={{ color: '#757575', lineHeight: '1.6', margin: 0 }}>{order.notes}</p>
              </div>
            )}

            {/* Contact Information */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <h5 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#212529',
                marginBottom: '1rem'
              }}>
                <i className="bi bi-telephone me-2" style={{ color: '#FF6B35' }}></i>
                Contact Information
              </h5>
              <p style={{ color: '#212529', margin: 0 }}>{order.customer_phone}</p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: order.status === 'pending' ? '1fr 1fr' : '1fr',
              gap: '1rem'
            }}>
              <button
                onClick={() => navigate('/orders/history')}
                style={{
                  background: 'white',
                  color: '#FF6B35',
                  border: '2px solid #FF6B35',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
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
                <i className="bi bi-arrow-left me-2"></i>
                Back to Orders
              </button>
              {order.status === 'pending' && (
                <button
                  onClick={handleCancel}
                  style={{
                    background: '#DC3545',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(220,53,69,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
