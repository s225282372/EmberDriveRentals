using CarRentalAPI.DTOs;
using CarRentalAPI.Models;

namespace CarRentalAPI.Services
{
    public interface IBookingService
    {
        Task<Booking> CreateBookingAsync(Guid userId, CreateBookingDto dto);
        Task CancelBookingAsync(Guid bookingId, Guid currentUserId, bool isAdmin);
        Task UpdateBookingStatusAsync(Guid bookingId, string newStatus);
    }
}
 