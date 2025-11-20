using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.DTOs
{
    public class UpdateBookingStatusDto
    {
        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Pending|Confirmed|Completed|Cancelled)$",
            ErrorMessage = "Status must be Pending, Confirmed, Completed, or Cancelled")]
        public string Status { get; set; } = string.Empty;
    }
}