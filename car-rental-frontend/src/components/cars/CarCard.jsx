import { Link } from 'react-router-dom';
import { getImageUrl } from "../../services/api"; // ✅ Correct

const CarCard = ({ car }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800';
  
  // ⭐ Use helper function
  const carImage = car.imageUrls && car.imageUrls.length > 0 
    ? getImageUrl(car.imageUrls[0])
    : defaultImage;

  const getStatusBadge = (status) => {
    const badges = {
      Available: 'badge-success',
      Maintenance: 'badge-warning',
      Unavailable: 'badge-danger',
    };
    return badges[status] || 'badge-secondary';
  };

  return (
    <Link to={`/cars/${car.carId}`} className="block">
      <div className="card card-clickable group h-full">
        {/* Image */}
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
          <img
            src={carImage}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              console.error('Image failed to load:', carImage);
              e.target.src = defaultImage;
            }}
          />
          <div className="absolute top-3 right-3">
            <span className={`badge ${getStatusBadge(car.status)}`}>
              {car.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-500">{car.year}</p>
          </div>

          {car.features && car.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {car.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
              {car.features.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  +{car.features.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                ${car.pricePerDay}
                <span className="text-sm font-normal text-gray-500">/day</span>
              </p>
            </div>
            <button className="btn btn-primary btn-sm">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;