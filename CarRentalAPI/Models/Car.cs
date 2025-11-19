using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalAPI.Models
{
    public class Car
    {
        [Key]
        public Guid CarId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Make { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Model { get; set; } = string.Empty;

        [Required]
        public int Year { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerDay { get; set; }

        // Store as JSON string: ["GPS", "Bluetooth", "Backup Camera"]
        public string? Features { get; set; }

        // Store as JSON string: ["url1.jpg", "url2.jpg"]
        public string? ImageUrls { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Available"; // Available, Maintenance, Unavailable

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();
    }
}
