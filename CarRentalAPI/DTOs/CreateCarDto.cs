using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.DTOs
{
    public class CreateCarDto
    {
        [Required(ErrorMessage = "Make is required")]
        [StringLength(50, ErrorMessage = "Make cannot exceed 50 characters")]
        public string Make { get; set; } = string.Empty;

        [Required(ErrorMessage = "Model is required")]
        [StringLength(50, ErrorMessage = "Model cannot exceed 50 characters")]
        public string Model { get; set; } = string.Empty;

        [Required(ErrorMessage = "Year is required")]
        [Range(1900, 2100, ErrorMessage = "Year must be between 1900 and 2100")]
        public int Year { get; set; }

        [Required(ErrorMessage = "Price per day is required")]
        [Range(0.01, 10000, ErrorMessage = "Price must be between 0.01 and 10000")]
        public decimal PricePerDay { get; set; }

        public List<string>? Features { get; set; }
        public List<string>? ImageUrls { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Available|Maintenance|Unavailable)$",
            ErrorMessage = "Status must be Available, Maintenance, or Unavailable")]
        public string Status { get; set; } = "Available";
    }
}
