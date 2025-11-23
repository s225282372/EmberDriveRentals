using Microsoft.EntityFrameworkCore;

namespace CarRentalAPI.Helpers
{
    public class CarSearchParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Status { get; set; }
        public string? SortBy { get; set; } = "make"; // make, model, year, price
        public string? SortOrder { get; set; } = "asc"; // asc, desc
    }

    public class BookingSearchParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
        public string? Status { get; set; }
        public Guid? CarId { get; set; }
        public Guid? UserId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? SortBy { get; set; } = "createdAt"; // createdAt, startDate, totalPrice
        public string? SortOrder { get; set; } = "desc";
    }

    public class ReviewSearchParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
        public Guid? CarId { get; set; }
        public string? Status { get; set; }
        public int? MinRating { get; set; }
        public int? MaxRating { get; set; }
        public string? SortBy { get; set; } = "createdAt";
        public string? SortOrder { get; set; } = "desc";
    }

    public class DamageReportSearchParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
        public string? Status { get; set; }
        public string? Severity { get; set; }
        public Guid? CarId { get; set; }
        public string? SortBy { get; set; } = "createdAt";
        public string? SortOrder { get; set; } = "desc";
    }
}