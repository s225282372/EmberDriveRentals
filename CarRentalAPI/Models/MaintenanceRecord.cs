using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalAPI.Models
{
    public class MaintenanceRecord
    {
        [Key]
        public Guid MaintenanceId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid CarId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Due"; // Due, Completed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        // Navigation properties
        [ForeignKey("CarId")]
        public Car Car { get; set; } = null!;
    }
}
