using System.ComponentModel.DataAnnotations;

namespace CarRentalAPI.DTOs
{
    public class CreateBookingDto
    {
        [Required(ErrorMessage = "Car ID is required")]
        public Guid CarId { get; set; }

        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (StartDate < DateTime.UtcNow.Date)
            {
                yield return new ValidationResult(
                    "Start date cannot be in the past",
                    new[] { nameof(StartDate) }
                );
            }

            if (EndDate <= StartDate)
            {
                yield return new ValidationResult(
                    "End date must be after start date",
                    new[] { nameof(EndDate) }
                );
            }
        }
    }
}