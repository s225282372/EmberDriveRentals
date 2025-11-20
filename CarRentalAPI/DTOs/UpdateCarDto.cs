using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.DTOs
{
    public class UpdateCarDto
    {
        [StringLength(50, ErrorMessage = "Make cannot exceed 50 characters")]
        public string? Make { get; set; }

        [StringLength(50, ErrorMessage = "Model cannot exceed 50 characters")]
        public string? Model { get; set; }

        [Range(1900, 2100, ErrorMessage = "Year must be between 1900 and 2100")]
        public int? Year { get; set; }

        [Range(0.01, 10000, ErrorMessage = "Price must be between 0.01 and 10000")]
        public decimal? PricePerDay { get; set; }

        public List<string>? Features { get; set; }
        public List<string>? ImageUrls { get; set; }

        [RegularExpression("^(Available|Maintenance|Unavailable)$",
            ErrorMessage = "Status must be Available, Maintenance, or Unavailable")]
        public string? Status { get; set; }
    }
}