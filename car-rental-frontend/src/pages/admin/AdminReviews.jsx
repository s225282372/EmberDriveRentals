import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import reviewService from '../../services/reviewService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedReviews, setSelectedReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getReviews({ pageSize: 100 });
      setReviews(response.items || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      await reviewService.updateReviewStatus(reviewId, newStatus);
      toast.success(`Review ${newStatus.toLowerCase()}`);
      fetchReviews();
      setSelectedReviews([]);
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReviews.length === 0) {
      toast.error('Please select at least one review');
      return;
    }

    if (!window.confirm(`${action} ${selectedReviews.length} review(s)?`)) return;

    try {
      if (action === 'Approve') {
        await reviewService.bulkApprove(selectedReviews);
      } else {
        await reviewService.bulkReject(selectedReviews);
      }
      toast.success(`${selectedReviews.length} review(s) ${action.toLowerCase()}d`);
      fetchReviews();
      setSelectedReviews([]);
    } catch (error) {
      console.error('Error with bulk action:', error);
      toast.error('Failed to process bulk action');
    }
  };

  const handleSelectAll = () => {
    const pendingReviews = filteredReviews
      .filter(r => r.status === 'Pending')
      .map(r => r.reviewId);
    
    if (selectedReviews.length === pendingReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(pendingReviews);
    }
  };

  const handleSelectReview = (reviewId) => {
    setSelectedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const filteredReviews = reviews.filter(review => {
    return filterStatus === 'All' || review.status === filterStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'badge-warning',
      Approved: 'badge-success',
      Rejected: 'badge-danger'
    };
    return colors[status] || 'badge-secondary';
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Reviews Management
          </h2>
          <p className="text-gray-600 mt-1">Approve or reject customer reviews</p>
        </div>

        {/* Bulk Actions */}
        {selectedReviews.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={() => handleBulkAction('Approve')}
              className="btn btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve ({selectedReviews.length})
            </button>
            <button
              onClick={() => handleBulkAction('Reject')}
              className="btn btn-secondary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject ({selectedReviews.length})
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-md border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 font-semibold">Pending Reviews</p>
              <p className="text-3xl font-black text-yellow-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {reviews.filter(r => r.status === 'Pending').length}
              </p>
            </div>
            <div className="p-4 bg-yellow-200 rounded-xl">
              <svg className="w-8 h-8 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-md border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-semibold">Approved</p>
              <p className="text-3xl font-black text-green-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {reviews.filter(r => r.status === 'Approved').length}
              </p>
            </div>
            <div className="p-4 bg-green-200 rounded-xl">
              <svg className="w-8 h-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-md border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800 font-semibold">Rejected</p>
              <p className="text-3xl font-black text-red-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {reviews.filter(r => r.status === 'Rejected').length}
              </p>
            </div>
            <div className="p-4 bg-red-200 rounded-xl">
              <svg className="w-8 h-8 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input max-w-xs"
          >
            <option value="All">All Reviews</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {filterStatus === 'Pending' && filteredReviews.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="btn btn-secondary btn-sm ml-auto"
            >
              {selectedReviews.length === filteredReviews.filter(r => r.status === 'Pending').length
                ? 'Deselect All'
                : 'Select All'}
            </button>
          )}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-6">
                {/* Checkbox for pending reviews */}
                {review.status === 'Pending' && (
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.reviewId)}
                      onChange={() => handleSelectReview(review.reviewId)}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                )}

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {review.userName || 'Anonymous'}
                        </h3>
                        <span className={`badge ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Car:</span> {review.carMake} {review.carModel}
                    </p>
                    <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                  </div>

                  {/* Actions */}
                  {review.status === 'Pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleStatusChange(review.reviewId, 'Approved')}
                        className="btn btn-primary btn-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(review.reviewId, 'Rejected')}
                        className="btn btn-secondary btn-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add custom font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
      `}</style>
    </div>
  );
};

export default AdminReviews;