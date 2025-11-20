namespace CarRentalAPI.DTOs
{
    public class CarDto
    {
        public Guid CarId { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal PricePerDay { get; set; }
        public List<string>? Features { get; set; }
        public List<string>? ImageUrls { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}