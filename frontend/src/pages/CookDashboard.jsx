import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { mealService } from '../services/mealService';
import { dashboardService } from '../services/dashboardService';

const CookDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    
    // Setup polling to refresh data every 20 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 20000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [ordersData, mealsData, statsData] = await Promise.all([
        orderService.getOrders(),
        mealService.getMyMeals(),
        dashboardService.getCookStats()
      ]);
      setOrders(ordersData);
      setMeals(mealsData);
      setStats(statsData);
      setLoading(false);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Refresh data immediately after status update
      fetchData();
    } catch (err) {
      alert('Failed to update order status');
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get statistics from API or calculate from orders
  const todayOrdersCount = stats?.today?.total_orders || 0;
  const todayEarnings = stats?.today?.total_earnings || 0;
  const pendingCount = stats?.today?.pending_count || 0;
  const completedCount = stats?.today?.completed_count || 0;
  const cookRating = stats?.all_time?.rating || 0;
  const totalRatings = stats?.all_time?.total_ratings || 0;
  
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

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
          <p style={{ marginTop: '1rem', color: '#757575', fontWeight: '300' }}>Loading dashboard...</p>
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#212529',
            margin: 0
          }}>
            <i className="bi bi-speedometer2 me-2" style={{ color: '#FF6B35' }}></i>
            Cook Dashboard
          </h1>
          <Link to="/meals/create" style={{
            background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
            color: 'white',
            padding: '0.875rem 1.75rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(255,107,53,0.15)'
          }}>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Meal
          </Link>
        </div>

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

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Today's Orders */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderTop: '4px solid #FF6B35'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', margin: 0, marginBottom: '0.5rem' }}>Today's Orders</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#212529', margin: 0 }}>{todayOrdersCount}</h2>
              </div>
              <i className="bi bi-calendar-check" style={{ fontSize: '2.5rem', color: 'rgba(255,107,53,0.2)' }}></i>
            </div>
          </div>

          {/* Pending Orders */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderTop: '4px solid #FFC107'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', margin: 0, marginBottom: '0.5rem' }}>Pending Orders</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#212529', margin: 0 }}>{pendingOrders.length}</h2>
              </div>
              <i className="bi bi-hourglass-split" style={{ fontSize: '2.5rem', color: 'rgba(255,193,7,0.2)' }}></i>
            </div>
          </div>

          {/* Completed Orders */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderTop: '4px solid #27AE60'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', margin: 0, marginBottom: '0.5rem' }}>Completed</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#212529', margin: 0 }}>{completedOrders.length}</h2>
              </div>
              <i className="bi bi-check-circle" style={{ fontSize: '2.5rem', color: 'rgba(39,174,96,0.2)' }}></i>
            </div>
          </div>

          {/* Total Revenue */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderTop: '4px solid #17A2B8'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', margin: 0, marginBottom: '0.5rem' }}>Today's Earnings</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#212529', margin: 0 }}>Rs. {todayEarnings.toFixed(0)}</h2>
              </div>
              <i className="bi bi-cash-stack" style={{ fontSize: '2.5rem', color: 'rgba(23,162,184,0.2)' }}></i>
            </div>
          </div>

          {/* Your Rating */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderTop: '4px solid #FF9800'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', margin: 0, marginBottom: '0.5rem' }}>Your Rating</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#212529', margin: 0 }}>
                  {cookRating.toFixed(1)}
                  <span style={{ fontSize: '1.5rem', marginLeft: '0.5rem', color: '#FFD700' }}>★</span>
                </h2>
                <small style={{ color: '#BDBDBD' }}>({totalRatings} reviews)</small>
              </div>
              <i className="bi bi-star-fill" style={{ fontSize: '2.5rem', color: 'rgba(255,152,0,0.2)' }}></i>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #FF6B35'
        }}>
          <h5 style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#212529',
            marginBottom: '1.5rem'
          }}>
            <i className="bi bi-bag-check me-2" style={{ color: '#FF6B35' }}></i>
            Recent Orders
          </h5>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="bi bi-inbox" style={{ fontSize: '2rem', color: '#BDBDBD', display: 'block', marginBottom: '1rem' }}></i>
              <p style={{ color: '#757575' }}>No orders yet</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Order ID</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Meal</th>
                    <th style={{ textAlign: 'center', padding: '1rem', color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '1rem', color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ textAlign: 'center', padding: '1rem', color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ textAlign: 'right', padding: '1rem', color: '#BDBDBD', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #E0E0E0', transition: 'background 0.2s ease' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#F8F9FA'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '1rem', color: '#212529' }}>#{order.id}</td>
                      <td style={{ padding: '1rem', color: '#757575' }}>{order.customer_name}</td>
                      <td style={{ padding: '1rem', color: '#757575' }}>{order.meal_details?.name}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#757575' }}>{order.quantity}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#FF6B35', fontWeight: '700' }}>Rs. {order.total_price}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          background: order.status === 'pending' ? '#FFC107' : order.status === 'confirmed' ? '#17A2B8' : order.status === 'ready' ? '#FF6B35' : order.status === 'completed' ? '#27AE60' : '#6C757D',
                          color: order.status === 'pending' ? '#000' : 'white',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {order.status === 'pending' && (
                          <button onClick={() => handleStatusUpdate(order.id, 'confirmed')} style={{
                            background: 'white',
                            border: '1px solid #E0E0E0',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            color: '#27AE60',
                            fontWeight: '600'
                          }}>
                            <i className="bi bi-check me-1"></i>Confirm
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button onClick={() => handleStatusUpdate(order.id, 'ready')} style={{
                            background: 'white',
                            border: '1px solid #E0E0E0',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            color: '#FF6B35',
                            fontWeight: '600'
                          }}>
                            <i className="bi bi-check-circle me-1"></i>Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button onClick={() => handleStatusUpdate(order.id, 'completed')} style={{
                            background: 'white',
                            border: '1px solid #E0E0E0',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            color: '#27AE60',
                            fontWeight: '600'
                          }}>
                            <i className="bi bi-check-all me-1"></i>Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Meals */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #FF6B35'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h5 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#212529',
              margin: 0
            }}>
              <i className="bi bi-egg-fried me-2" style={{ color: '#FF6B35' }}></i>
              Your Active Meals
            </h5>
            <Link to="/meals/my-meals" style={{
              color: '#FF6B35',
              fontSize: '0.9rem',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              View All →
            </Link>
          </div>

          {meals.filter(m => m.is_active).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="bi bi-inbox" style={{ fontSize: '2rem', color: '#BDBDBD', display: 'block', marginBottom: '1rem' }}></i>
              <p style={{ color: '#757575', marginBottom: '1rem' }}>No active meals</p>
              <Link to="/meals/create" style={{
                background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
                color: 'white',
                padding: '0.6rem 1.25rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                <i className="bi bi-plus-circle me-1"></i>
                Create Your First Meal
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              {meals.filter(m => m.is_active).slice(0, 4).map((meal) => (
                <div key={meal.id} style={{
                  background: 'white',
                  border: '1px solid #E0E0E0',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  {meal.photo ? (
                    <img
                      src={meal.photo}
                      alt={meal.name}
                      style={{
                        width: '100%',
                        height: '140px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '140px',
                      background: '#F8F9FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-image" style={{ fontSize: '1.5rem', color: '#BDBDBD' }}></i>
                    </div>
                  )}
                  <div style={{ padding: '1rem' }}>
                    <h6 style={{ fontWeight: '700', color: '#212529', marginBottom: '0.5rem' }}>{meal.name}</h6>
                    <p style={{ color: '#FF6B35', fontWeight: '700', marginBottom: '0.25rem' }}>Rs. {meal.price}</p>
                    <small style={{ color: '#BDBDBD' }}>Qty: {meal.quantity_available}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookDashboard;
