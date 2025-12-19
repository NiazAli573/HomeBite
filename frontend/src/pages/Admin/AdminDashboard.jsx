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
