import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import damageService from '../../services/damageService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../services/api';

const AdminDamages = () => {
  const [damages, setDamages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDamage, setSelectedDamage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    fetchDamages();
  }, []);

  const fetchDamages = async () => {
    setLoading(true);
    try {
      const response = await damageService.getDamageReports({ pageSize: 100 });
      setDamages(response.items || []);
    } catch (error) {
      console.error('Error fetching damages:', error);
      toast.error('Failed to load damage reports');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (damage) => {
    setSelectedDamage(damage);
    setResolutionNote('');
    setShowDetailsModal(true);
  };

  const handleResolve = async () => {
    if (!resolutionNote.trim()) {
      toast.error('Please enter resolution notes');
      return;
    }

    try {
      await damageService.resolveDamage(selectedDamage.damageId, { notes: resolutionNote });
      toast.success('Damage report resolved successfully');
      setShowDetailsModal(false);
      fetchDamages();
    } catch (error) {
      console.error('Error resolving damage:', error);
      toast.error('Failed to resolve damage report');
    }
  };

  const filteredDamages = damages.filter(damage => {
    return filterStatus === 'All' || damage.status === filterStatus;
  });

  const getSeverityColor = (severity) => {
    const colors = {
      Low: 'badge-success',
      Medium: 'badge-warning',
      High: 'badge-danger'
    };
    return colors[severity] || 'badge-secondary';
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'badge-warning',
      Resolved: 'badge-success'
    };
    return colors[status] || 'badge-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner text="Loading damage reports..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Damage Reports
        </h2>
        <p className="text-gray-600 mt-1">Review and resolve vehicle damage claims</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-md border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800 font-semibold">Total Reports</p>
              <p className="text-3xl font-black text-red-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {damages.length}
              </p>
            </div>
            <div className="p-4 bg-red-200 rounded-xl">
              <svg className="w-8 h-8 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-md border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 font-semibold">Pending</p>
              <p className="text-3xl font-black text-yellow-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {damages.filter(d => d.status === 'Pending').length}
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
              <p className="text-sm text-green-800 font-semibold">Resolved</p>
              <p className="text-3xl font-black text-green-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {damages.filter(d => d.status === 'Resolved').length}
              </p>
            </div>
            <div className="p-4 bg-green-200 rounded-xl">
              <svg className="w-8 h-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-md border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-800 font-semibold">High Severity</p>
              <p className="text-3xl font-black text-orange-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {damages.filter(d => d.severity === 'High').length}
              </p>
            </div>
            <div className="p-4 bg-orange-200 rounded-xl">
              <svg className="w-8 h-8 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
            <option value="All">All Reports</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Damage Reports Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDamages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No damage reports found</p>
          </div>
        ) : (
          filteredDamages.map((damage) => (
            <div
              key={damage.damageId}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex gap-6">
                {/* Images */}
                {damage.imageUrls && damage.imageUrls.length > 0 && (
                  <div className="flex-shrink-0">
                    <div className="grid grid-cols-2 gap-2 w-48">
                      {damage.imageUrls.slice(0, 4).map((url, index) => (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(url)}
                            alt={`Damage ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=200';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {damage.imageUrls.length > 4 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        +{damage.imageUrls.length - 4} more
                      </p>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Damage Report #{damage.damageId.slice(0, 8)}
                        </h3>
                        <span className={`badge ${getStatusColor(damage.status)}`}>
                          {damage.status}
                        </span>
                        <span className={`badge ${getSeverityColor(damage.severity)}`}>
                          {damage.severity} Severity
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(damage.createdAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">Car</p>
                      <p className="text-gray-900">{damage.carMake} {damage.carModel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">Reporter</p>
                      <p className="text-gray-900">{damage.userName || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">Booking ID</p>
                      <p className="text-gray-900 font-mono text-sm">#{damage.bookingId?.slice(0, 8)}</p>
                    </div>
                    {damage.resolvedAt && (
                      <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Resolved</p>
                        <p className="text-gray-900 text-sm">{formatDate(damage.resolvedAt)}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 font-semibold mb-2">Description</p>
                    <p className="text-gray-800 leading-relaxed">{damage.description}</p>
                  </div>

                  {damage.status === 'Pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleViewDetails(damage)}
                        className="btn btn-primary flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Resolve Report
                      </button>
                      <button
                        onClick={() => handleViewDetails(damage)}
                        className="btn btn-secondary flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDamage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Damage Report Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Images */}
              {selectedDamage.imageUrls && selectedDamage.imageUrls.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Damage Photos</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedDamage.imageUrls.map((url, index) => (
                      <div key={index} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(url)}
                          alt={`Damage ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                <div>
                  <p className="text-sm text-gray-500 font-semibold mb-1">Report ID</p>
                  <p className="font-mono">{selectedDamage.damageId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold mb-1">Status</p>
                  <span className={`badge ${getStatusColor(selectedDamage.status)}`}>
                    {selectedDamage.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold mb-1">Severity</p>
                  <span className={`badge ${getSeverityColor(selectedDamage.severity)}`}>
                    {selectedDamage.severity}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold mb-1">Reported Date</p>
                  <p>{formatDate(selectedDamage.createdAt)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 font-semibold mb-2">Description</p>
                <p className="text-gray-800 leading-relaxed">{selectedDamage.description}</p>
              </div>

              {/* Resolution Form */}
              {selectedDamage.status === 'Pending' && (
                <div className="border-t border-gray-200 pt-6">
                  <label className="label">Resolution Notes</label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="input min-h-32"
                    placeholder="Enter resolution details, actions taken, costs, etc..."
                    required
                  />
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Close
                </button>
                {selectedDamage.status === 'Pending' && (
                  <button
                    onClick={handleResolve}
                    className="btn btn-primary flex-1"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
      `}</style>
    </div>
  );
};

export default AdminDamages;