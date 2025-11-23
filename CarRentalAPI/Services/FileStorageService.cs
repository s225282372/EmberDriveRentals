using CarRentalAPI.Helpers;

namespace CarRentalAPI.Services
{
    public interface IFileStorageService
    {
        Task<FileUploadResult> UploadImageAsync(IFormFile file, string folder = "cars");
        Task<bool> DeleteImageAsync(string filePath);
        Task<List<FileUploadResult>> UploadMultipleImagesAsync(List<IFormFile> files, string folder = "cars");
        string GetImageUrl(string fileName, string folder = "cars");
    }

    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly ILogger<FileStorageService> _logger;

        public FileStorageService(
            IWebHostEnvironment environment,
            IConfiguration configuration,
            ILogger<FileStorageService> logger)
        {
            _environment = environment;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<FileUploadResult> UploadImageAsync(IFormFile file, string folder = "cars")
        {
            try
            {
                // Validate the image
                if (!FileUploadHelper.IsValidImage(file, out string validationError))
                {
                    return new FileUploadResult
                    {
                        Success = false,
                        Error = validationError
                    };
                }

                // Create upload directory if it doesn't exist
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", folder);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var fileName = FileUploadHelper.GenerateUniqueFileName(file.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save the file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                var relativeFilePath = $"/uploads/{folder}/{fileName}";

                _logger.LogInformation($"File uploaded successfully: {relativeFilePath}");

                return new FileUploadResult
                {
                    Success = true,
                    FilePath = relativeFilePath,
                    FileName = fileName
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading file: {ex.Message}");
                return new FileUploadResult
                {
                    Success = false,
                    Error = "An error occurred while uploading the file"
                };
            }
        }

        public async Task<List<FileUploadResult>> UploadMultipleImagesAsync(List<IFormFile> files, string folder = "cars")
        {
            var results = new List<FileUploadResult>();

            foreach (var file in files)
            {
                var result = await UploadImageAsync(file, folder);
                results.Add(result);
            }

            return results;
        }

        public async Task<bool> DeleteImageAsync(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return false;

                // Remove leading slash if present
                filePath = filePath.TrimStart('/');

                var fullPath = Path.Combine(_environment.WebRootPath, filePath);

                if (File.Exists(fullPath))
                {
                    await Task.Run(() => File.Delete(fullPath));
                    _logger.LogInformation($"File deleted successfully: {filePath}");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting file: {ex.Message}");
                return false;
            }
        }

        public string GetImageUrl(string fileName, string folder = "cars")
        {
            var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "https://localhost:7000";
            return $"{baseUrl}/uploads/{folder}/{fileName}";
        }
    }
}