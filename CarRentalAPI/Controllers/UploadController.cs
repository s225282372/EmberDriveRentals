using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CarRentalAPI.Services;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UploadController : ControllerBase
    {
        private readonly IFileStorageService _fileStorageService;

        public UploadController(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        /// <summary>
        /// Upload a single car image
        /// </summary>
        [HttpPost("car-image")]
        public async Task<IActionResult> UploadCarImage(IFormFile file)
        {
            if (file == null)
            {
                return BadRequest(new { message = "No file provided" });
            }

            var result = await _fileStorageService.UploadImageAsync(file, "cars");

            if (!result.Success)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(new
            {
                message = "Image uploaded successfully",
                filePath = result.FilePath,
                fileName = result.FileName,
                url = _fileStorageService.GetImageUrl(result.FileName!, "cars")
            });
        }

        /// <summary>
        /// Upload multiple car images
        /// </summary>
        [HttpPost("car-images")]
        public async Task<IActionResult> UploadCarImages([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest(new { message = "No files provided" });
            }

            if (files.Count > 10)
            {
                return BadRequest(new { message = "Maximum 10 images allowed per upload" });
            }

            var results = await _fileStorageService.UploadMultipleImagesAsync(files, "cars");

            var successfulUploads = results.Where(r => r.Success).ToList();
            var failedUploads = results.Where(r => !r.Success).ToList();

            return Ok(new
            {
                message = $"{successfulUploads.Count} of {files.Count} images uploaded successfully",
                successCount = successfulUploads.Count,
                failedCount = failedUploads.Count,
                uploadedFiles = successfulUploads.Select(r => new
                {
                    filePath = r.FilePath,
                    fileName = r.FileName,
                    url = _fileStorageService.GetImageUrl(r.FileName!, "cars")
                }),
                errors = failedUploads.Select(r => r.Error)
            });
        }

        /// <summary>
        /// Upload damage report image
        /// </summary>
        [HttpPost("damage-image")]
        [Authorize] // Any authenticated user can upload damage images
        public async Task<IActionResult> UploadDamageImage(IFormFile file)
        {
            if (file == null)
            {
                return BadRequest(new { message = "No file provided" });
            }

            var result = await _fileStorageService.UploadImageAsync(file, "damages");

            if (!result.Success)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(new
            {
                message = "Image uploaded successfully",
                filePath = result.FilePath,
                fileName = result.FileName,
                url = _fileStorageService.GetImageUrl(result.FileName!, "damages")
            });
        }

        /// <summary>
        /// Upload multiple damage report images
        /// </summary>
        [HttpPost("damage-images")]
        [Authorize]
        public async Task<IActionResult> UploadDamageImages([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest(new { message = "No files provided" });
            }

            if (files.Count > 5)
            {
                return BadRequest(new { message = "Maximum 5 images allowed per damage report" });
            }

            var results = await _fileStorageService.UploadMultipleImagesAsync(files, "damages");

            var successfulUploads = results.Where(r => r.Success).ToList();
            var failedUploads = results.Where(r => !r.Success).ToList();

            return Ok(new
            {
                message = $"{successfulUploads.Count} of {files.Count} images uploaded successfully",
                successCount = successfulUploads.Count,
                failedCount = failedUploads.Count,
                uploadedFiles = successfulUploads.Select(r => new
                {
                    filePath = r.FilePath,
                    fileName = r.FileName,
                    url = _fileStorageService.GetImageUrl(r.FileName!, "damages")
                }),
                errors = failedUploads.Select(r => r.Error)
            });
        }

        /// <summary>
        /// Delete an image (Admin only)
        /// </summary>
        [HttpDelete("image")]
        public async Task<IActionResult> DeleteImage([FromQuery] string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return BadRequest(new { message = "File path is required" });
            }

            var result = await _fileStorageService.DeleteImageAsync(filePath);

            if (!result)
            {
                return NotFound(new { message = "File not found or could not be deleted" });
            }

            return Ok(new { message = "Image deleted successfully" });
        }
    }
}