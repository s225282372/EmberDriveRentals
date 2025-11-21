using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.DTOs
{
    public class UpdateReviewStatusDto
    {
        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Pending|Approved|Rejected)$",
            ErrorMessage = "Status must be Pending, Approved, or Rejected")]
        public string Status { get; set; } = string.Empty;
    }
}