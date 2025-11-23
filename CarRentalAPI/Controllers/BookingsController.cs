using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CarRentalAPI.Data;
using CarRentalAPI.DTOs;
using CarRentalAPI.Models;
using CarRentalAPI.Services;
using CarRentalAPI.Helpers;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public BookingsController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// Get all bookings with pagination and search (Admin only) or user's own bookings
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<PagedResponse<BookingDto>>> GetBookings([FromQuery] BookingSearchParams searchParams)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var query = _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Car)
                .AsQueryable();

            // Non-admin users can only see their own bookings
            if (!isAdmin)
            {
                query = query.Where(b => b.UserId.ToString() == currentUserId);
            }
            else
            {
                // Admin can filter by userId
                if (searchParams.UserId.HasValue)
                    query = query.Where(b => b.UserId == searchParams.UserId.Value);
            }

            // Search term
            if (!string.IsNullOrEmpty(searchParams.SearchTerm))
            {
                var searchTerm = searchParams.SearchTerm.ToLower();
                query = query.Where(b =>
                    b.User.FullName.ToLower().Contains(searchTerm) ||
                    b.User.Email.ToLower().Contains(searchTerm) ||
                    b.Car.Make.ToLower().Contains(searchTerm) ||
                    b.Car.Model.ToLower().Contains(searchTerm)
                );
            }

            // Apply filters
            if (!string.IsNullOrEmpty(searchParams.Status))
                query = query.Where(b => b.Status == searchParams.Status);

            if (searchParams.CarId.HasValue)
                query = query.Where(b => b.CarId == searchParams.CarId.Value);

            if (searchParams.StartDate.HasValue)
                query = query.Where(b => b.StartDate >= searchParams.StartDate.Value);

            if (searchParams.EndDate.HasValue)
                query = query.Where(b => b.EndDate <= searchParams.EndDate.Value);

            // Sorting
            query = searchParams.SortBy?.ToLower() switch
            {
                "startdate" => searchParams.SortOrder == "desc"
                    ? query.OrderByDescending(b => b.StartDate)
                    : query.OrderBy(b => b.StartDate),
                "totalprice" => searchParams.SortOrder == "desc"
                    ? query.OrderByDescending(b => b.TotalPrice)
                    : query.OrderBy(b => b.TotalPrice),
                _ => searchParams.SortOrder == "desc"
                    ? query.OrderByDescending(b => b.CreatedAt)
                    : query.OrderBy(b => b.CreatedAt)
            };

            var pagedBookings = await query.ToPagedResponseAsync(
                searchParams.PageNumber,
                searchParams.PageSize
            );

            var bookingDtos = pagedBookings.Items.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                UserId = b.UserId,
                UserName = b.User.FullName,
                UserEmail = b.User.Email,
                CarId = b.CarId,
                CarMake = b.Car.Make,
                CarModel = b.Car.Model,
                CarYear = b.Car.Year,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                TotalPrice = b.TotalPrice,
                Status = b.Status,
                CreatedAt = b.CreatedAt
            }).ToList();

            // Return paginated response with DTOs
            var response = new PagedResponse<BookingDto>
            {
                CurrentPage = pagedBookings.CurrentPage,
                TotalPages = pagedBookings.TotalPages,
                PageSize = pagedBookings.PageSize,
                TotalCount = pagedBookings.TotalCount,
                HasPrevious = pagedBookings.HasPrevious,
                HasNext = pagedBookings.HasNext,
                Items = bookingDtos
            };

            return Ok(response);
        }

        /// <summary>
        /// Get a specific booking by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> GetBooking(Guid id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Car)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            // Non-admin users can only view their own bookings
            if (!isAdmin && booking.UserId.ToString() != currentUserId)
            {
                return Forbid();
            }

            var bookingDto = new BookingDto
            {
                BookingId = booking.BookingId,
                UserId = booking.UserId,
                UserName = booking.User.FullName,
                UserEmail = booking.User.Email,
                CarId = booking.CarId,
                CarMake = booking.Car.Make,
                CarModel = booking.Car.Model,
                CarYear = booking.Car.Year,
                StartDate = booking.StartDate,
                EndDate = booking.EndDate,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CreatedAt = booking.CreatedAt
            };

            return Ok(bookingDto);
        }

        /// <summary>
        /// Create a new booking
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<BookingDto>> CreateBooking(CreateBookingDto createBookingDto)
        {
            var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Validate dates
            if (createBookingDto.StartDate < DateTime.UtcNow.Date)
            {
                return BadRequest(new { message = "Start date cannot be in the past" });
            }

            if (createBookingDto.EndDate <= createBookingDto.StartDate)
            {
                return BadRequest(new { message = "End date must be after start date" });
            }

            // Check if car exists
            var car = await _context.Cars.FindAsync(createBookingDto.CarId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            // Check if car is available
            if (car.Status != "Available")
            {
                return BadRequest(new { message = $"Car is currently {car.Status}" });
            }

            // Check for overlapping bookings (CRITICAL - Prevent double-booking)
            var hasOverlap = await _context.Bookings
                .AnyAsync(b => b.CarId == createBookingDto.CarId
                    && b.Status != "Cancelled"
                    && b.StartDate < createBookingDto.EndDate
                    && b.EndDate > createBookingDto.StartDate);

            if (hasOverlap)
            {
                return BadRequest(new { message = "Car is not available for the selected dates" });
            }

            // Calculate total price
            var days = (createBookingDto.EndDate - createBookingDto.StartDate).Days;
            var totalPrice = days * car.PricePerDay;

            // Create booking
            var booking = new Booking
            {
                UserId = currentUserId,
                CarId = createBookingDto.CarId,
                StartDate = createBookingDto.StartDate,
                EndDate = createBookingDto.EndDate,
                TotalPrice = totalPrice,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Load related data for response
            await _context.Entry(booking).Reference(b => b.User).LoadAsync();
            await _context.Entry(booking).Reference(b => b.Car).LoadAsync();

            // Send booking confirmation email
            var carName = $"{booking.Car.Make} {booking.Car.Model} {booking.Car.Year}";
            _ = _emailService.SendBookingConfirmationAsync(
                booking.User.Email,
                booking.User.FullName,
                carName,
                booking.StartDate,
                booking.EndDate,
                booking.TotalPrice
            );

            var bookingDto = new BookingDto
            {
                BookingId = booking.BookingId,
                UserId = booking.UserId,
                UserName = booking.User.FullName,
                UserEmail = booking.User.Email,
                CarId = booking.CarId,
                CarMake = booking.Car.Make,
                CarModel = booking.Car.Model,
                CarYear = booking.Car.Year,
                StartDate = booking.StartDate,
                EndDate = booking.EndDate,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CreatedAt = booking.CreatedAt
            };

            return CreatedAtAction(nameof(GetBooking), new { id = booking.BookingId }, bookingDto);
        }

        /// <summary>
        /// Update booking status (Admin only)
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBookingStatus(Guid id, UpdateBookingStatusDto statusDto)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Car)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            booking.Status = statusDto.Status;
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Send status update email
            var carName = $"{booking.Car.Make} {booking.Car.Model} {booking.Car.Year}";
            _ = _emailService.SendBookingStatusUpdateAsync(
                booking.User.Email,
                booking.User.FullName,
                carName,
                booking.Status
            );

            return NoContent();
        }

        /// <summary>
        /// Cancel a booking (User can cancel their own, Admin can cancel any)
        /// </summary>
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(Guid id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            // Non-admin users can only cancel their own bookings
            if (!isAdmin && booking.UserId.ToString() != currentUserId)
            {
                return Forbid();
            }

            // Check if booking can be cancelled
            if (booking.Status == "Completed")
            {
                return BadRequest(new { message = "Cannot cancel a completed booking" });
            }

            if (booking.Status == "Cancelled")
            {
                return BadRequest(new { message = "Booking is already cancelled" });
            }

            booking.Status = "Cancelled";
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking cancelled successfully" });
        }

        /// <summary>
        /// Get booking statistics (Admin only)
        /// </summary>
        [HttpGet("statistics")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetBookingStatistics()
        {
            var totalBookings = await _context.Bookings.CountAsync();
            var pendingBookings = await _context.Bookings.CountAsync(b => b.Status == "Pending");
            var confirmedBookings = await _context.Bookings.CountAsync(b => b.Status == "Confirmed");
            var completedBookings = await _context.Bookings.CountAsync(b => b.Status == "Completed");
            var cancelledBookings = await _context.Bookings.CountAsync(b => b.Status == "Cancelled");
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == "Completed")
                .SumAsync(b => b.TotalPrice);

            return Ok(new
            {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                completedBookings,
                cancelledBookings,
                totalRevenue
            });
        }
    }
}