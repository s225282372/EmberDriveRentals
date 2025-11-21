using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using CarRentalAPI.Data;
using CarRentalAPI.DTOs;
using CarRentalAPI.Models;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DamageReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DamageReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all damage reports (Admin sees all, Users see their own)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DamageReportDto>>> GetDamageReports(
            [FromQuery] string? status,
            [FromQuery] string? severity)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var query = _context.DamageReports
                .Include(d => d.Booking)
                    .ThenInclude(b => b.User)
                .Include(d => d.Booking)
                    .ThenInclude(b => b.Car)
                .AsQueryable();

            // Non-admin users can only see damage reports for their own bookings
            if (!isAdmin)
            {
                query = query.Where(d => d.Booking.UserId.ToString() == currentUserId);
            }

            // Apply filters
            if (!string.IsNullOrEmpty(status))
                query = query.Where(d => d.Status == status);

            if (!string.IsNullOrEmpty(severity))
                query = query.Where(d => d.Severity == severity);

            var damageReports = await query
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            var damageReportDtos = damageReports.Select(d => new DamageReportDto
            {
                DamageId = d.DamageId,
                BookingId = d.BookingId,
                UserName = d.Booking.User.FullName,
                UserEmail = d.Booking.User.Email,
                CarMake = d.Booking.Car.Make,
                CarModel = d.Booking.Car.Model,
                Description = d.Description,
                Severity = d.Severity,
                ImageUrls = string.IsNullOrEmpty(d.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(d.ImageUrls),
                Status = d.Status,
                CreatedAt = d.CreatedAt,
                ResolvedAt = d.ResolvedAt
            }).ToList();

            return Ok(damageReportDtos);
        }

        /// <summary>
        /// Get a specific damage report by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<DamageReportDto>> GetDamageReport(Guid id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var damageReport = await _context.DamageReports
                .Include(d => d.Booking)
                    .ThenInclude(b => b.User)
                .Include(d => d.Booking)
                    .ThenInclude(b => b.Car)
                .FirstOrDefaultAsync(d => d.DamageId == id);

            if (damageReport == null)
            {
                return NotFound(new { message = "Damage report not found" });
            }

            // Non-admin users can only view their own damage reports
            if (!isAdmin && damageReport.Booking.UserId.ToString() != currentUserId)
            {
                return Forbid();
            }

            var damageReportDto = new DamageReportDto
            {
                DamageId = damageReport.DamageId,
                BookingId = damageReport.BookingId,
                UserName = damageReport.Booking.User.FullName,
                UserEmail = damageReport.Booking.User.Email,
                CarMake = damageReport.Booking.Car.Make,
                CarModel = damageReport.Booking.Car.Model,
                Description = damageReport.Description,
                Severity = damageReport.Severity,
                ImageUrls = string.IsNullOrEmpty(damageReport.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(damageReport.ImageUrls),
                Status = damageReport.Status,
                CreatedAt = damageReport.CreatedAt,
                ResolvedAt = damageReport.ResolvedAt
            };

            return Ok(damageReportDto);
        }

        /// <summary>
        /// Create a damage report (only for completed bookings)
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<DamageReportDto>> CreateDamageReport(CreateDamageReportDto createDto)
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

            // Only allow damage reports for completed bookings
            if (booking.Status != "Completed")
            {
                return BadRequest(new { message = "Damage reports can only be created for completed bookings" });
            }

            // Create damage report
            var damageReport = new DamageReport
            {
                BookingId = createDto.BookingId,
                Description = createDto.Description,
                Severity = createDto.Severity,
                ImageUrls = createDto.ImageUrls != null
                    ? JsonSerializer.Serialize(createDto.ImageUrls)
                    : null,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.DamageReports.Add(damageReport);
            await _context.SaveChangesAsync();

            var damageReportDto = new DamageReportDto
            {
                DamageId = damageReport.DamageId,
                BookingId = damageReport.BookingId,
                UserName = booking.User.FullName,
                UserEmail = booking.User.Email,
                CarMake = booking.Car.Make,
                CarModel = booking.Car.Model,
                Description = damageReport.Description,
                Severity = damageReport.Severity,
                ImageUrls = createDto.ImageUrls,
                Status = damageReport.Status,
                CreatedAt = damageReport.CreatedAt
            };

            return CreatedAtAction(nameof(GetDamageReport), new { id = damageReport.DamageId }, damageReportDto);
        }

        /// <summary>
        /// Resolve a damage report (Admin only)
        /// </summary>
        [HttpPost("{id}/resolve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResolveDamageReport(Guid id)
        {
            var damageReport = await _context.DamageReports.FindAsync(id);

            if (damageReport == null)
            {
                return NotFound(new { message = "Damage report not found" });
            }

            if (damageReport.Status == "Resolved")
            {
                return BadRequest(new { message = "Damage report is already resolved" });
            }

            damageReport.Status = "Resolved";
            damageReport.ResolvedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Damage report resolved successfully" });
        }
    }
}