using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalAPI.Data;
using CarRentalAPI.DTOs;
using CarRentalAPI.Models;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class MaintenanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MaintenanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all maintenance records with optional filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceRecordDto>>> GetMaintenanceRecords(
            [FromQuery] Guid? carId,
            [FromQuery] string? status,
            [FromQuery] bool? overdue)
        {
            var query = _context.MaintenanceRecords
                .Include(m => m.Car)
                .AsQueryable();

            // Apply filters
            if (carId.HasValue)
                query = query.Where(m => m.CarId == carId.Value);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(m => m.Status == status);

            var maintenanceRecords = await query
                .OrderBy(m => m.Date)
                .ToListAsync();

            var now = DateTime.UtcNow;
            var maintenanceDtos = maintenanceRecords.Select(m =>
            {
                var daysUntilDue = (m.Date - now).Days;
                var isOverdue = m.Status == "Due" && m.Date < now;

                return new MaintenanceRecordDto
                {
                    MaintenanceId = m.MaintenanceId,
                    CarId = m.CarId,
                    CarMake = m.Car.Make,
                    CarModel = m.Car.Model,
                    CarYear = m.Car.Year,
                    Description = m.Description,
                    Date = m.Date,
                    Status = m.Status,
                    CreatedAt = m.CreatedAt,
                    CompletedAt = m.CompletedAt,
                    IsOverdue = isOverdue,
                    DaysUntilDue = daysUntilDue
                };
            }).ToList();

            // Apply overdue filter if specified
            if (overdue.HasValue)
            {
                maintenanceDtos = maintenanceDtos
                    .Where(m => m.IsOverdue == overdue.Value)
                    .ToList();
            }

            return Ok(maintenanceDtos);
        }

        /// <summary>
        /// Get maintenance records for a specific car
        /// </summary>
        [HttpGet("car/{carId}")]
        public async Task<ActionResult<IEnumerable<MaintenanceRecordDto>>> GetCarMaintenanceRecords(Guid carId)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            var maintenanceRecords = await _context.MaintenanceRecords
                .Include(m => m.Car)
                .Where(m => m.CarId == carId)
                .OrderByDescending(m => m.Date)
                .ToListAsync();

            var now = DateTime.UtcNow;
            var maintenanceDtos = maintenanceRecords.Select(m =>
            {
                var daysUntilDue = (m.Date - now).Days;
                var isOverdue = m.Status == "Due" && m.Date < now;

                return new MaintenanceRecordDto
                {
                    MaintenanceId = m.MaintenanceId,
                    CarId = m.CarId,
                    CarMake = m.Car.Make,
                    CarModel = m.Car.Model,
                    CarYear = m.Car.Year,
                    Description = m.Description,
                    Date = m.Date,
                    Status = m.Status,
                    CreatedAt = m.CreatedAt,
                    CompletedAt = m.CompletedAt,
                    IsOverdue = isOverdue,
                    DaysUntilDue = daysUntilDue
                };
            }).ToList();

            return Ok(maintenanceDtos);
        }

        /// <summary>
        /// Get a specific maintenance record
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceRecordDto>> GetMaintenanceRecord(Guid id)
        {
            var maintenance = await _context.MaintenanceRecords
                .Include(m => m.Car)
                .FirstOrDefaultAsync(m => m.MaintenanceId == id);

            if (maintenance == null)
            {
                return NotFound(new { message = "Maintenance record not found" });
            }

            var now = DateTime.UtcNow;
            var daysUntilDue = (maintenance.Date - now).Days;
            var isOverdue = maintenance.Status == "Due" && maintenance.Date < now;

            var maintenanceDto = new MaintenanceRecordDto
            {
                MaintenanceId = maintenance.MaintenanceId,
                CarId = maintenance.CarId,
                CarMake = maintenance.Car.Make,
                CarModel = maintenance.Car.Model,
                CarYear = maintenance.Car.Year,
                Description = maintenance.Description,
                Date = maintenance.Date,
                Status = maintenance.Status,
                CreatedAt = maintenance.CreatedAt,
                CompletedAt = maintenance.CompletedAt,
                IsOverdue = isOverdue,
                DaysUntilDue = daysUntilDue
            };

            return Ok(maintenanceDto);
        }

        /// <summary>
        /// Create a new maintenance record
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<MaintenanceRecordDto>> CreateMaintenanceRecord(CreateMaintenanceRecordDto createDto)
        {
            // Check if car exists
            var car = await _context.Cars.FindAsync(createDto.CarId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            var maintenance = new MaintenanceRecord
            {
                CarId = createDto.CarId,
                Description = createDto.Description,
                Date = createDto.Date,
                Status = createDto.Status,
                CreatedAt = DateTime.UtcNow,
                CompletedAt = createDto.Status == "Completed" ? DateTime.UtcNow : null
            };

            _context.MaintenanceRecords.Add(maintenance);
            await _context.SaveChangesAsync();

            var now = DateTime.UtcNow;
            var daysUntilDue = (maintenance.Date - now).Days;
            var isOverdue = maintenance.Status == "Due" && maintenance.Date < now;

            var maintenanceDto = new MaintenanceRecordDto
            {
                MaintenanceId = maintenance.MaintenanceId,
                CarId = maintenance.CarId,
                CarMake = car.Make,
                CarModel = car.Model,
                CarYear = car.Year,
                Description = maintenance.Description,
                Date = maintenance.Date,
                Status = maintenance.Status,
                CreatedAt = maintenance.CreatedAt,
                CompletedAt = maintenance.CompletedAt,
                IsOverdue = isOverdue,
                DaysUntilDue = daysUntilDue
            };

            return CreatedAtAction(nameof(GetMaintenanceRecord), new { id = maintenance.MaintenanceId }, maintenanceDto);
        }

        /// <summary>
        /// Update a maintenance record
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaintenanceRecord(Guid id, UpdateMaintenanceRecordDto updateDto)
        {
            var maintenance = await _context.MaintenanceRecords.FindAsync(id);

            if (maintenance == null)
            {
                return NotFound(new { message = "Maintenance record not found" });
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(updateDto.Description))
                maintenance.Description = updateDto.Description;

            if (updateDto.Date.HasValue)
                maintenance.Date = updateDto.Date.Value;

            if (!string.IsNullOrEmpty(updateDto.Status))
            {
                maintenance.Status = updateDto.Status;

                // Set CompletedAt when status changes to Completed
                if (updateDto.Status == "Completed" && maintenance.CompletedAt == null)
                {
                    maintenance.CompletedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Mark maintenance as completed
        /// </summary>
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteMaintenanceRecord(Guid id)
        {
            var maintenance = await _context.MaintenanceRecords.FindAsync(id);

            if (maintenance == null)
            {
                return NotFound(new { message = "Maintenance record not found" });
            }

            if (maintenance.Status == "Completed")
            {
                return BadRequest(new { message = "Maintenance is already completed" });
            }

            maintenance.Status = "Completed";
            maintenance.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Maintenance marked as completed" });
        }

        /// <summary>
        /// Delete a maintenance record
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenanceRecord(Guid id)
        {
            var maintenance = await _context.MaintenanceRecords.FindAsync(id);

            if (maintenance == null)
            {
                return NotFound(new { message = "Maintenance record not found" });
            }

            _context.MaintenanceRecords.Remove(maintenance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Get maintenance alerts (overdue and upcoming)
        /// </summary>
        [HttpGet("alerts")]
        public async Task<ActionResult> GetMaintenanceAlerts()
        {
            var now = DateTime.UtcNow;
            var upcomingThreshold = now.AddDays(7); // Next 7 days

            var overdue = await _context.MaintenanceRecords
                .Include(m => m.Car)
                .Where(m => m.Status == "Due" && m.Date < now)
                .OrderBy(m => m.Date)
                .ToListAsync();

            var upcoming = await _context.MaintenanceRecords
                .Include(m => m.Car)
                .Where(m => m.Status == "Due" && m.Date >= now && m.Date <= upcomingThreshold)
                .OrderBy(m => m.Date)
                .ToListAsync();

            var overdueDtos = overdue.Select(m => new MaintenanceRecordDto
            {
                MaintenanceId = m.MaintenanceId,
                CarId = m.CarId,
                CarMake = m.Car.Make,
                CarModel = m.Car.Model,
                CarYear = m.Car.Year,
                Description = m.Description,
                Date = m.Date,
                Status = m.Status,
                CreatedAt = m.CreatedAt,
                IsOverdue = true,
                DaysUntilDue = (m.Date - now).Days
            }).ToList();

            var upcomingDtos = upcoming.Select(m => new MaintenanceRecordDto
            {
                MaintenanceId = m.MaintenanceId,
                CarId = m.CarId,
                CarMake = m.Car.Make,
                CarModel = m.Car.Model,
                CarYear = m.Car.Year,
                Description = m.Description,
                Date = m.Date,
                Status = m.Status,
                CreatedAt = m.CreatedAt,
                IsOverdue = false,
                DaysUntilDue = (m.Date - now).Days
            }).ToList();

            return Ok(new
            {
                overdueCount = overdue.Count,
                upcomingCount = upcoming.Count,
                overdue = overdueDtos,
                upcoming = upcomingDtos
            });
        }
    }
}