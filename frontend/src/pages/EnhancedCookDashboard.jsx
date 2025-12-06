import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { dashboardService } from '../services/dashboardService';

function EnhancedCookDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState({ pending: [], confirmed: [], ready: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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
    setRefreshing(!silent);
    
    try {
      const [statsData, ordersData] = await Promise.all([
        dashboardService.getCookStats(),
        dashboardService.getCookTodaysOrders(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleConfirm = async (orderId) => {
    try {
      await orderService.confirmOrder(orderId);
      await fetchDashboardData(true);
    } catch (err) {
      alert('Failed to confirm order: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      await orderService.markOrderReady(orderId);
      await fetchDashboardData(true);
    } catch (err) {
      alert('Failed to mark order as ready: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleComplete = async (orderId) => {
    try {
      await orderService.completeOrder(orderId);
      await fetchDashboardData(true);
    } catch (err) {
      alert('Failed to complete order: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
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
            <i className="bi bi-speedometer2 me-2" style={{ color: '#FF6B35' }}></i>
            Cook Dashboard
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => fetchDashboardData()}
              disabled={refreshing}
              style={{
                background: 'white',
                color: '#FF6B35',
                border: '2px solid #FF6B35',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                opacity: refreshing ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (!refreshing) {
                  e.target.style.background = 'rgba(255,107,53,0.05)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
              }}>
              <i className={`bi bi-arrow-clockwise me-1`} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}></i>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link to="/meals/create" style={{
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
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <i className="bi bi-plus-circle me-1"></i>
              Add Meal
            </Link>
          </div>
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
          {/* Today's Orders Card */}
          <div style={{
            background: 'linear-gradient(135deg, #3498DB, #2980B9)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(52,152,219,0.15)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Today's Orders</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>{stats?.today?.total_orders || 0}</h2>
              </div>
              <i className="bi bi-calendar3" style={{ fontSize: '2rem', opacity: 0.6 }}></i>
            </div>
          </div>

          {/* Today's Earnings Card */}
          <div style={{
            background: 'linear-gradient(135deg, #27AE60, #229954)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(39,174,96,0.15)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Today's Earnings</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>Rs. {stats?.today?.total_earnings || 0}</h2>
              </div>
              <i className="bi bi-cash-coin" style={{ fontSize: '2rem', opacity: 0.6 }}></i>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(255,107,53,0.15)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Pending Orders</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>{stats?.today?.pending_count || 0}</h2>
              </div>
              <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', opacity: 0.6 }}></i>
            </div>
          </div>

          {/* Rating Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(255,107,53,0.15)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Your Rating</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>{stats?.all_time?.rating || 0} ⭐</h2>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>({stats?.all_time?.total_ratings || 0} reviews)</p>
              </div>
              <i className="bi bi-star-fill" style={{ fontSize: '2rem', opacity: 0.6 }}></i>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Pending Orders */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '1rem'
            }}>
              <i className="bi bi-hourglass-split me-2" style={{ color: '#FFA500' }}></i>
              Pending Orders
              <span style={{
                background: '#FFA500',
                color: 'white',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.75rem',
                marginLeft: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {orders.pending.length}
              </span>
            </h3>
            {orders.pending.length === 0 ? (
              <p style={{ color: '#757575', fontWeight: '300' }}>No pending orders</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.pending.map(order => (
                  <div key={order.id} style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: '3px solid #FFA500'
                  }}>
                    <h6 style={{ margin: '0 0 0.25rem 0', fontWeight: '700', color: '#212529' }}>Order #{order.id}</h6>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#757575', fontSize: '0.85rem' }}><i className="bi bi-clock me-1"></i>{formatTime(order.created_at)}</p>
                    <p style={{ margin: '0 0 0.75rem 0', fontWeight: '600', color: '#212529' }}>{order.meal_details?.name}</p>
                    <p style={{ margin: '0 0 1rem 0', color: '#757575', fontSize: '0.9rem' }}>Qty: {order.quantity} | {order.delivery_type === 'dine_in' ? 'Dine-In' : order.delivery_type === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                    <p style={{ margin: '0 0 1rem 0', color: '#FF6B35', fontWeight: '700' }}>Rs. {order.total_price}</p>
                    <button
                      onClick={() => handleConfirm(order.id)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #27AE60, #229954)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 16px rgba(39,174,96,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}>
                      <i className="bi bi-check-circle me-1"></i>
                      Confirm Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmed Orders */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '1rem'
            }}>
              <i className="bi bi-check-circle me-2" style={{ color: '#3498DB' }}></i>
              Confirmed Orders
              <span style={{
                background: '#3498DB',
                color: 'white',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.75rem',
                marginLeft: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {orders.confirmed.length}
              </span>
            </h3>
            {orders.confirmed.length === 0 ? (
              <p style={{ color: '#757575', fontWeight: '300' }}>No confirmed orders</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.confirmed.map(order => (
                  <div key={order.id} style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: '3px solid #3498DB'
                  }}>
                    <h6 style={{ margin: '0 0 0.25rem 0', fontWeight: '700', color: '#212529' }}>Order #{order.id}</h6>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#757575', fontSize: '0.85rem' }}><i className="bi bi-clock me-1"></i>{formatTime(order.created_at)}</p>
                    <p style={{ margin: '0 0 0.75rem 0', fontWeight: '600', color: '#212529' }}>{order.meal_details?.name}</p>
                    <p style={{ margin: '0 0 1rem 0', color: '#757575', fontSize: '0.9rem' }}>Qty: {order.quantity} | {order.delivery_type === 'dine_in' ? 'Dine-In' : order.delivery_type === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                    <p style={{ margin: '0 0 1rem 0', color: '#FF6B35', fontWeight: '700' }}>Rs. {order.total_price}</p>
                    <button
                      onClick={() => handleMarkReady(order.id)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #2980B9, #1F618D)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 16px rgba(52,152,219,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}>
                      <i className="bi bi-check2-circle me-1"></i>
                      Mark Ready
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ready Orders */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '1rem'
            }}>
              <i className="bi bi-bag-check me-2" style={{ color: '#1F618D' }}></i>
              Ready for Pickup
              <span style={{
                background: '#1F618D',
                color: 'white',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.75rem',
                marginLeft: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {orders.ready.length}
              </span>
            </h3>
            {orders.ready.length === 0 ? (
              <p style={{ color: '#757575', fontWeight: '300' }}>No orders ready</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.ready.map(order => (
                  <div key={order.id} style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: '3px solid #1F618D'
                  }}>
                    <h6 style={{ margin: '0 0 0.25rem 0', fontWeight: '700', color: '#212529' }}>Order #{order.id}</h6>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#757575', fontSize: '0.85rem' }}><i className="bi bi-clock me-1"></i>{formatTime(order.created_at)}</p>
                    <p style={{ margin: '0 0 0.75rem 0', fontWeight: '600', color: '#212529' }}>{order.meal_details?.name}</p>
                    <p style={{ margin: '0 0 1rem 0', color: '#757575', fontSize: '0.9rem' }}>Qty: {order.quantity} | {order.delivery_type === 'dine_in' ? 'Dine-In' : order.delivery_type === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                    <p style={{ margin: '0 0 1rem 0', color: '#FF6B35', fontWeight: '700' }}>Rs. {order.total_price}</p>
                    <button
                      onClick={() => handleComplete(order.id)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #27AE60, #229954)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 16px rgba(39,174,96,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>
                      <i className="bi bi-check-all me-1"></i>
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Orders */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '1rem'
            }}>
              <i className="bi bi-check-circle-fill me-2" style={{ color: '#27AE60' }}></i>
              Completed Today
              <span style={{
                background: '#27AE60',
                color: 'white',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.75rem',
                marginLeft: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {orders.completed.length}
              </span>
            </h3>
            {orders.completed.length === 0 ? (
              <p style={{ color: '#757575', fontWeight: '300' }}>No completed orders today</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.completed.slice(0, 5).map(order => (
                  <div key={order.id} style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: '3px solid #27AE60'
                  }}>
                    <h6 style={{ margin: '0 0 0.25rem 0', fontWeight: '700', color: '#212529' }}>Order #{order.id}</h6>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#757575', fontSize: '0.85rem' }}><i className="bi bi-clock me-1"></i>{formatTime(order.created_at)}</p>
                    <p style={{ margin: '0 0 0.75rem 0', fontWeight: '600', color: '#212529' }}>{order.meal_details?.name}</p>
                    <p style={{ margin: '0 0 0.75rem 0', color: '#757575', fontSize: '0.9rem' }}>Qty: {order.quantity}</p>
                    <p style={{ margin: 0, color: '#FF6B35', fontWeight: '700' }}>Rs. {order.total_price}</p>
                  </div>
                ))}
                {orders.completed.length > 5 && (
                  <Link
                    to="/orders/history"
                    style={{
                      display: 'block',
                      background: 'white',
                      color: '#FF6B35',
                      border: '2px solid #FF6B35',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontWeight: '600',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      marginTop: '0.5rem'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,107,53,0.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}>
                    View All Completed Orders
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/meals/my-meals" style={{
            background: 'white',
            color: '#FF6B35',
            border: '2px solid #FF6B35',
            padding: '1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            textAlign: 'center',
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
            <i className="bi bi-list-ul me-1"></i>
            Manage My Meals
          </Link>
          <Link to="/orders/history" style={{
            background: 'white',
            color: '#FF6B35',
            border: '2px solid #FF6B35',
            padding: '1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            textAlign: 'center',
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
            <i className="bi bi-clock-history me-1"></i>
            Order History
          </Link>
          <Link to="/profile" style={{
            background: 'white',
            color: '#FF6B35',
            border: '2px solid #FF6B35',
            padding: '1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            textAlign: 'center',
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
            <i className="bi bi-person me-1"></i>
            My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EnhancedCookDashboard;
