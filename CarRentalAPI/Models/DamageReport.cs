using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalAPI.Models
{
    public class DamageReport
    {
        [Key]
        public Guid DamageId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid BookingId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Severity { get; set; } = "Low"; // Low, Medium, High

        // Store as JSON string: ["image1.jpg", "image2.jpg"]
        public string? ImageUrls { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Resolved

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }

        // Navigation properties
        [ForeignKey("BookingId")]
        public Booking Booking { get; set; } = null!;
    }
}
