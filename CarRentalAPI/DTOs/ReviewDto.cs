namespace CarRentalAPI.DTOs
{
    public class ReviewDto
    {
        public Guid ReviewId { get; set; }
        public Guid BookingId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string CarMake { get; set; } = string.Empty;
        public string CarModel { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}