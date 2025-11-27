import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import carService from '../services/carService';
import CarCard from '../components/cars/CarCard';
import CarFilters from '../components/cars/CarFilters';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 12,
  });

  const [filters, setFilters] = useState({
    searchTerm: '',
    make: '',
    model: '',
    year: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'make',
    sortOrder: 'asc',
  });

  const fetchCars = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        pageNumber,
        pageSize: pagination.pageSize,
      };

      const response = await carService.getCars(params);

      setCars(response.items || []);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
        pageSize: response.pageSize,
      });
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    fetchCars(1); // Reset to page 1 when searching
  };

  const handlePageChange = (page) => {
    fetchCars(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Our Fleet
          </h1>
          <p className="text-lg text-gray-600">
            Browse our collection of premium vehicles
          </p>
        </div>

        {/* Filters */}
        <CarFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? (
              'Loading...'
            ) : (
              <>
                Showing <span className="font-semibold">{cars.length}</span> of{' '}
                <span className="font-semibold">{pagination.totalCount}</span> vehicles
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner text="Loading vehicles..." />}

        {/* Cars Grid */}
        {!loading && cars.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.carId} car={car} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && cars.length === 0 && (
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to find more vehicles
            </p>
            <button
              onClick={() => {
                setFilters({
                  searchTerm: '',
                  make: '',
                  model: '',
                  year: '',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'make',
                  sortOrder: 'asc',
                });
                fetchCars(1);
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
