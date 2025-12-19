import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import analyticsService from '../../services/analyticsService';
import { authService } from '../../services/authService';
import './AdminDashboard.css';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await analyticsService.getAdminStats();
            setStats(data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
            if (err.response?.status === 403) {
                setError('Access denied. Admin privileges required.');
            } else {
                setError('Failed to load analytics data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
                <button onClick={() => navigate('/')} className="btn btn-primary">
                    Go to Home
                </button>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <nav className="navbar navbar-dark bg-dark mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">
                        <i className="bi bi-speedometer2 me-2"></i>
                        Admin Dashboard
                    </span>
                    <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container-fluid">
                {/* KEY METRICS SECTION */}
                <h4 className="mb-3">
                    <i className="bi bi-graph-up-arrow me-2"></i>
                    Key Performance Metrics
                </h4>
                <div className="row g-4 mb-4">
                    {/* METRIC 1: Number of Orders */}
                    <div className="col-md-4">
                        <div className="card stats-card border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                            <div className="card-body text-white">
                                <h5 className="card-title">
                                    <i className="bi bi-cart-check-fill me-2"></i>
                                    Order Volume
                                </h5>
                                <h2 className="display-3 fw-bold">{stats.key_metrics?.orders?.total || 0}</h2>
                                <p className="mb-2">Total Orders</p>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2 mb-2">
                                    <span>This Week:</span>
                                    <strong>{stats.key_metrics?.orders?.this_week || 0}</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2 mb-2">
                                    <span>Growth Rate:</span>
                                    <strong className={stats.key_metrics?.orders?.growth_rate >= 0 ? 'text-success' : 'text-danger'}>
                                        {stats.key_metrics?.orders?.growth_rate >= 0 ? '+' : ''}{stats.key_metrics?.orders?.growth_rate || 0}%
                                    </strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2">
                                    <span>Success Rate:</span>
                                    <strong>{stats.key_metrics?.orders?.success_rate || 0}%</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* METRIC 2: Cook Retention Rate */}
                    <div className="col-md-4">
                        <div className="card stats-card border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'}}>
                            <div className="card-body text-white">
                                <h5 className="card-title">
                                    <i className="bi bi-person-check-fill me-2"></i>
                                    Cook Retention
                                </h5>
                                <h2 className="display-3 fw-bold">{stats.key_metrics?.cook_retention?.retention_rate || 0}%</h2>
                                <p className="mb-2">Weekly Retention Rate</p>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2 mb-2">
                                    <span>Weekly Active:</span>
                                    <strong>{stats.key_metrics?.cook_retention?.weekly_active_cooks || 0} cooks</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2 mb-2">
                                    <span>Monthly Active:</span>
                                    <strong>{stats.key_metrics?.cook_retention?.monthly_active_cooks || 0} cooks</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2">
                                    <span>Avg Orders/Cook:</span>
                                    <strong>{stats.key_metrics?.cook_retention?.avg_orders_per_cook || 0}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* METRIC 3: Proximity Match Success Rate */}
                    <div className="col-md-4">
                        <div className="card stats-card border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                            <div className="card-body text-white">
                                <h5 className="card-title">
                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                    Proximity Match
                                </h5>
                                <h2 className="display-3 fw-bold">{stats.key_metrics?.proximity_match?.overall_success_rate || 0}%</h2>
                                <p className="mb-2">Overall Success Rate</p>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2 mb-2">
                                    <span>Delivery:</span>
                                    <strong>{stats.key_metrics?.proximity_match?.delivery?.success_rate || 0}%</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2 mb-2">
                                    <span>Pickup:</span>
                                    <strong>{stats.key_metrics?.proximity_match?.pickup?.success_rate || 0}%</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center bg-white bg-opacity-25 rounded p-2">
                                    <span>Dine-in:</span>
                                    <strong>{stats.key_metrics?.proximity_match?.dinein?.success_rate || 0}%</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-4" />
                <h4 className="mb-3">
                    <i className="bi bi-bar-chart-fill me-2"></i>
                    Platform Overview
                </h4>

                {/* Summary Cards */}
                <div className="row g-4 mb-4">
                    {/* Users Card */}
                    <div className="col-md-4">
                        <div className="card stats-card border-primary">
                            <div className="card-body">
                                <h5 className="card-title text-primary">
                                    <i className="bi bi-people-fill me-2"></i>
                                    Users
                                </h5>
                                <h2 className="display-4">{stats.users.total}</h2>
                                <div className="stats-detail">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Cooks:</span>
                                        <strong>{stats.users.cooks}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Customers:</span>
                                        <strong>{stats.users.customers}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Approved Cooks:</span>
                                        <strong className="text-success">{stats.users.approved_cooks}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Pending Approval:</span>
                                        <strong className="text-warning">{stats.users.pending_cooks}</strong>
                                    </div>
                                    <hr />
                                    <small className="text-muted">
                                        Last 7 days: +{stats.users.signups_last_7_days}<br />
                                        Last 30 days: +{stats.users.signups_last_30_days}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meals Card */}
                    <div className="col-md-4">
                        <div className="card stats-card border-success">
                            <div className="card-body">
                                <h5 className="card-title text-success">
                                    <i className="bi bi-egg-fried me-2"></i>
                                    Meals
                                </h5>
                                <h2 className="display-4">{stats.meals.total}</h2>
                                <div className="stats-detail">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Active:</span>
                                        <strong className="text-success">{stats.meals.active}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Inactive:</span>
                                        <strong className="text-secondary">{stats.meals.inactive}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>With Dine-in:</span>
                                        <strong>{stats.meals.with_dinein}</strong>
                                    </div>
                                    <hr />
                                    <small className="text-muted">
                                        Last 7 days: +{stats.meals.created_last_7_days}<br />
                                        Last 30 days: +{stats.meals.created_last_30_days}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="col-md-4">
                        <div className="card stats-card border-warning">
                            <div className="card-body">
                                <h5 className="card-title text-warning">
                                    <i className="bi bi-cart-fill me-2"></i>
                                    Orders
                                </h5>
                                <h2 className="display-4">{stats.orders.total}</h2>
                                <div className="stats-detail">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Pending:</span>
                                        <strong className="text-warning">{stats.orders.pending}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Confirmed:</span>
                                        <strong className="text-info">{stats.orders.confirmed}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Ready:</span>
                                        <strong className="text-primary">{stats.orders.ready}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Completed:</span>
                                        <strong className="text-success">{stats.orders.completed}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Cancelled:</span>
                                        <strong className="text-danger">{stats.orders.cancelled}</strong>
                                    </div>
                                    <hr />
                                    <small className="text-muted">
                                        Today: {stats.orders.today}<br />
                                        Last 7 days: {stats.orders.last_7_days}<br />
                                        Last 30 days: {stats.orders.last_30_days}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue & Order Types */}
                <div className="row g-4 mb-4">
                    <div className="col-md-6">
                        <div className="card stats-card border-info">
                            <div className="card-body">
                                <h5 className="card-title text-info">
                                    <i className="bi bi-currency-dollar me-2"></i>
                                    Revenue
                                </h5>
                                <h2 className="display-4">Rs. {stats.revenue.total.toLocaleString()}</h2>
                                <div className="stats-detail">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Last 7 days:</span>
                                        <strong>Rs. {stats.revenue.last_7_days.toLocaleString()}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Last 30 days:</span>
                                        <strong>Rs. {stats.revenue.last_30_days.toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card stats-card border-secondary">
                            <div className="card-body">
                                <h5 className="card-title text-secondary">
                                    <i className="bi bi-box-seam me-2"></i>
                                    Order Types
                                </h5>
                                <div className="stats-detail mt-4">
                                    <div className="d-flex justify-content-between mb-3">
                                        <span><i className="bi bi-bag me-2"></i>Pickup:</span>
                                        <strong>{stats.orders.pickup}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span><i className="bi bi-truck me-2"></i>Delivery:</span>
                                        <strong>{stats.orders.delivery}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span><i className="bi bi-house-door me-2"></i>Dine-in:</span>
                                        <strong>{stats.orders.dinein}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings */}
                <div className="row g-4 mb-4">
                    <div className="col-md-12">
                        <div className="card stats-card border-danger">
                            <div className="card-body">
                                <h5 className="card-title text-danger">
                                    <i className="bi bi-star-fill me-2"></i>
                                    Ratings & Reviews
                                </h5>
                                <div className="row mt-3">
                                    <div className="col-md-4">
                                        <h6>Total Reviews: <strong>{stats.ratings.total}</strong></h6>
                                        <h6>Avg Meal Rating: <strong>{stats.ratings.avg_meal_rating} / 5.0</strong></h6>
                                        <h6>Avg Cook Rating: <strong>{stats.ratings.avg_cook_rating} / 5.0</strong></h6>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="mb-3">Rating Distribution:</h6>
                                        <div className="rating-bars">
                                            {[5, 4, 3, 2, 1].map(star => (
                                                <div key={star} className="d-flex align-items-center mb-2">
                                                    <span className="me-2">{star} ★</span>
                                                    <div className="progress flex-grow-1 me-2">
                                                        <div 
                                                            className={`progress-bar ${star >= 4 ? 'bg-success' : star === 3 ? 'bg-warning' : 'bg-danger'}`}
                                                            style={{width: `${(stats.ratings.distribution[`${star}_star`] / stats.ratings.total * 100) || 0}%`}}
                                                        ></div>
                                                    </div>
                                                    <span>{stats.ratings.distribution[`${star}_star`]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="row g-4 mb-4">
                    {/* Top Cooks */}
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-trophy-fill me-2"></i>
                                    Top Cooks
                                </h5>
                            </div>
                            <div className="card-body">
                                {stats.top_performers.cooks.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {stats.top_performers.cooks.map((cook, index) => (
                                            <li key={cook.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="badge bg-primary me-2">{index + 1}</span>
                                                    <strong>{cook.username}</strong>
                                                    <br />
                                                    <small className="text-muted">{cook.email}</small>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-warning">
                                                        <i className="bi bi-star-fill"></i> {cook.rating.toFixed(1)}
                                                    </div>
                                                    <small className="text-muted">{cook.total_reviews} reviews</small>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No cooks yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Popular Meals */}
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-fire me-2"></i>
                                    Popular Meals
                                </h5>
                            </div>
                            <div className="card-body">
                                {stats.top_performers.meals.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {stats.top_performers.meals.map((meal, index) => (
                                            <li key={meal.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="badge bg-success me-2">{index + 1}</span>
                                                    <strong>{meal.title}</strong>
                                                    <br />
                                                    <small className="text-muted">by {meal.cook}</small>
                                                </div>
                                                <div className="text-end">
                                                    <div>Rs. {meal.price}</div>
                                                    <small className="text-muted">{meal.orders} orders</small>
                                                    {meal.is_active && <span className="badge bg-success ms-2">Active</span>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No meals yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active Customers */}
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header bg-warning text-dark">
                                <h5 className="mb-0">
                                    <i className="bi bi-person-fill me-2"></i>
                                    Active Customers
                                </h5>
                            </div>
                            <div className="card-body">
                                {stats.top_performers.customers.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {stats.top_performers.customers.map((customer, index) => (
                                            <li key={customer.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="badge bg-warning text-dark me-2">{index + 1}</span>
                                                    <strong>{customer.username}</strong>
                                                    <br />
                                                    <small className="text-muted">{customer.email}</small>
                                                </div>
                                                <div className="text-end">
                                                    <div className="badge bg-info">{customer.total_orders} orders</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No customers yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="text-center mb-4">
                    <button onClick={fetchStats} className="btn btn-primary">
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
