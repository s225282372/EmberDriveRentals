import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import dashboardService from '../../services/dashboardService';
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
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Welcome Back, Admin! 👋
            </h2>
            <p className="text-white/90 text-lg">
              Here's what's happening with your business today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl border-l-4 ${
                alert.severity === 'error'
                  ? 'bg-red-50 border-red-500'
                  : alert.severity === 'warning'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${
                  alert.severity === 'error' ? 'bg-red-100' : alert.severity === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    alert.severity === 'error' ? 'text-red-600' : alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${
                    alert.severity === 'error' ? 'text-red-900' : alert.severity === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                  }`}>
                    {alert.message}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  alert.severity === 'error' ? 'bg-red-200 text-red-800' : alert.severity === 'warning' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
                }`}>
                  {alert.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {stats?.users?.total || 0}
          </p>
        </div>

        {/* Total Cars */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Cars</h3>
          <p className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {stats?.cars?.total || 0}
          </p>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Bookings</h3>
          <p className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {stats?.bookings?.total || 0}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {stats?.revenue?.growth !== undefined && (
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                stats.revenue.growth > 0 ? 'bg-green-500/20 text-white' : 'bg-red-500/20 text-white'
              }`}>
                {stats.revenue.growth > 0 ? '↑' : '↓'} {Math.abs(stats.revenue.growth).toFixed(1)}%
              </div>
            )}
          </div>
          <h3 className="text-white/80 text-sm font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            ${stats?.revenue?.total?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Booking Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Pending</span>
              <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold">
                {stats?.bookings?.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Confirmed</span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-bold">
                {stats?.bookings?.confirmed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Completed</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-bold">
                {stats?.bookings?.completed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Cancelled</span>
              <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-bold">
                {stats?.bookings?.cancelled || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Car Availability */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Car Availability
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Available</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-bold">
                {stats?.cars?.available || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Maintenance</span>
              <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold">
                {stats?.cars?.maintenance || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Unavailable</span>
              <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-bold">
                {stats?.cars?.unavailable || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Reviews
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Pending</span>
              <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold">
                {stats?.reviews?.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Approved</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-bold">
                {stats?.reviews?.approved || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <span className="text-gray-700 font-semibold">Average Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-lg font-bold text-yellow-600">
                  {stats?.reviews?.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
        <h3 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/cars" 
            className="group p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-200"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">Manage Cars</span>
            </div>
          </Link>

          <Link 
            to="/admin/bookings" 
            className="group p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-green-200"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">View Bookings</span>
            </div>
          </Link>

          <Link 
            to="/admin/reviews" 
            className="group p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-yellow-200"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-yellow-500 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">Reviews</span>
            </div>
          </Link>

          <Link 
            to="/admin/damages" 
            className="group p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-red-200"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-red-500 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">Damage Reports</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Add custom font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
      `}</style>
    </div>
  );
};

export default AdminDashboard;