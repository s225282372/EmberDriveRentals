using Microsoft.EntityFrameworkCore;

namespace CarRentalAPI.Helpers
{
    public class FileUploadResult
    {
        public bool Success { get; set; }
        public string? FilePath { get; set; }
        public string? FileName { get; set; }
        public string? Error { get; set; }
    }

    public static class FileUploadHelper
    {
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

        public static bool IsValidImage(IFormFile file, out string error)
        {
            error = string.Empty;

            if (file == null || file.Length == 0)
            {
                error = "File is empty";
                return false;
            }

            if (file.Length > MaxFileSize)
            {
                error = $"File size exceeds the maximum allowed size of {MaxFileSize / 1024 / 1024}MB";
                return false;
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                error = $"File type not allowed. Allowed types: {string.Join(", ", AllowedExtensions)}";
                return false;
            }

            // Additional validation: check actual file content (magic numbers)
            if (!IsValidImageContent(file))
            {
                error = "File content is not a valid image";
                return false;
            }

            return true;
        }

        private static bool IsValidImageContent(IFormFile file)
        {
            try
            {
                using var stream = file.OpenReadStream();
                var header = new byte[8];
                stream.Read(header, 0, 8);

                // Check magic numbers for common image formats
                // JPEG: FF D8 FF
                if (header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
                    return true;

                // PNG: 89 50 4E 47 0D 0A 1A 0A
                if (header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47)
                    return true;

                // GIF: 47 49 46 38
                if (header[0] == 0x47 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x38)
                    return true;

                // WEBP: 52 49 46 46 (RIFF)
                if (header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46)
                    return true;

                return false;
            }
            catch
            {
                return false;
            }
        }

        public static string GenerateUniqueFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            return fileName;
        }
    }
}
