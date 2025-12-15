import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, alertsData] = await Promise.all([
        dashboardService.getStatistics(),
        dashboardService.getAlerts(),
      ]);
      setStats(statsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's your overview</p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold">{alert.message}</p>
                  </div>
                  <span className="badge badge-secondary">{alert.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.users?.total || 0}
            color="primary"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Cars"
            value={stats?.cars?.total || 0}
            color="info"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            }
          />
          <StatCard
            title="Total Bookings"
            value={stats?.bookings?.total || 0}
            color="success"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats?.revenue?.total?.toFixed(2) || 0}`}
            color="success"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={{ positive: stats?.revenue?.growth > 0, value: `${Math.abs(stats?.revenue?.growth || 0).toFixed(1)}%` }}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="badge badge-warning">{stats?.bookings?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Confirmed</span>
                <span className="badge badge-info">{stats?.bookings?.confirmed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="badge badge-success">{stats?.bookings?.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cancelled</span>
                <span className="badge badge-danger">{stats?.bookings?.cancelled || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Availability</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available</span>
                <span className="badge badge-success">{stats?.cars?.available || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maintenance</span>
                <span className="badge badge-warning">{stats?.cars?.maintenance || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Unavailable</span>
                <span className="badge badge-danger">{stats?.cars?.unavailable || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="badge badge-warning">{stats?.reviews?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <span className="badge badge-success">{stats?.reviews?.approved || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-semibold text-yellow-600">⭐ {stats?.reviews?.averageRating?.toFixed(1) || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/cars" className="btn btn-primary">
              Manage Cars
            </Link>
            <Link to="/admin/bookings" className="btn btn-secondary">
              View Bookings
            </Link>
            <Link to="/admin/reviews" className="btn btn-secondary">
              Review Management
            </Link>
            <Link to="/admin/damages" className="btn btn-secondary">
              Damage Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

