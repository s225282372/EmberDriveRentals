import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import carService from '../services/carService';
import ImageGallery from '../components/cars/ImageGallery';
import BookingForm from '../components/bookings/BookingForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    setLoading(true);
    try {
      const response = await carService.getCarById(id);
      setCar(response);
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast.error('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <LoadingSpinner text="Loading car details..." />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
          <Link to="/cars" className="btn btn-primary">
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/cars" className="hover:text-primary-600">Cars</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{car.make} {car.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {car.make} {car.model}
              </h1>
              <p className="text-xl text-gray-600">{car.year}</p>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={car.imageUrls} />

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Make</p>
                  <p className="text-lg font-semibold text-gray-900">{car.make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Model</p>
                  <p className="text-lg font-semibold text-gray-900">{car.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Year</p>
                  <p className="text-lg font-semibold text-gray-900">{car.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`badge ${
                    car.status === 'Available' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {car.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Car</h2>
              <p className="text-gray-700 leading-relaxed">
                Experience the perfect blend of luxury and performance with the {car.make} {car.model}. 
                This {car.year} model comes equipped with premium features and delivers an exceptional 
                driving experience. Whether you're looking for comfort, style, or performance, this 
                vehicle has it all.
              </p>
            </div>

            {/* Rental Policy */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rental Policy</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Minimum Age</p>
                    <p className="text-sm text-gray-600">Driver must be at least 21 years old</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Valid License</p>
                    <p className="text-sm text-gray-600">Valid driver's license required</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Insurance</p>
                    <p className="text-sm text-gray-600">Comprehensive insurance included</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Fuel Policy</p>
                    <p className="text-sm text-gray-600">Return with full tank or pay refueling charge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm car={car} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
