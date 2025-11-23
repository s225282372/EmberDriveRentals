using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using CarRentalAPI.Data;
using CarRentalAPI.DTOs;
using CarRentalAPI.Models;
using CarRentalAPI.Helpers;
using CarRentalAPI.Services;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileStorageService _fileStorageService;

        public CarsController(ApplicationDbContext context, IFileStorageService fileStorageService)
        {
            _context = context;
            _fileStorageService = fileStorageService;
        }

        /// <summary>
        /// Get all cars with pagination and advanced search
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<PagedResponse<CarDto>>> GetCars([FromQuery] CarSearchParams searchParams)
        {
            var query = _context.Cars.AsQueryable();

            // Search term (searches in make, model, and features)
            if (!string.IsNullOrEmpty(searchParams.SearchTerm))
            {
                var searchTerm = searchParams.SearchTerm.ToLower();
                query = query.Where(c =>
                    c.Make.ToLower().Contains(searchTerm) ||
                    c.Model.ToLower().Contains(searchTerm) ||
                    (c.Features != null && c.Features.ToLower().Contains(searchTerm))
                );
            }

            // Apply filters
            if (!string.IsNullOrEmpty(searchParams.Make))
                query = query.Where(c => c.Make.ToLower().Contains(searchParams.Make.ToLower()));

            if (!string.IsNullOrEmpty(searchParams.Model))
                query = query.Where(c => c.Model.ToLower().Contains(searchParams.Model.ToLower()));

            if (searchParams.Year.HasValue)
                query = query.Where(c => c.Year == searchParams.Year.Value);

            if (searchParams.MinPrice.HasValue)
                query = query.Where(c => c.PricePerDay >= searchParams.MinPrice.Value);

            if (searchParams.MaxPrice.HasValue)
                query = query.Where(c => c.PricePerDay <= searchParams.MaxPrice.Value);

            if (!string.IsNullOrEmpty(searchParams.Status))
                query = query.Where(c => c.Status == searchParams.Status);

            // Sorting
            query = searchParams.SortBy?.ToLower() switch
            {
                "model" => searchParams.SortOrder == "desc"
                    ? query.OrderByDescending(c => c.Model)
                    : query.OrderBy(c => c.Model),
                "year" => searchParams.SortOrder == "desc"
                    ? query.OrderByDescending(c => c.Year)
                    : query.OrderBy(c => c.Year),
                "price" => searchParams.SortOrder == "desc"
                    ? query.OrderByDescending(c => c.PricePerDay)
                    : query.OrderBy(c => c.PricePerDay),
                _ => searchParams.SortOrder == "desc"
                    ? query.OrderByDescending(c => c.Make)
                    : query.OrderBy(c => c.Make)
            };

            // Get paginated results
            var pagedCars = await query.ToPagedResponseAsync(
                searchParams.PageNumber,
                searchParams.PageSize
            );

            // Map to DTOs
            var carDtos = pagedCars.Items.Select(c => new CarDto
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

            // Return paginated response with DTOs
            var response = new PagedResponse<CarDto>
            {
                CurrentPage = pagedCars.CurrentPage,
                TotalPages = pagedCars.TotalPages,
                PageSize = pagedCars.PageSize,
                TotalCount = pagedCars.TotalCount,
                HasPrevious = pagedCars.HasPrevious,
                HasNext = pagedCars.HasNext,
                Items = carDtos
            };

            return Ok(response);
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

            // Delete associated images
            if (!string.IsNullOrEmpty(car.ImageUrls))
            {
                var imageUrls = JsonSerializer.Deserialize<List<string>>(car.ImageUrls);
                if (imageUrls != null)
                {
                    foreach (var imageUrl in imageUrls)
                    {
                        await _fileStorageService.DeleteImageAsync(imageUrl);
                    }
                }
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Upload images for a car (Admin only)
        /// </summary>
        [HttpPost("{id}/images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadCarImages(Guid id, [FromForm] List<IFormFile> files)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            if (files == null || files.Count == 0)
            {
                return BadRequest(new { message = "No files provided" });
            }

            if (files.Count > 10)
            {
                return BadRequest(new { message = "Maximum 10 images allowed per car" });
            }

            var results = await _fileStorageService.UploadMultipleImagesAsync(files, "cars");
            var successfulUploads = results.Where(r => r.Success).Select(r => r.FilePath).ToList();

            if (successfulUploads.Any())
            {
                // Get existing image URLs
                var existingImages = string.IsNullOrEmpty(car.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(car.ImageUrls) ?? new List<string>();

                // Add new images
                existingImages.AddRange(successfulUploads!);

                // Update car
                car.ImageUrls = JsonSerializer.Serialize(existingImages);
                car.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = $"{successfulUploads.Count} images uploaded successfully",
                imageUrls = successfulUploads
            });
        }

        /// <summary>
        /// Delete a specific image from a car (Admin only)
        /// </summary>
        [HttpDelete("{id}/images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCarImage(Guid id, [FromQuery] string imageUrl)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            if (string.IsNullOrEmpty(car.ImageUrls))
            {
                return NotFound(new { message = "Car has no images" });
            }

            var imageUrls = JsonSerializer.Deserialize<List<string>>(car.ImageUrls);
            if (imageUrls == null || !imageUrls.Contains(imageUrl))
            {
                return NotFound(new { message = "Image not found" });
            }

            // Delete from file system
            await _fileStorageService.DeleteImageAsync(imageUrl);

            // Remove from database
            imageUrls.Remove(imageUrl);
            car.ImageUrls = JsonSerializer.Serialize(imageUrls);
            car.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Image deleted successfully" });
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