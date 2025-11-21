namespace CarRentalAPI.DTOs
{
    public class DamageReportDto
    {
        public Guid DamageId { get; set; }
        public Guid BookingId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string CarMake { get; set; } = string.Empty;
        public string CarModel { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public List<string>? ImageUrls { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }
}