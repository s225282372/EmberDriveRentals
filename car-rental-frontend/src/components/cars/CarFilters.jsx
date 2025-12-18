import { useState } from 'react';

const CarFilters = ({ filters, onFilterChange, onSearch }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onSearch();
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: '',
      make: '',
      model: '',
      year: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'make',
      sortOrder: 'asc',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onSearch();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            name="searchTerm"
            value={localFilters.searchTerm}
            onChange={handleChange}
            placeholder="Search by make, model, or features..."
            className="input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Toggle Advanced Filters */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-sm text-primary-600 hover:text-primary-700 mb-4"
      >
        <span className="font-medium">
          {isExpanded ? 'Hide' : 'Show'} Advanced Filters
        </span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Make */}
          <div>
            <label className="label">Make</label>
            <input
              type="text"
              name="make"
              value={localFilters.make}
              onChange={handleChange}
              placeholder="e.g., Toyota"
              className="input"
            />
          </div>

          {/* Model */}
          <div>
            <label className="label">Model</label>
            <input
              type="text"
              name="model"
              value={localFilters.model}
              onChange={handleChange}
              placeholder="e.g., Camry"
              className="input"
            />
          </div>

          {/* Year */}
          <div>
            <label className="label">Year</label>
            <input
              type="number"
              name="year"
              value={localFilters.year}
              onChange={handleChange}
              placeholder="e.g., 2024"
              className="input"
              min="1900"
              max="2100"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="label">Min Price (R/day)</label>
            <input
              type="number"
              name="minPrice"
              value={localFilters.minPrice}
              onChange={handleChange}
              placeholder="0"
              className="input"
              min="0"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="label">Max Price (R/day)</label>
            <input
              type="number"
              name="maxPrice"
              value={localFilters.maxPrice}
              onChange={handleChange}
              placeholder="1000"
              className="input"
              min="0"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="label">Sort By</label>
            <select
              name="sortBy"
              value={localFilters.sortBy}
              onChange={handleChange}
              className="input"
            >
              <option value="make">Make</option>
              <option value="model">Model</option>
              <option value="year">Year</option>
              <option value="price">Price</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="md:col-span-2">
            <label className="label">Sort Order</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={localFilters.sortOrder === 'asc'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Ascending
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={localFilters.sortOrder === 'desc'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Descending
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button onClick={handleApply} className="btn btn-primary flex-1">
          Apply Filters
        </button>
        <button onClick={handleReset} className="btn btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
};

export default CarFilters;
