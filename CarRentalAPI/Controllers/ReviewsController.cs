using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CarRentalAPI.Data;
using CarRentalAPI.DTOs;
using CarRentalAPI.Models;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all reviews (Public sees approved, Admin sees all)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews(
            [FromQuery] Guid? carId,
            [FromQuery] string? status)
        {
            var isAdmin = User.Identity?.IsAuthenticated == true && User.IsInRole("Admin");

            var query = _context.Reviews
                .Include(r => r.Booking)
                    .ThenInclude(b => b.User)
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Car)
                .AsQueryable();

            // Non-admin users can only see approved reviews
            if (!isAdmin)
            {
                query = query.Where(r => r.Status == "Approved");
            }
            else if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(r => r.Status == status);
            }

            // Filter by car
            if (carId.HasValue)
            {
                query = query.Where(r => r.Booking.CarId == carId.Value);
            }

            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var reviewDtos = reviews.Select(r => new ReviewDto
            {
                ReviewId = r.ReviewId,
                BookingId = r.BookingId,
                UserName = r.Booking.User.FullName,
                CarMake = r.Booking.Car.Make,
                CarModel = r.Booking.Car.Model,
                Rating = r.Rating,
                Comment = r.Comment,
                Status = r.Status,
                CreatedAt = r.CreatedAt
            }).ToList();

            return Ok(reviewDtos);
        }

        /// <summary>
        /// Get reviews for a specific car (Public endpoint)
        /// </summary>
        [HttpGet("car/{carId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetCarReviews(Guid carId)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            var reviews = await _context.Reviews
                .Include(r => r.Booking)
                    .ThenInclude(b => b.User)
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Car)
                .Where(r => r.Booking.CarId == carId && r.Status == "Approved")
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var reviewDtos = reviews.Select(r => new ReviewDto
            {
                ReviewId = r.ReviewId,
                BookingId = r.BookingId,
                UserName = r.Booking.User.FullName,
                CarMake = r.Booking.Car.Make,
                CarModel = r.Booking.Car.Model,
                Rating = r.Rating,
                Comment = r.Comment,
                Status = r.Status,
                CreatedAt = r.CreatedAt
            }).ToList();

            return Ok(reviewDtos);
        }

        /// <summary>
        /// Create a review (only for completed bookings, one review per booking)
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto createDto)
        {
            var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Check if booking exists and belongs to current user
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Car)
                .FirstOrDefaultAsync(b => b.BookingId == createDto.BookingId);

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            if (booking.UserId != currentUserId)
            {
                return Forbid();
            }

            // Only allow reviews for completed bookings
            if (booking.Status != "Completed")
            {
                return BadRequest(new { message = "Reviews can only be created for completed bookings" });
            }

            // Check if review already exists for this booking (ONE REVIEW PER BOOKING)
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.BookingId == createDto.BookingId);

            if (existingReview != null)
            {
                return BadRequest(new { message = "A review already exists for this booking" });
            }

            // Create review
            var review = new Review
            {
                BookingId = createDto.BookingId,
                Rating = createDto.Rating,
                Comment = createDto.Comment,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var reviewDto = new ReviewDto
            {
                ReviewId = review.ReviewId,
                BookingId = review.BookingId,
                UserName = booking.User.FullName,
                CarMake = booking.Car.Make,
                CarModel = booking.Car.Model,
                Rating = review.Rating,
                Comment = review.Comment,
                Status = review.Status,
                CreatedAt = review.CreatedAt
            };

            return CreatedAtAction(nameof(GetReviews), new { id = review.ReviewId }, reviewDto);
        }

        /// <summary>
        /// Update review status (Admin only)
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateReviewStatus(Guid id, UpdateReviewStatusDto statusDto)
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            review.Status = statusDto.Status;
            review.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Bulk approve reviews (Admin only)
        /// </summary>
        [HttpPost("bulk-approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BulkApproveReviews([FromBody] List<Guid> reviewIds)
        {
            var reviews = await _context.Reviews
                .Where(r => reviewIds.Contains(r.ReviewId))
                .ToListAsync();

            foreach (var review in reviews)
            {
                review.Status = "Approved";
                review.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"{reviews.Count} reviews approved successfully" });
        }

        /// <summary>
        /// Bulk reject reviews (Admin only)
        /// </summary>
        [HttpPost("bulk-reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BulkRejectReviews([FromBody] List<Guid> reviewIds)
        {
            var reviews = await _context.Reviews
                .Where(r => reviewIds.Contains(r.ReviewId))
                .ToListAsync();

            foreach (var review in reviews)
            {
                review.Status = "Rejected";
                review.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"{reviews.Count} reviews rejected successfully" });
        }
    }
}