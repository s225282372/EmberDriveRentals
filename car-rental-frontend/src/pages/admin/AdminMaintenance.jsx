import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import maintenanceService from '../../services/maintenanceService';
import carService from '../../services/carService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMaintenance = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    const [formData, setFormData] = useState({
        carId: '',
        description: '',
        scheduledDate: '',
        cost: '',
        status: 'Due'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [maintenanceRes, carsRes] = await Promise.all([
                maintenanceService.getMaintenanceRecords({ pageSize: 100 }),
                carService.getCars({ pageSize: 100 })
            ]);
            setMaintenanceRecords(maintenanceRes.items || []);
            setCars(carsRes.items || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load maintenance records');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                carId: record.carId,
                description: record.description,
                scheduledDate: record.scheduledDate?.split('T')[0] || '',
                cost: record.cost || '',
                status: record.status
            });
        } else {
            setEditingRecord(null);
            setFormData({
                carId: '',
                description: '',
                scheduledDate: '',
                cost: '',
                status: 'Due'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRecord(null);
        setFormData({
            carId: '',
            description: '',
            scheduledDate: '',
            cost: '',
            status: 'Due'
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const maintenanceData = {
                ...formData,
                cost: formData.cost ? parseFloat(formData.cost) : null
            };

            if (editingRecord) {
                await maintenanceService.updateMaintenance(editingRecord.maintenanceId, maintenanceData);
                toast.success('Maintenance record updated');
            } else {
                await maintenanceService.createMaintenance(maintenanceData);
                toast.success('Maintenance scheduled successfully');
            }

            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Error saving maintenance:', error);
            toast.error('Failed to save maintenance record');
        }
    };

    const handleComplete = async (maintenanceId) => {
        if (!window.confirm('Mark this maintenance as completed?')) return;

        try {
            await maintenanceService.completeMaintenance(maintenanceId);
            toast.success('Maintenance marked as completed');
            fetchData();
        } catch (error) {
            console.error('Error completing maintenance:', error);
            toast.error('Failed to complete maintenance');
        }
    };

    const handleDelete = async (maintenanceId) => {
        if (!window.confirm('Delete this maintenance record?')) return;

        try {
            await maintenanceService.deleteMaintenance(maintenanceId);
            toast.success('Maintenance record deleted');
            fetchData();
        } catch (error) {
            console.error('Error deleting maintenance:', error);
            toast.error('Failed to delete maintenance record');
        }
    };

    const filteredRecords = maintenanceRecords.filter(record => {
        return filterStatus === 'All' || record.status === filterStatus;
    });

    const getStatusColor = (status) => {
        const colors = {
            Due: 'badge-warning',
            Completed: 'badge-success',
            Overdue: 'badge-danger'
        };
        return colors[status] || 'badge-secondary';
    };

    const isOverdue = (scheduledDate, status) => {
        if (status === 'Completed') return false;
        return new Date(scheduledDate) < new Date();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCarName = (carId) => {
        const car = cars.find(c => c.carId === carId);
        return car ? `${car.make} ${car.model}` : 'Unknown';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner text="Loading maintenance records..." />
            </div>
        );
    }

    const overdueCount = maintenanceRecords.filter(r => isOverdue(r.scheduledDate, r.status)).length;
    const dueCount = maintenanceRecords.filter(r => r.status === 'Due' && !isOverdue(r.scheduledDate, r.status)).length;
    const completedCount = maintenanceRecords.filter(r => r.status === 'Completed').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Maintenance Management
                    </h2>
                    <p className="text-gray-600 mt-1">Schedule and track vehicle maintenance</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Schedule Maintenance
                </button>
            </div>

            {/* Alerts for Overdue */}
            {overdueCount > 0 && (
                <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-xl">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-red-100 rounded-xl">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-red-900">
                                ⚠️ {overdueCount} overdue maintenance task{overdueCount > 1 ? 's' : ''} require immediate attention!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-md border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-800 font-semibold">Overdue</p>
                            <p className="text-3xl font-black text-red-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                {overdueCount}
                            </p>
                        </div>
                        <div className="p-4 bg-red-200 rounded-xl">
                            <svg className="w-8 h-8 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-md border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-800 font-semibold">Due Soon</p>
                            <p className="text-3xl font-black text-yellow-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                {dueCount}
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
                            <p className="text-sm text-green-800 font-semibold">Completed</p>
                            <p className="text-3xl font-black text-green-900 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                {completedCount}
                            </p>
                        </div>
                        <div className="p-4 bg-green-200 rounded-xl">
                            <svg className="w-8 h-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        <option value="All">All Maintenance</option>
                        <option value="Due">Due</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Maintenance Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Car</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Scheduled Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No maintenance records found
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => {
                                    const overdue = isOverdue(record.scheduledDate, record.status);
                                    return (
                                        <tr
                                            key={record.maintenanceId}
                                            className={`hover:bg-gray-50 transition-colors ${overdue ? 'bg-red-50' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{getCarName(record.carId)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900">{record.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div className="text-gray-900">{formatDate(record.scheduledDate)}</div>
                                                    {overdue && (
                                                        <span className="text-xs text-red-600 font-semibold">Overdue!</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {record.cost ? (
                                                    <span className="font-bold text-gray-900">${record.cost.toFixed(2)}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`badge ${overdue ? 'badge-danger' : getStatusColor(record.status)}`}>
                                                    {overdue ? 'Overdue' : record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {record.status === 'Due' && (
                                                        <button
                                                            onClick={() => handleComplete(record.maintenanceId)}
                                                            className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                                                            title="Mark Complete"
                                                        >
                                                            <svg className="w-5 h-5 text-gray-600 group-hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleOpenModal(record)}
                                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(record.maintenanceId)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                        <div className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                {editingRecord ? 'Edit Maintenance' : 'Schedule Maintenance'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="form-group">
                                <label htmlFor="carId" className="label">Select Car</label>
                                <select
                                    id="carId"
                                    name="carId"
                                    value={formData.carId}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    <option value="">Choose a car...</option>
                                    {cars.map((car) => (
                                        <option key={car.carId} value={car.carId}>
                                            {car.make} {car.model} ({car.year})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="label">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input min-h-24"
                                    placeholder="e.g., Oil change, tire rotation, brake inspection"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label htmlFor="scheduledDate" className="label">Scheduled Date</label>
                                    <input
                                        type="date"
                                        id="scheduledDate"
                                        name="scheduledDate"
                                        value={formData.scheduledDate}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cost" className="label">Estimated Cost ($)</label>
                                    <input
                                        type="number"
                                        id="cost"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleChange}
                                        className="input"
                                        step="0.01"
                                        min="0"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                >
                                    {editingRecord ? 'Update' : 'Schedule'}
                                </button>
                            </div>
                        </form>
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

export default AdminMaintenance;