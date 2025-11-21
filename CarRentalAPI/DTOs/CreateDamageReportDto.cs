using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.DTOs
{
    public class CreateDamageReportDto
    {
        [Required(ErrorMessage = "Booking ID is required")]
        public Guid BookingId { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 500 characters")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Severity is required")]
        [RegularExpression("^(Low|Medium|High)$",
            ErrorMessage = "Severity must be Low, Medium, or High")]
        public string Severity { get; set; } = "Low";

        public List<string>? ImageUrls { get; set; }
    }
}