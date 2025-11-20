using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using CarRentalAPI.Data;
using CarRentalAPI.DTOs;
using CarRentalAPI.Models;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all cars with optional filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarDto>>> GetCars(
            [FromQuery] string? make,
            [FromQuery] string? model,
            [FromQuery] int? year,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? status)
        {
            var query = _context.Cars.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(make))
                query = query.Where(c => c.Make.Contains(make));

            if (!string.IsNullOrEmpty(model))
                query = query.Where(c => c.Model.Contains(model));

            if (year.HasValue)
                query = query.Where(c => c.Year == year.Value);

            if (minPrice.HasValue)
                query = query.Where(c => c.PricePerDay >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(c => c.PricePerDay <= maxPrice.Value);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(c => c.Status == status);

            var cars = await query.ToListAsync();

            var carDtos = cars.Select(c => new CarDto
            {
                CarId = c.CarId,
                Make = c.Make,
                Model = c.Model,
                Year = c.Year,
                PricePerDay = c.PricePerDay,
                Features = string.IsNullOrEmpty(c.Features)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(c.Features),
                ImageUrls = string.IsNullOrEmpty(c.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(c.ImageUrls),
                Status = c.Status,
                CreatedAt = c.CreatedAt
            }).ToList();

            return Ok(carDtos);
        }

        /// <summary>
        /// Get a specific car by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<CarDto>> GetCar(Guid id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            var carDto = new CarDto
            {
                CarId = car.CarId,
                Make = car.Make,
                Model = car.Model,
                Year = car.Year,
                PricePerDay = car.PricePerDay,
                Features = string.IsNullOrEmpty(car.Features)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(car.Features),
                ImageUrls = string.IsNullOrEmpty(car.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(car.ImageUrls),
                Status = car.Status,
                CreatedAt = car.CreatedAt
            };

            return Ok(carDto);
        }

        /// <summary>
        /// Create a new car (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CarDto>> CreateCar(CreateCarDto createCarDto)
        {
            var car = new Car
            {
                Make = createCarDto.Make,
                Model = createCarDto.Model,
                Year = createCarDto.Year,
                PricePerDay = createCarDto.PricePerDay,
                Features = createCarDto.Features != null
                    ? JsonSerializer.Serialize(createCarDto.Features)
                    : null,
                ImageUrls = createCarDto.ImageUrls != null
                    ? JsonSerializer.Serialize(createCarDto.ImageUrls)
                    : null,
                Status = createCarDto.Status,
                CreatedAt = DateTime.UtcNow
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            var carDto = new CarDto
            {
                CarId = car.CarId,
                Make = car.Make,
                Model = car.Model,
                Year = car.Year,
                PricePerDay = car.PricePerDay,
                Features = createCarDto.Features,
                ImageUrls = createCarDto.ImageUrls,
                Status = car.Status,
                CreatedAt = car.CreatedAt
            };

            return CreatedAtAction(nameof(GetCar), new { id = car.CarId }, carDto);
        }

        /// <summary>
        /// Update a car (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCar(Guid id, UpdateCarDto updateCarDto)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(updateCarDto.Make))
                car.Make = updateCarDto.Make;

            if (!string.IsNullOrEmpty(updateCarDto.Model))
                car.Model = updateCarDto.Model;

            if (updateCarDto.Year.HasValue)
                car.Year = updateCarDto.Year.Value;

            if (updateCarDto.PricePerDay.HasValue)
                car.PricePerDay = updateCarDto.PricePerDay.Value;

            if (updateCarDto.Features != null)
                car.Features = JsonSerializer.Serialize(updateCarDto.Features);

            if (updateCarDto.ImageUrls != null)
                car.ImageUrls = JsonSerializer.Serialize(updateCarDto.ImageUrls);

            if (!string.IsNullOrEmpty(updateCarDto.Status))
                car.Status = updateCarDto.Status;

            car.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Delete a car (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCar(Guid id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            // Check if car has any bookings
            var hasBookings = await _context.Bookings.AnyAsync(b => b.CarId == id);
            if (hasBookings)
            {
                return BadRequest(new { message = "Cannot delete car with existing bookings" });
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Check car availability for a date range
        /// </summary>
        [HttpGet("{id}/availability")]
        public async Task<ActionResult<bool>> CheckAvailability(
            Guid id,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            if (car.Status != "Available")
            {
                return Ok(new { available = false, reason = $"Car is currently {car.Status}" });
            }

            // Check for overlapping bookings
            var hasOverlap = await _context.Bookings
                .AnyAsync(b => b.CarId == id
                    && b.Status != "Cancelled"
                    && b.StartDate < endDate
                    && b.EndDate > startDate);

            return Ok(new { available = !hasOverlap });
        }
    }
}