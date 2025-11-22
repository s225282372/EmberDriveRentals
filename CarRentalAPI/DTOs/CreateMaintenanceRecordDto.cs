using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.DTOs
{
    public class CreateMaintenanceRecordDto
    {
        [Required(ErrorMessage = "Car ID is required")]
        public Guid CarId { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, MinimumLength = 5, ErrorMessage = "Description must be between 5 and 500 characters")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }

        [RegularExpression("^(Due|Completed)$",
            ErrorMessage = "Status must be Due or Completed")]
        public string Status { get; set; } = "Due";
    }
}