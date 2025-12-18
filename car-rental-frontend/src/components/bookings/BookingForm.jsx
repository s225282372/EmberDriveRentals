import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format, differenceInDays, addDays } from 'date-fns';
import useAuthStore from '../../store/authStore';
import bookingService from '../../services/bookingService';

const BookingForm = ({ car, onBookingSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    startDate: today,
    endDate: tomorrow,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return differenceInDays(end, start);
  };

  const calculateTotal = () => {
    const days = calculateDays();
    return days > 0 ? days * car.pricePerDay : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      toast.error('Please login to book a car');
      navigate('/login');
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast.error('End date must be after start date');
      return;
    }

    const days = calculateDays();
    if (days < 1) {
      toast.error('Minimum rental period is 1 day');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format dates for API (ISO format)
      const bookingData = {
        carId: car.carId,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const response = await bookingService.createBooking(bookingData);

      toast.success('Booking created successfully! 🎉');
      
      // Redirect to My Bookings page
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);

      if (onBookingSuccess) {
        onBookingSuccess(response);
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Booking failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const days = calculateDays();
  const total = calculateTotal();

  return (
    <div className="card sticky top-20">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-primary-600">
            R{car.pricePerDay}
          </span>
          <span className="text-gray-500">/day</span>
        </div>
        <div className={`inline-flex items-center badge ${
          car.status === 'Available' ? 'badge-success' : 'badge-warning'
        }`}>
          {car.status}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="label">
            Pick-up Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={today}
            required
            className="input"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="label">
            Return Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate || today}
            required
            className="input"
          />
        </div>

        {/* Price Breakdown */}
        {days > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                R{car.pricePerDay} × {days} {days === 1 ? 'day' : 'days'}
              </span>
              <span className="font-semibold">R{total.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600">
                R{total.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || car.status !== 'Available'}
          className="btn btn-primary w-full btn-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="spinner w-5 h-5 mr-2"></div>
              Processing...
            </span>
          ) : (
            'Reserve Now'
          )}
        </button>

        {!isAuthenticated() && (
          <p className="text-sm text-gray-600 text-center">
            You'll be redirected to login
          </p>
        )}
      </form>

      {/* Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Free cancellation up to 24 hours before pick-up</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Instant confirmation</span>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
