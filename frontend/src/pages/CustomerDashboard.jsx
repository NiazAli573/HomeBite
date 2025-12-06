import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { dashboardService } from '../services/dashboardService';
import { ratingService } from '../services/ratingService';
import RatingModal from '../components/RatingModal';

const CustomerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Poll for updates every 20 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    
    try {
      const [statsData, activeData, completedData] = await Promise.all([
        dashboardService.getCustomerStats(),
        orderService.getActiveOrders(),
        orderService.getCompletedOrders(),
      ]);
      setStats(statsData);
      setActiveOrders(activeData);
      setCompletedOrders(completedData);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderService.cancelOrder(orderId);
      await fetchDashboardData(true);
    } catch (err) {
      alert('Failed to cancel order: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleRateOrder = (order) => {
    setSelectedOrder(order);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      await ratingService.createRating(ratingData);
      await fetchDashboardData(true);
      alert('Thank you for your rating!');
    } catch (err) {
      throw err;
    }
  };

  const handleReorder = async (order) => {
    // Navigate to place order page with meal
    window.location.href = `/meals/${order.meal}/place-order`;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <p style={{ marginTop: '1rem', color: '#757575', fontWeight: '300' }}>Loading your dashboard...</p>
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
      <div className="container-lg" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
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
            <i className="bi bi-grid-3x3-gap me-2" style={{ color: '#FF6B35' }}></i>
            My Dashboard
          </h1>
          <Link to="/meals/browse" style={{
            background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}>
            <i className="bi bi-search me-1"></i>
            Browse Meals
          </Link>
        </div>

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

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Active Orders Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(255,107,53,0.15)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Active Orders</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>{stats?.active_orders || 0}</h2>
              </div>
              <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', opacity: 0.6 }}></i>
            </div>
          </div>

          {/* Completed Orders Card */}
          <div style={{
            background: 'linear-gradient(135deg, #27AE60, #229954)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(39,174,96,0.15)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Completed Orders</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>{stats?.completed_orders || 0}</h2>
              </div>
              <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem', opacity: 0.6 }}></i>
            </div>
          </div>

          {/* Orders to Rate Card */}
          <div style={{
            background: 'linear-gradient(135deg, #3498DB, #2980B9)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(52,152,219,0.15)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Orders to Rate</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>{stats?.orders_to_rate || 0}</h2>
              </div>
              <i className="bi bi-star-fill" style={{ fontSize: '2rem', opacity: 0.6 }}></i>
            </div>
          </div>

          {/* Total Spent Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(255,107,53,0.15)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Total Spent</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>Rs. {stats?.total_spent || 0}</h2>
              </div>
              <i className="bi bi-cash-coin" style={{ fontSize: '2rem', opacity: 0.6 }}></i>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#212529',
            marginBottom: '1.5rem'
          }}>
            <i className="bi bi-hourglass-split me-2" style={{ color: '#FFA500' }}></i>
            Active Orders
            {activeOrders.length > 0 && (
              <span style={{
                background: '#FFA500',
                color: 'white',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.75rem',
                marginLeft: '1rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                {activeOrders.length}
              </span>
            )}
          </h3>
          {activeOrders.length === 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(52,152,219,0.1), rgba(41,128,185,0.05))',
              border: '2px solid rgba(52,152,219,0.2)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <i className="bi bi-info-circle me-2" style={{ color: '#3498DB', fontSize: '1.2rem' }}></i>
              <span style={{ color: '#3498DB', fontWeight: '500' }}>
                No active orders. <Link to="/meals/browse" style={{ color: '#FF6B35', textDecoration: 'none', fontWeight: '700' }}>Browse meals</Link> to place an order!
              </span>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {activeOrders.map(order => {
                const canRate = order.status === 'completed' && !order.rating;
                const canCancel = ['pending', 'confirmed'].includes(order.status);
                
                return (
                  <div key={order.id} style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderLeft: '4px solid #FF6B35',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h6 style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: '#212529',
                          marginBottom: '0.25rem'
                        }}>
                          {order.meal_details?.name}
                        </h6>
                        <p style={{ color: '#757575', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: '300' }}>
                          <i className="bi bi-person-fill me-1" style={{ color: '#FF6B35' }}></i>
                          {order.meal_details?.cook_name}
                        </p>
                        <p style={{ color: '#BDBDBD', fontSize: '0.8rem', margin: 0 }}>
                          <i className="bi bi-clock me-1"></i>
                          {new Date(order.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span style={{
                        background: order.status === 'pending' ? '#FFA500' : order.status === 'confirmed' ? '#3498DB' : order.status === 'ready' ? '#2980B9' : '#27AE60',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #E0E0E0'
                    }}>
                      <div>
                        <p style={{ color: '#BDBDBD', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Quantity</p>
                        <p style={{ margin: 0, fontWeight: '700', color: '#212529' }}>{order.quantity}</p>
                      </div>
                      <div>
                        <p style={{ color: '#BDBDBD', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Type</p>
                        <p style={{ margin: 0, fontWeight: '700', color: '#212529' }}>
                          {order.delivery_type === 'dine_in' ? 'Dine-In' : order.delivery_type === 'pickup' ? 'Pickup' : 'Delivery'}
                        </p>
                      </div>
                    </div>

                    <p style={{
                      background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      margin: '0 0 1rem 0'
                    }}>
                      Rs. {order.total_price}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: canRate ? '1fr 1fr 1fr 1fr' : canCancel ? '1fr 1fr 1fr' : '1fr 1fr',
                      gap: '0.5rem'
                    }}>
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          style={{
                            background: 'white',
                            color: '#E74C3C',
                            border: '2px solid #E74C3C',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#FFE5E5';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'white';
                          }}>
                          <i className="bi bi-x-circle me-1"></i>
                          Cancel
                        </button>
                      )}
                      {canRate && (
                        <button
                          onClick={() => handleRateOrder(order)}
                          style={{
                            background: 'white',
                            color: '#F39C12',
                            border: '2px solid #F39C12',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#FFF8E7';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'white';
                          }}>
                          <i className="bi bi-star me-1"></i>
                          Rate
                        </button>
                      )}
                      <Link
                        to={`/orders/${order.id}`}
                        style={{
                          background: 'white',
                          color: '#FF6B35',
                          border: '2px solid #FF6B35',
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(255,107,53,0.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'white';
                        }}>
                        <i className="bi bi-eye me-1"></i>
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Orders */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#212529',
            marginBottom: '1.5rem'
          }}>
            <i className="bi bi-check-circle me-2" style={{ color: '#27AE60' }}></i>
            Recent Completed Orders
          </h3>
          {completedOrders.length === 0 ? (
            <p style={{ color: '#757575', fontWeight: '300' }}>No completed orders yet</p>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
                {completedOrders.slice(0, 4).map(order => (
                  <div key={order.id} style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderLeft: '4px solid #27AE60',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(39,174,96,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}>
                    <h6 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#212529',
                      marginBottom: '0.5rem'
                    }}>
                      {order.meal_details?.name}
                    </h6>
                    <p style={{ color: '#757575', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: '300' }}>
                      <i className="bi bi-person-fill me-1" style={{ color: '#27AE60' }}></i>
                      {order.meal_details?.cook_name}
                    </p>
                    <p style={{
                      background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      margin: '0.75rem 0'
                    }}>
                      Rs. {order.total_price}
                    </p>
                    <Link
                      to={`/orders/${order.id}`}
                      style={{
                        background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'block',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginTop: '1rem'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>
                      <i className="bi bi-eye me-1"></i>
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
              {completedOrders.length > 4 && (
                <Link
                  to="/orders/history"
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'white',
                    color: '#FF6B35',
                    border: '2px solid #FF6B35',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginTop: '1.5rem',
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
                  }}>
                  <i className="bi bi-clock-history me-2"></i>
                  View All Order History
                </Link>
              )}
            </>
          )}
        </div>

        {/* Rating Modal */}
        {showRatingModal && selectedOrder && (
          <RatingModal
            order={selectedOrder}
            onSubmit={handleSubmitRating}
            onClose={() => {
              setShowRatingModal(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
