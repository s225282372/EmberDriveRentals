using CarRentalAPI.Data;
using CarRentalAPI.DTOs;
using CarRentalAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRentalAPI.Services
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Booking> CreateBookingAsync(Guid userId, CreateBookingDto dto)
        {
            // TEMPORARY: logic to be implented
            throw new NotImplementedException();
        }

        public async Task CancelBookingAsync(Guid bookingId, Guid currentUserId, bool isAdmin)
        {
            // TEMPORARY: logic to be implented
            throw new NotImplementedException();
        }

        public async Task UpdateBookingStatusAsync(Guid bookingId, string newStatus)
        {
            // TEMPORARY: logic to be implented
            throw new NotImplementedException();
        }
    }
}
