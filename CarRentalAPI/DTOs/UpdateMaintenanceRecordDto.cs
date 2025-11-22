using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.DTOs
{
    public class UpdateMaintenanceRecordDto
    {
        [StringLength(500, MinimumLength = 5, ErrorMessage = "Description must be between 5 and 500 characters")]
        public string? Description { get; set; }

        public DateTime? Date { get; set; }

        [RegularExpression("^(Due|Completed)$",
            ErrorMessage = "Status must be Due or Completed")]
        public string? Status { get; set; }
    }
}