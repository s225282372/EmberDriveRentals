import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: capitalize(filter) } : {};
      const response = await bookingService.getMyBookings(params);
      setBookings(response.items || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'badge-warning',
      Confirmed: 'badge-info',
      Completed: 'badge-success',
      Cancelled: 'badge-danger',
    };
    return badges[status] || 'badge-secondary';
  };

  const filters = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-lg text-gray-600">View and manage your car rentals</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && <LoadingSpinner text="Loading your bookings..." />}

        {/* Bookings List */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.bookingId} className="card">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Car Image */}
                  <div className="w-full md:w-48 aspect-video md:aspect-square bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400"
                      alt={`${booking.carMake} ${booking.carModel}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {booking.carMake} {booking.carModel}
                        </h3>
                        <p className="text-gray-600">{booking.carYear}</p>
                      </div>
                      <span className={`badge ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Pick-up Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(booking.startDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Return Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Total Price</p>
                        <p className="text-2xl font-bold text-primary-600">
                          R{booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Booking Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Link
                        to={`/cars/${booking.carId}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View Car
                      </Link>
                      {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                        <button
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          className="btn btn-danger btn-sm"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet"
                : `You don't have any ${filter} bookings`}
            </p>
            <Link to="/cars" className="btn btn-primary">
              Browse Cars
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
